import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { db, usersTable, playersTable, agentsTable, clubsTable, insertPlayerSchema, insertAgentSchema, insertClubSchema } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { authLimiter, forgotPasswordLimiter } from "../middlewares/rateLimit";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/email";
import { JWT_SECRET } from "../lib/jwtSecret";

const router: IRouter = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const SALT_ROUNDS = 10;
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function signToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
}

export async function requireUser(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token) return res.status(401).json({ error: "No autorizado" });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId));
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });
    (req as any).authUser = user;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

async function getProfile(user: typeof usersTable.$inferSelect) {
  if (user.role === "player" && user.playerId) {
    const [p] = await db.select().from(playersTable).where(eq(playersTable.id, user.playerId));
    return p || null;
  }
  if (user.role === "agent" && user.agentId) {
    const [a] = await db.select().from(agentsTable).where(eq(agentsTable.id, user.agentId));
    return a || null;
  }
  if (user.role === "club" && user.clubId) {
    const [c] = await db.select().from(clubsTable).where(eq(clubsTable.id, user.clubId));
    return c || null;
  }
  return null;
}

// POST /auth/register
router.post("/auth/register", authLimiter, async (req, res) => {
  try {
    const { role, email, password, ...profileData } = req.body || {};

    if (!role || !email || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios: rol, email y contraseña" });
    }
    if (!["player", "agent", "club"].includes(role)) {
      return res.status(400).json({ error: "Rol inválido. Debe ser player, agent o club" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (existing.length > 0) {
      return res.status(409).json({ error: "Ya existe una cuenta con ese email" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    let playerId: number | null = null;
    let agentId: number | null = null;
    let clubId: number | null = null;

    if (role === "player") {
      const parsed = insertPlayerSchema.safeParse({ ...profileData, email });
      if (!parsed.success) return res.status(400).json({ error: "Datos de jugador inválidos" });
      const [player] = await db.insert(playersTable).values(parsed.data).returning();
      playerId = player.id;
    } else if (role === "agent") {
      const parsed = insertAgentSchema.safeParse({ ...profileData, email });
      if (!parsed.success) return res.status(400).json({ error: "Datos de agente inválidos" });
      const [agent] = await db.insert(agentsTable).values(parsed.data).returning();
      agentId = agent.id;
    } else if (role === "club") {
      const parsed = insertClubSchema.safeParse({ ...profileData, email });
      if (!parsed.success) return res.status(400).json({ error: "Datos de club inválidos" });
      const [club] = await db.insert(clubsTable).values(parsed.data).returning();
      clubId = club.id;
    }

    const verificationToken = generateToken();
    const verificationTokenExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

    const [user] = await db.insert(usersTable).values({
      email: email.toLowerCase(),
      passwordHash,
      role,
      playerId,
      agentId,
      clubId,
      emailVerified: false,
      verificationToken,
      verificationTokenExpiresAt,
    }).returning();

    // Don't let a flaky email provider block account creation.
    sendVerificationEmail(user.email, verificationToken).catch((err) => {
      console.error("Failed to send verification email:", err);
    });

    const token = signToken(user.id);
    const profile = await getProfile(user);

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, role: user.role, playerId: user.playerId, agentId: user.agentId, clubId: user.clubId, emailVerified: user.emailVerified },
      profile,
    });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Error al registrar" });
  }
});

// POST /auth/google — Sign in (or sign up) with a Google ID token.
// `role` is required only the first time (creating a brand-new account);
// an existing account is matched purely by email and logs in regardless
// of what role was passed.
router.post("/auth/google", authLimiter, async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(500).json({ error: "El login con Google no está configurado en el servidor" });
    }
    const { credential, role } = req.body || {};
    if (!credential) return res.status(400).json({ error: "Falta el token de Google" });

    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ error: "No se pudo verificar la cuenta de Google" });

    const email = payload.email.toLowerCase();
    const name = payload.name || email.split("@")[0];

    const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (existingUser) {
      const token = signToken(existingUser.id);
      const profile = await getProfile(existingUser);
      return res.json({
        token,
        user: { id: existingUser.id, email: existingUser.email, role: existingUser.role, playerId: existingUser.playerId, agentId: existingUser.agentId, clubId: existingUser.clubId, emailVerified: existingUser.emailVerified },
        profile,
      });
    }

    // Brand-new account — needs a role to know which profile table to create.
    if (!role || !["player", "agent", "club"].includes(role)) {
      return res.status(400).json({ error: "Elegí si te registrás como jugador, agente o club para crear tu cuenta" });
    }

    // Google already verified this email is real, so the account starts
    // as verified — no need to send our own confirmation email.
    // The password is a random, never-shown value; the person can set a
    // real one later via "forgot password" if they ever want email+password login too.
    const randomPassword = crypto.randomBytes(24).toString("hex");
    const passwordHash = await bcrypt.hash(randomPassword, SALT_ROUNDS);

    let playerId: number | null = null;
    let agentId: number | null = null;
    let clubId: number | null = null;

    if (role === "player") {
      const [player] = await db.insert(playersTable).values({
        name, email, position: "Sin especificar", age: 18, nationality: "Sin especificar",
      }).returning();
      playerId = player.id;
    } else if (role === "agent") {
      const [agent] = await db.insert(agentsTable).values({
        name, email, country: "Sin especificar",
      }).returning();
      agentId = agent.id;
    } else if (role === "club") {
      const [club] = await db.insert(clubsTable).values({
        name, email, country: "Sin especificar",
      }).returning();
      clubId = club.id;
    }

    const [user] = await db.insert(usersTable).values({
      email,
      passwordHash,
      role,
      playerId,
      agentId,
      clubId,
      emailVerified: true,
    }).returning();

    const token = signToken(user.id);
    const profile = await getProfile(user);

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, role: user.role, playerId: user.playerId, agentId: user.agentId, clubId: user.clubId, emailVerified: user.emailVerified },
      profile,
      newAccount: true,
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ error: "Error al iniciar sesión con Google" });
  }
});

