type Payload = Record<string, string | number | boolean>;

/**
 * Lightweight event bridge. Pushes to a dataLayer / gtag when a Google
 * Analytics tag is added later; safely no-ops until then.
 */
export function trackEvent(name: string, payload: Payload = {}) {
  if (typeof window === "undefined") return;

  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  if (typeof w.gtag === "function") {
    w.gtag("event", name, payload);
    return;
  }

  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: name, ...payload });
}
