import pino from "pino";

const isDev = process.env.NODE_ENV === "development";
const axiomToken = process.env.AXIOM_TOKEN;
const axiomDataset = process.env.AXIOM_DATASET ?? "galle-storefront";

const transport =
  axiomToken && !isDev
    ? pino.transport({
        target: "@axiomhq/pino",
        options: {
          dataset: axiomDataset,
          token: axiomToken,
        },
      })
    : undefined;

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
    base: { service: "galle-storefront" },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

export default logger;
