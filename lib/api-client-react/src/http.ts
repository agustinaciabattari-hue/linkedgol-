// Thin fetch wrapper shared by every hook in this package. Every call is
// relative to `/api`, matching how the Express server mounts its router
// (see artifacts/api-server/src/app.ts: `app.use("/api", router)`) — the
// frontend and API are expected to be served from the same origin.

export type RequestConfig = { headers?: Record<string, string> };

export class ApiError extends Error {
  status: number;
  response: { status: number; data: any };
  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = { status, data };
  }
}

export function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    usp.set(key, String(value));
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
  config?: RequestConfig,
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(config?.headers || {}),
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    let data: any = undefined;
    try {
      data = await res.json();
    } catch {
      // no JSON body — leave data undefined
    }
    const message = data?.error || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
