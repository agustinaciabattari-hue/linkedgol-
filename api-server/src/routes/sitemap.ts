import { Router, type IRouter } from "express";
import { db, playersTable } from "@workspace/db";

const router: IRouter = Router();

const SITE_URL = "https://www.linkedgol.com";

// Static, mostly-stable pages. Priority/changefreq are hints, not guarantees.
const staticRoutes: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/jugador", priority: "0.8", changefreq: "weekly" },
  { path: "/agente", priority: "0.8", changefreq: "weekly" },
  { path: "/club", priority: "0.8", changefreq: "weekly" },
  { path: "/perfiles", priority: "0.9", changefreq: "daily" },
  { path: "/oportunidades", priority: "0.9", changefreq: "daily" },
  { path: "/registro/jugador", priority: "0.7", changefreq: "monthly" },
  { path: "/registro/agente", priority: "0.7", changefreq: "monthly" },
  { path: "/registro/club", priority: "0.7", changefreq: "monthly" },
  { path: "/contacto", priority: "0.4", changefreq: "yearly" },
  { path: "/terminos", priority: "0.3", changefreq: "yearly" },
  { path: "/privacidad", priority: "0.3", changefreq: "yearly" },
];

function escapeXml(url: string) {
  return url.replace(/&/g, "&amp;");
}

// GET /sitemap.xml — combines the static routes above with a live entry for
// every public player profile, so new profiles get discovered without
// needing to regenerate anything manually.
router.get("/sitemap.xml", async (_req, res) => {
  try {
    const players = await db.select({ id: playersTable.id, createdAt: playersTable.createdAt }).from(playersTable);

    const staticEntries = staticRoutes.map(
      (r) =>
        `  <url>\n    <loc>${escapeXml(SITE_URL + r.path)}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
    );

    const playerEntries = players.map((p) => {
      const lastmod = p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : undefined;
      return `  <url>\n    <loc>${escapeXml(`${SITE_URL}/perfil/${p.id}`)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticEntries, ...playerEntries].join("\n")}\n</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

export default router;
