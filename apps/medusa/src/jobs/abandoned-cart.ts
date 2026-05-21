import type { MedusaContainer } from "@medusajs/framework/types";

/**
 * Scheduled job: identify carts abandoned > 24h and log for email recovery.
 * Wire to Resend abandoned-cart template in production.
 */
export default async function abandonedCartJob(container: MedusaContainer) {
  const logger = container.resolve("logger") as {
    info: (msg: string) => void;
  };

  logger.info("[Job] abandoned-cart: scanning for stale carts (24h+)");
  // Cart module query would run here in production
  logger.info("[Job] abandoned-cart: complete");
}

export const config = {
  name: "abandoned-cart-reminder",
  schedule: "0 */6 * * *", // every 6 hours
};
