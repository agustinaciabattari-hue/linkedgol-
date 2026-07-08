// Thin wrapper around gtag so tracking calls read as intent ("trackSignUp")
// instead of raw dataLayer pushes scattered across the codebase, and so the
// rest of the app doesn't break if analytics isn't loaded (e.g. local dev).

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function trackSignUp(role: "player" | "agent" | "club") {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "sign_up", { method: role });
}

export function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params || {});
}
