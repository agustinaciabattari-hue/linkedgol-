import { Router, type IRouter } from "express";
import { db, playersTable, agentsTable, clubsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

// GET /stats — public counts only (no names, emails, or any personal data).
// Used to show real numbers on the homepage instead of hardcoded placeholders.
router.get("/stats", async (_req, res) => {
  try {
    const [[{ count: players }], [{ count: agents }], [{ count: clubs }]] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(playersTable),
      db.select({ count: sql<number>`count(*)::int` }).from(agentsTable),
      db.select({ count: sql<number>`count(*)::int` }).from(clubsTable),
    ]);
    res.json({ players, agents, clubs });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

export default router;
