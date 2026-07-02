import rateLimit from "express-rate-limit";

// Limits brute-force attempts on login/register/password endpoints.
// Keyed by IP by default (express-rate-limit's standard behavior).
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Probá de nuevo en unos minutos." },
});

// Tighter limit specifically for password-reset requests, since these
// trigger an outbound email and are a common abuse target.
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Probá de nuevo en unos minutos." },
});
