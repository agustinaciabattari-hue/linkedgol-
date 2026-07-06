import { Router, type IRouter } from "express";
import { db, playersTable, messagesTable } from "@workspace/db";
import { eq, and, gte, lte } from "drizzle-orm";
import { requireUser } from "./auth";
import { sendContactRelayEmail } from "../lib/email";
import { authLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

// Public-safe projection: never expose email/phone on public endpoints.
// Contact happens through the relay endpoint below instead.
const publicPlayerColumns = {
  id: playersTable.id,
  name: playersTable.name,
  position: playersTable.position,
  age: playersTable.age,
  nationality: playersTable.nationality,
  otherCitizenships: playersTable.otherCitizenships,
  status: playersTable.status,
  location: playersTable.location,
  bio: playersTable.bio,
  videoUrl: playersTable.videoUrl,
  imageUrl: playersTable.imageUrl,
  goals: playersTable.goals,
  assists: playersTable.assists,
  matches: playersTable.matches,
  verified: playersTable.verified,
  createdAt: playersTable.createdAt,
};

router.get("/players", async (req, res) => {
  try {
    const { position, nationality, status, minAge, maxAge } = req.query;
    const conditions = [];
    if (position) conditions.push(eq(playersTable.position, position as string));
    if (nationality) conditions.push(eq(playersTable.nationality, nationality as string));
    if (status) conditions.push(eq(playersTable.status, status as string));
    if (minAge) conditions.push(gte(playersTable.age, Number(minAge)));
    if (maxAge) conditions.push(lte(playersTable.age, Number(maxAge)));

    const players = conditions.length > 0
      ? await db.select(publicPlayerColumns).from(playersTable).where(and(...conditions))
      : await db.select(publicPlayerColumns).from(playersTable);
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
});

router.get("/players/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [player] = await db.select(publicPlayerColumns).from(playersTable).where(eq(playersTable.id, id));
    if (!player) return res.status(404).json({ error: "Jugador no encontrado" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener jugador" });
  }
});

// POST /players/:id/contact — relays a message to the player's private
// email without ever exposing that address to the browser. Requires the
// sender to be logged in (agents/clubs reaching out to a player).
router.post("/players/:id/contact", authLimiter, requireUser, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { message } = req.body || {};
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "El mensaje no puede estar vacío" });
    }

    const [player] = await db.select().from(playersTable).where(eq(playersTable.id, id));
    if (!player) return res.status(404).json({ error: "Jugador no encontrado" });
    if (!player.email) return res.status(400).json({ error: "Este jugador no tiene un email de contacto configurado" });

    const sender = (req as any).authUser;

    await db.insert(messagesTable).values({
      type: "player_contact",
      fromEmail: sender.email,
      context: player.name,
      subject: `Contacto a jugador: ${player.name}`,
      body: message,
    });

    await sendContactRelayEmail({
      to: player.email,
      fromName: sender.email,
      fromEmail: sender.email,
      subject: `Nuevo contacto desde Linkedgol sobre tu perfil`,
      message,
    });

    res.json({ sent: true });
  } catch (err) {
    console.error("Contact player error:", err);
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
});

export default router;
