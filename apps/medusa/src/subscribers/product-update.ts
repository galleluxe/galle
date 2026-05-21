import { SubscriberConfig, SubscriberArgs } from "@medusajs/framework";

export default async function productUpdateHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  const storefrontUrl = process.env.STOREFRONT_URL || "http://localhost:3000";
  const secret = process.env.REVALIDATE_SECRET;

  console.log(`[Medusa Subscriber] Received product update event: ${event.name}`);

  try {
    const handle = event.data?.handle;
    const tags = ["shop", "home", "medusa-catalog"];
    if (handle) {
      tags.push(`product:${handle}`);
    }

    const response = await fetch(`${storefrontUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: secret ? `Bearer ${secret}` : "",
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      console.error(
        `[Medusa Subscriber] Failed to revalidate storefront. Status: ${response.status}`
      );
    } else {
      console.log(`[Medusa Subscriber] Storefront revalidated successfully for tags:`, tags);
    }
  } catch (error) {
    console.error(`[Medusa Subscriber] Error sending revalidation request to storefront:`, error);
  }
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated", "product.deleted"],
  context: {
    subscriberId: "product-update-handler",
  },
};
