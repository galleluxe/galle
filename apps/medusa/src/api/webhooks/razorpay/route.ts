import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import crypto from "node:crypto";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const webhookSecret =
    process.env.RAZORPAY_WEBHOOK_SECRET ?? process.env.RAZORPAY_KEY_SECRET;

  const signature = req.headers["x-razorpay-signature"] as string | undefined;
  const rawBody = JSON.stringify(req.body);

  if (webhookSecret && signature) {
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expected !== signature) {
      return res.status(401).json({ error: "Invalid signature" });
    }
  }

  const event = req.body as { event?: string; payload?: unknown };
  console.log(`[Razorpay Webhook] Received event: ${event.event}`);

  // Medusa payment module processes webhooks via provider — log for observability
  return res.status(200).json({ received: true });
}