// POST /auth/login
router.post("/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email y contraseña requeridos" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (!user) return res.status(401).json({ error: "Email o contraseña incorrectos" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Email o contraseña incorrectos" });

    const token = signToken(user.id);
    const profile = await getProfile(user);

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, playerId: user.playerId, agentId: user.agentId, clubId: user.clubId, emailVerified: user.emailVerified },
      profile,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// GET /auth/me
router.get("/auth/me", requireUser, async (req, res) => {
  try {
    const user = (req as any).authUser;
    const profile = await getProfile(user);
    res.json({
      user: { id: user.id, email: user.email, role: user.role, playerId: user.playerId, agentId: user.agentId, clubId: user.clubId, emailVerified: user.emailVerified },
      profile,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

// PATCH /auth/profile
router.patch("/auth/profile", requireUser, async (req, res) => {
  try {
    const user = (req as any).authUser;
    let profile = null;

    if (user.role === "player" && user.playerId) {
      const parsed = insertPlayerSchema.partial().safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Datos inválidos" });
      const [p] = await db.update(playersTable).set(parsed.data).where(eq(playersTable.id, user.playerId)).returning();
      profile = p;
    } else if (user.role === "agent" && user.agentId) {
      const parsed = insertAgentSchema.partial().safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Datos inválidos" });
      const [a] = await db.update(agentsTable).set(parsed.data).where(eq(agentsTable.id, user.agentId)).returning();
      profile = a;
    } else if (user.role === "club" && user.clubId) {
      const parsed = insertClubSchema.partial().safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Datos inválidos" });
      const [c] = await db.update(clubsTable).set(parsed.data).where(eq(clubsTable.id, user.clubId)).returning();
      profile = c;
    }

    res.json({
      user: { id: user.id, email: user.email, role: user.role, playerId: user.playerId, agentId: user.agentId, clubId: user.clubId },
      profile,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
});

// GET /auth/verify-email?token=...
router.get("/auth/verify-email", async (req, res) => {
  try {
    const token = String(req.query.token || "");
    if (!token) return res.status(400).json({ error: "Falta el token de verificación" });

    const [user] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.verificationToken, token), gt(usersTable.verificationTokenExpiresAt, new Date())));

    if (!user) {
      return res.status(400).json({ error: "El enlace de verificación es inválido o expiró" });
    }

    await db
      .update(usersTable)
      .set({ emailVerified: true, verificationToken: null, verificationTokenExpiresAt: null })
      .where(eq(usersTable.id, user.id));

    res.json({ verified: true });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ error: "Error al verificar el email" });
  }
});

// POST /auth/resend-verification
router.post("/auth/resend-verification", authLimiter, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Falta el email" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, String(email).toLowerCase()));

    // Always respond success-shaped to avoid leaking whether an email is registered.
    if (!user || user.emailVerified) {
      return res.json({ sent: true });
    }

    const verificationToken = generateToken();
    const verificationTokenExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
    await db
      .update(usersTable)
      .set({ verificationToken, verificationTokenExpiresAt })
      .where(eq(usersTable.id, user.id));

    await sendVerificationEmail(user.email, verificationToken);
    res.json({ sent: true });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ error: "Error al reenviar la verificación" });
  }
});

// POST /auth/forgot-password
router.post("/auth/forgot-password", forgotPasswordLimiter, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Falta el email" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, String(email).toLowerCase()));

    // Always respond success-shaped, whether or not the account exists,
    // so this endpoint can't be used to enumerate registered emails.
    if (!user) return res.json({ sent: true });

    const resetToken = generateToken();
    const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await db
      .update(usersTable)
      .set({ resetToken, resetTokenExpiresAt })
      .where(eq(usersTable.id, user.id));

    await sendPasswordResetEmail(user.email, resetToken);
    res.json({ sent: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

// POST /auth/reset-password
router.post("/auth/reset-password", authLimiter, async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ error: "Faltan datos" });
    if (password.length < 6) return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });

    const [user] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.resetToken, token), gt(usersTable.resetTokenExpiresAt, new Date())));

    if (!user) {
      return res.status(400).json({ error: "El enlace de recuperación es inválido o expiró" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await db
      .update(usersTable)
      .set({ passwordHash, resetToken: null, resetTokenExpiresAt: null })
      .where(eq(usersTable.id, user.id));

    res.json({ reset: true });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Error al restablecer la contraseña" });
  }
});

export default router;
