import { z } from "zod";

// Kept intentionally minimal: this package only needs to cover what the
// API server actually validates at runtime (health.ts). The rest of the
// request/response validation in this project happens via @workspace/db's
// drizzle-zod schemas instead.
export const HealthCheckResponse = z.object({
  status: z.string(),
});
