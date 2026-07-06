import { Router, type IRouter } from "express";
import { db, curatedOffersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireUser } from "./auth";
import { requireAdmin } from "./admin";
import { sendCuratedOfferApplicationEmail } from "../lib/email";
import { authLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

const publicColumns = {
  id: curatedOffersTable.id,
  title: curatedOffersTable.title,
  league: curatedOffersTable.league,
  position: curatedOffersTable.position,
  characteristics: curatedOffersTable.characteristics,
  salaryApprox: curatedOffersTable.salaryApprox,
  transferValueApprox: curatedOffersTable.transferValueApprox,
  createdAt: curatedOffersTable.createdAt,
};

// GET /curated-offers — public, only the active ones, no admin-only fields.
router.get("/curated-offers", async (_req, res) => {
  try {
    const offers = await db
      .select(publicColumns)
      .from(curatedOffersTable)
      .where(eq(curatedOffersTable.active, true));
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las ofertas" });
  }
});

// POST /curated-offers/:id/apply — a logged-in player (or any user) applies;
// relayed by email, doesn't expose any internal inbox to the frontend.
router.post("/curated-offers/:id/apply", authLimiter, requireUser, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { message } = req.body || {};

    const [offer] = await db.select().from(curatedOffersTable).where(eq(curatedOffersTable.id, id));
    if (!offer || !offer.active) return res.status(404).json({ error: "Oferta no encontrada" });

    const sender = (req as any).authUser;
    await sendCuratedOfferApplicationEmail({
      offerTitle: offer.title,
      applicantEmail: sender.email,
      message: message && message.trim() ? message : "Estoy interesado/a en esta oferta.",
    });

    res.json({ sent: true });
  } catch (err) {
    console.error("Apply to curated offer error:", err);
    res.status(500).json({ error: "Error al enviar la postulación" });
  }
});

// ---- Admin management ----

// GET /admin/curated-offers — all offers, including inactive ones.
router.get("/admin/curated-offers", requireAdmin, async (_req, res) => {
  try {
    const offers = await db.select().from(curatedOffersTable);
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las ofertas" });
  }
});

router.post("/admin/curated-offers", requireAdmin, async (req, res) => {
  try {
    const { title, league, position, characteristics, salaryApprox, transferValueApprox, active } = req.body || {};
    if (!title || !league || !position) {
      return res.status(400).json({ error: "Faltan campos obligatorios: título, liga y posición" });
    }
    const [offer] = await db
      .insert(curatedOffersTable)
      .values({ title, league, position, characteristics, salaryApprox, transferValueApprox, active: active ?? true })
      .returning();
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ error: "Error al crear la oferta" });
  }
});

router.patch("/admin/curated-offers/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, league, position, characteristics, salaryApprox, transferValueApprox, active } = req.body || {};
    const [offer] = await db
      .update(curatedOffersTable)
      .set({ title, league, position, characteristics, salaryApprox, transferValueApprox, active })
      .where(eq(curatedOffersTable.id, id))
      .returning();
    if (!offer) return res.status(404).json({ error: "Oferta no encontrada" });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar la oferta" });
  }
});

router.delete("/admin/curated-offers/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(curatedOffersTable).where(eq(curatedOffersTable.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar la oferta" });
  }
});

export default router;
