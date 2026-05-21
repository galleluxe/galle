import Medusa from "@medusajs/js-sdk";

const baseUrl =
  process.env.MEDUSA_BACKEND_URL ?? process.env.NEXT_PUBLIC_MEDUSA_URL;

export function createMedusaClient() {
  if (!baseUrl) return null;
  return new Medusa({
    baseUrl,
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  });
}

export function isMedusaConfigured(): boolean {
  return Boolean(baseUrl && process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY);
}
