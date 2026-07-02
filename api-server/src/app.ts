import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import router from "./routes";

const app: Express = express();

// In development (no CORS_ORIGIN set), allow any origin so the Vite dev
// server works without extra config. In production, only allow the
// configured frontend domain(s) — comma-separated if you need more than one
// (e.g. a staging URL alongside the production one).
const corsOrigins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean);

app.use(
  cors({
    origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// In production, serve the built frontend (artifacts/linkedgol/dist/public)
// from this same server, so the frontend's relative `/api/...` fetch calls
// work without any extra proxy config — single origin, single deployment.
// This only kicks in if the frontend was actually built (the folder exists);
// otherwise we leave it to a separately-hosted frontend (e.g. Vercel).
if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const frontendDist = path.resolve(__dirname, "../../linkedgol/dist/public");

  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    // SPA fallback: any non-/api route serves index.html so client-side
    // routing (wouter) handles it.
    app.get(/^\/(?!api).*/, (_req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  }
}

export default app;
