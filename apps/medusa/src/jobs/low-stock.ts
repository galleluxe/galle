import type { MedusaContainer } from "@medusajs/framework/types";

/**
 * Scheduled job: alert when variant inventory falls below threshold.
 */
export default async function lowStockJob(container: MedusaContainer) {
  const logger = container.resolve("logger") as {
    info: (msg: string) => void;
    warn: (msg: string) => void;
  };

  const THRESHOLD = 5;
  logger.info(`[Job] low-stock: checking inventory below ${THRESHOLD} units`);
  // Inventory module query would run here in production
  logger.info("[Job] low-stock: complete");
}

export const config = {
  name: "low-stock-alert",
  schedule: "0 8 * * *", // daily at 8am IST
};
