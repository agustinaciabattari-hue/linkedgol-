import crypto from "crypto";

// Shared JWT secret used to sign both user sessions (auth.ts) and admin
// sessions (admin.ts). No insecure fallback: required in production, and
// randomly generated per dev-process otherwise (with a warning).
export const JWT_SECRET: string = (() => {
  const fromEnv = process.env.JWT_SECRET;
  if (fromEnv && fromEnv.trim().length >= 16) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET environment variable is required in production and must be at least 16 characters long.",
    );
  }
  console.warn(
    "[auth] JWT_SECRET is not set (or too short) — using a random secret for this dev session. " +
    "Set JWT_SECRET in your environment for a stable secret and before deploying.",
  );
  return crypto.randomBytes(32).toString("hex");
})();
