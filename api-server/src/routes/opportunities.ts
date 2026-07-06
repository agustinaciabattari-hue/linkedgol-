import { Router, type IRouter } from "express";
import { db, opportunitiesTable, clubsTable, messagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireUser } from "./auth";
import { sendContactRelayEmail } from "../lib/email";
import { authLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

// Public-safe projection: the club's contact email is never sent to the
// browser. Players apply through the relay endpoint below instead.
const publicOpportunityColumns = {
  id: opportunitiesTable.id,
  title: opportunitiesTable.title,
  description: opportunitiesTable.description,
  country: opportunitiesTable.country,
  clubName: opportunitiesTable.clubName,
  role: opportunitiesTable.role,
  createdAt: opportunitiesTable.createdAt,
};

router.get("/opportunities", async (_req, res) => {
  try {
    const opps = await db.select(publicOpportunityColumns).from(opportunitiesTable);
    res.json(opps);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener oportunidades" });
  }
});

// GET /opportunities/mine — a club's own published opportunities, full
// detail (their own email is fine to show back to themselves).
// Placed before /:id-style routes aren't an issue here since this route
// has its own fixed path segment, but keep it above POST for readability.
router.get("/opportunities/mine", requireUser, async (req, res) => {
  try {
    const user = (req as any).authUser;
    if (user.role !== "club" || !user.clubId) {
      return res.status(403).json({ error: "Solo los clubes tienen oportunidades propias" });
    }
    const opps = await db.select().from(opportunitiesTable).where(eq(opportunitiesTable.clubId, user.clubId));
    res.json(opps);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener tus oportunidades" });
  }
});

// POST /opportunities — only clubs can publish, and only while logged in.
// clubName/email are taken from the authenticated club's own profile, never
// from the request body, so a club can't impersonate another one.
router.post("/opportunities", authLimiter, requireUser, async (req, res) => {
  try {
    const user = (req as any).authUser;
    if (user.role !== "club" || !user.clubId) {
      return res.status(403).json({ error: "Solo los clubes pueden publicar oportunidades" });
    }

    const [club] = await db.select().from(clubsTable).where(eq(clubsTable.id, user.clubId));
    if (!club) return res.status(404).json({ error: "Club no encontrado" });

    const { title, description, role } = req.body || {};
    if (!title || !role) {
      return res.status(400).json({ error: "Faltan campos obligatorios: título y rol" });
    }

    const [opp] = await db.insert(opportunitiesTable).values({
      title,
      description: description || null,
      country: club.country,
      clubName: club.name,
      clubId: club.id,
      role,
      email: club.email,
    }).returning();

    const { email: _omit, ...publicOpp } = opp;
    res.status(201).json(publicOpp);
  } catch (err) {
    console.error("Create opportunity error:", err);
    res.status(500).json({ error: "Error al crear oportunidad" });
  }
});

// DELETE /opportunities/:id — a club can remove its own listing.
router.delete("/opportunities/:id", requireUser, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = (req as any).authUser;
    const [opp] = await db.select().from(opportunitiesTable).where(eq(opportunitiesTable.id, id));
    if (!opp) return res.status(404).json({ error: "Oportunidad no encontrada" });
    if (opp.clubId !== user.clubId) return res.status(403).json({ error: "No podés borrar esta oportunidad" });

    await db.delete(opportunitiesTable).where(eq(opportunitiesTable.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar oportunidad" });
  }
});

// POST /opportunities/:id/apply — relays the applicant's message to the
// club's private email without exposing that address to the browser.
router.post("/opportunities/:id/apply", authLimiter, requireUser, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { message } = req.body || {};

    const [opp] = await db.select().from(opportunitiesTable).where(eq(opportunitiesTable.id, id));
    if (!opp) return res.status(404).json({ error: "Oportunidad no encontrada" });
    if (!opp.email) return res.status(400).json({ error: "Esta oportunidad no tiene un email de contacto configurado" });

    const sender = (req as any).authUser;
    const finalMessage = message && message.trim() ? message : "Estoy interesado/a en esta oportunidad.";

    await db.insert(messagesTable).values({
      type: "opportunity_application",
      fromEmail: sender.email,
      context: opp.title,
      subject: `Postulación a "${opp.title}"`,
      body: finalMessage,
    });

    await sendContactRelayEmail({
      to: opp.email,
      fromName: sender.email,
      fromEmail: sender.email,
      subject: `Nueva postulación a "${opp.title}" desde Linkedgol`,
      message: finalMessage,
    });

    res.json({ sent: true });
  } catch (err) {
    console.error("Apply to opportunity error:", err);
    res.status(500).json({ error: "Error al enviar la postulación" });
  }
});

export default router;
