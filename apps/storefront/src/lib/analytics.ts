/**
 * Typed analytics event taxonomy for Galle storefront.
 * Events are logged server-side via lib/logger and client-side via dataLayer.
 */

export type AnalyticsEvent =
  | { name: "page_view"; properties: { path: string; title?: string } }
  | { name: "product_viewed"; properties: { productId: string; handle: string; pricePaise: number } }
  | { name: "add_to_cart"; properties: { variantId: string; quantity: number; productHandle: string } }
  | { name: "remove_from_cart"; properties: { variantId: string; quantity: number } }
  | { name: "begin_checkout"; properties: { cartId: string; itemCount: number; subtotalPaise: number } }
  | { name: "purchase"; properties: { orderId: string; totalPaise: number; itemCount: number } }
  | { name: "search"; properties: { query: string; resultCount: number } }
  | { name: "newsletter_subscribe"; properties: { email: string } }
  | { name: "contact_submit"; properties: { email: string } }
  | { name: "quiz_complete"; properties: { mood: string; family: string } }
  | { name: "sign_in"; properties: { method: "email" } }
  | { name: "sign_up"; properties: { method: "email" } };

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window !== "undefined") {
    const w = window as Window & { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ event: event.name, ...event.properties });
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event.name, event.properties);
  }
}

export async function trackServerEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const { logger } = await import("@/lib/logger");
    logger.info({ analytics: event.name, ...event.properties }, "analytics_event");
  } catch {
    // Logger not available during build
  }
}
