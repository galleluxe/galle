import { SubscriberConfig, SubscriberArgs } from "@medusajs/framework";

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  const storefrontUrl = process.env.STOREFRONT_URL || "http://localhost:3000";
  const secret = process.env.REVALIDATE_SECRET;

  console.log(`[Medusa Subscriber] Received order placed event: ${event.name}`);

  try {
    const orderId = event.data?.id;
    console.log(`[Medusa Subscriber] New order placed! ID: ${orderId}`);

    // In a production setup, we would load the Resend service and send an email directly from Medusa.
    // Since the storefront checkout action already triggers Resend confirmation emails elegantly,
    // we also trigger an active revalidation of the user's order history page.
    const response = await fetch(`${storefrontUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: secret ? `Bearer ${secret}` : "",
      },
      body: JSON.stringify({
        paths: ["/account/orders", "/account/profile"],
      }),
    });

    if (!response.ok) {
      console.error(
        `[Medusa Subscriber] Failed to revalidate storefront orders path. Status: ${response.status}`
      );
    } else {
      console.log(`[Medusa Subscriber] Storefront paths revalidated successfully.`);
    }
  } catch (error) {
    console.error(`[Medusa Subscriber] Error handling order.placed event:`, error);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: {
    subscriberId: "order-placed-handler",
  },
};
