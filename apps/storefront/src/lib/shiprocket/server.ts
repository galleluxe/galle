/**
 * Shiprocket API integration (server-only).
 *
 * Shiprocket has NO sandbox/test environment.
 * All calls hit the live account. To test without cost:
 *   1. Create an order via the API.
 *   2. Cancel it from the Shiprocket dashboard to get a full refund.
 *
 * Required env vars:
 *   SHIPROCKET_EMAIL            – API user email (must be different from your Shiprocket login)
 *   SHIPROCKET_PASSWORD         – API user password
 *   SHIPROCKET_PICKUP_LOCATION  – Pickup location name in Shiprocket (default: "Primary")
 *
 * How to create an API user:
 *   Shiprocket dashboard → Settings → API → Configure → Create an API user
 *   Use a different email than your registered Shiprocket email.
 */
import "server-only";

const BASE = "https://apiv2.shiprocket.in/v1/external";

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number; // rupees (not paise)
  discount?: number;
  tax?: string;
  hsn?: number;
}

export interface ShiprocketOrderInput {
  orderNumber: string; // your internal GALLE-XXXXXX
  orderDate: string;   // YYYY-MM-DD HH:MM
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
  items: ShiprocketOrderItem[];
  subtotalRupees: number; // sum of selling_price * units
  /** grams */
  weightGrams?: number;
  /** cm */
  lengthCm?: number;
  breadthCm?: number;
  heightCm?: number;
}

export type ShiprocketResult =
  | { ok: true; orderId: number; shipmentId?: number }
  | { ok: false; error: string; skipped?: boolean };

/** Returns true only when both SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD are set. */
export function isShiprocketConfigured(): boolean {
  return Boolean(
    process.env.SHIPROCKET_EMAIL?.trim() &&
      process.env.SHIPROCKET_PASSWORD?.trim(),
  );
}

/** Get a fresh JWT from Shiprocket. Token is valid for 10 days. */
async function getShiprocketToken(): Promise<string> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL!.trim(),
      password: process.env.SHIPROCKET_PASSWORD!.trim(),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shiprocket auth failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { token?: string; message?: string };
  if (!data.token) {
    throw new Error(
      `Shiprocket auth returned no token: ${data.message ?? "unknown"}`,
    );
  }
  return data.token;
}

/**
 * Create a Shiprocket order (adhoc / custom order).
 * Returns the Shiprocket order ID and shipment ID on success.
 *
 * Call this after your Payload order is saved and Razorpay payment confirmed.
 * Errors are caught — a Shiprocket failure does NOT block the customer.
 */
export async function createShiprocketOrder(
  input: ShiprocketOrderInput,
): Promise<ShiprocketResult> {
  if (!isShiprocketConfigured()) {
    console.warn(
      `[shiprocket] Skipped order ${input.orderNumber} — SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD not set`,
    );
    return { ok: false, error: "Shiprocket credentials not configured", skipped: true };
  }

  try {
    const token = await getShiprocketToken();

    const pickupLocation =
      process.env.SHIPROCKET_PICKUP_LOCATION?.trim() || "Primary";

    const body = {
      order_id: input.orderNumber,
      order_date: input.orderDate,
      pickup_location: pickupLocation,
      comment: "GALLE fragrance order",

      // Billing = Shipping (we collect one address)
      billing_customer_name: input.firstName,
      billing_last_name: input.lastName,
      billing_address: input.address,
      billing_city: input.city,
      billing_pincode: input.postalCode,
      billing_state: input.state,
      billing_country: "India",
      billing_email: input.email,
      billing_phone: input.phone,

      shipping_is_billing: true,

      order_items: input.items,
      payment_method: "Prepaid",
      sub_total: input.subtotalRupees,

      // Package dimensions (defaults for a perfume bottle)
      length: input.lengthCm ?? 12,
      breadth: input.breadthCm ?? 8,
      height: input.heightCm ?? 8,
      weight: input.weightGrams != null ? input.weightGrams / 1000 : 0.5, // Shiprocket wants kg
    };

    const res = await fetch(`${BASE}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as {
      order_id?: number;
      shipment_id?: number;
      status?: string;
      message?: string;
    };

    if (!res.ok || !data.order_id) {
      const msg = data.message ?? `HTTP ${res.status}`;
      console.error(`[shiprocket] Order creation failed for ${input.orderNumber}:`, msg, data);
      return { ok: false, error: msg };
    }

    console.info(
      `[shiprocket] Order created: ${input.orderNumber} → Shiprocket #${data.order_id}`,
    );
    return { ok: true, orderId: data.order_id, shipmentId: data.shipment_id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[shiprocket] Unexpected error for ${input.orderNumber}:`, message);
    return { ok: false, error: message };
  }
}

/** Convert paise to rupees (integer, no fractions). */
export function paiseToRupees(paise: number): number {
  return Math.round(paise / 100);
}
