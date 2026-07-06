import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db, playersTable, agentsTable, clubsTable, siteContentTable, insertPlayerSchema, insertAgentSchema, insertClubSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { JWT_SECRET } from "../lib/jwtSecret";
import { authLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token) return res.status(401).json({ error: "No autorizado" });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { admin?: boolean };
    if (!payload.admin) return res.status(401).json({ error: "No autorizado" });
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// Constant-time string comparison so an attacker can't infer the password
// character-by-character from response timing.
function safeCompare(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // Pad to equal length first — timingSafeEqual throws on length mismatch,
  // and a length-dependent early exit would itself leak information.
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

router.post("/admin/login", authLimiter, (req, res) => {
  const { password } = req.body || {};
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: "Admin no configurado" });
  }
  if (typeof password !== "string" || !safeCompare(password, ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }
  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

router.get("/admin/players", requireAdmin, async (_req, res) => {
  try {
    const players = await db.select().from(playersTable);
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
});

router.get("/admin/agents", requireAdmin, async (_req, res) => {
  try {
    const agents = await db.select().from(agentsTable);
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener agentes" });
  }
});

router.get("/admin/clubs", requireAdmin, async (_req, res) => {
  try {
    const clubs = await db.select().from(clubsTable);
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener clubes" });
  }
});

router.patch("/admin/players/:id/verify", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const verified = !!req.body?.verified;
    const [player] = await db.update(playersTable).set({ verified }).where(eq(playersTable.id, id)).returning();
    if (!player) return res.status(404).json({ error: "No encontrado" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

router.patch("/admin/players/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = insertPlayerSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const [player] = await db.update(playersTable).set(parsed.data).where(eq(playersTable.id, id)).returning();
    if (!player) return res.status(404).json({ error: "No encontrado" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

router.delete("/admin/players/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(playersTable).where(eq(playersTable.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

router.patch("/admin/agents/:id/verify", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const verified = !!req.body?.verified;
    const [agent] = await db.update(agentsTable).set({ verified }).where(eq(agentsTable.id, id)).returning();
    if (!agent) return res.status(404).json({ error: "No encontrado" });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

router.patch("/admin/agents/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = insertAgentSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const [agent] = await db.update(agentsTable).set(parsed.data).where(eq(agentsTable.id, id)).returning();
    if (!agent) return res.status(404).json({ error: "No encontrado" });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

router.delete("/admin/agents/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(agentsTable).where(eq(agentsTable.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

router.patch("/admin/clubs/:id/verify", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const verified = !!req.body?.verified;
    const [club] = await db.update(clubsTable).set({ verified }).where(eq(clubsTable.id, id)).returning();
    if (!club) return res.status(404).json({ error: "No encontrado" });
    res.json(club);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

router.patch("/admin/clubs/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = insertClubSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const [club] = await db.update(clubsTable).set(parsed.data).where(eq(clubsTable.id, id)).returning();
    if (!club) return res.status(404).json({ error: "No encontrado" });
    res.json(club);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

router.delete("/admin/clubs/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(clubsTable).where(eq(clubsTable.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

// --- Admin: create new profiles (auto-verified) ---

router.post("/admin/players", requireAdmin, async (req, res) => {
  try {
    const parsed = insertPlayerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const [player] = await db.insert(playersTable).values({ ...parsed.data, verified: true }).returning();
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: "Error al crear jugador" });
  }
});

router.post("/admin/agents", requireAdmin, async (req, res) => {
  try {
    const parsed = insertAgentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const [agent] = await db.insert(agentsTable).values({ ...parsed.data, verified: true }).returning();
    res.status(201).json(agent);
  } catch (err) {
    res.status(500).json({ error: "Error al crear agente" });
  }
});

router.post("/admin/clubs", requireAdmin, async (req, res) => {
  try {
    const parsed = insertClubSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const [club] = await db.insert(clubsTable).values({ ...parsed.data, verified: true }).returning();
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ error: "Error al crear club" });
  }
});

// --- Site content (key-value editable content) ---

// GET /site-content — public, used by every page to render editable copy
// with graceful fallbacks. This was missing from the original export even
// though the frontend has always called it and the admin editor existed to
// write to it — without this route, saved content never actually showed up
// on the live site.
router.get("/site-content", async (_req, res) => {
  try {
    const content = await db.select().from(siteContentTable);
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el contenido del sitio" });
  }
});

router.put("/admin/site-content", requireAdmin, async (req, res) => {
  try {
    const key = typeof req.body?.key === "string" ? req.body.key.trim() : "";
    const value = typeof req.body?.value === "string" ? req.body.value : "";
    if (!key) return res.status(400).json({ error: "Falta el key" });
    const [row] = await db
      .insert(siteContentTable)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteContentTable.key, set: { value, updatedAt: new Date() } })
      .returning();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar contenido" });
  }
});

export default router;
