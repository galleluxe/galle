/**
 * Quick env checklist for local launch (no secrets printed).
 * Run: pnpm --filter @galle/storefront check:env
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env.local");

function loadEnv(path) {
  if (!existsSync(path)) return {};
  const text = readFileSync(path, "utf8");
  const out = {};
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const checks = [
  ["NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY", "Medusa storefront API"],
  ["NEXT_PUBLIC_MEDUSA_URL", "Medusa URL (local or tunnel)"],
  ["NEXT_PUBLIC_IMAGEKIT_ENDPOINT", "ImageKit CDN"],
  ["IMAGEKIT_PRIVATE_KEY", "ImageKit private"],
  ["RESEND_API_KEY", "Resend email"],
  ["NEXT_PUBLIC_RAZORPAY_KEY_ID", "Razorpay checkout"],
  ["DATABASE_URL", "Drizzle (newsletter/quiz)"],
  ["REVALIDATE_SECRET", "ISR cache bust"],
];

const env = loadEnv(envPath);

console.log("\nGALLE storefront env check");
console.log(`File: ${existsSync(envPath) ? envPath : "(missing — copy .env.example → .env.local)"}\n`);

for (const [key, label] of checks) {
  const val = env[key];
  const ok = val && val.length > 0 && !val.includes("...");
  console.log(`${ok ? "✓" : "○"} ${label.padEnd(28)} ${key}`);
}

console.log("\nMedusa keys live in apps/medusa/.env — start Medusa with: pnpm --filter @galle/medusa dev\n");
