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
  ["PAYLOAD_SECRET", "Payload CMS auth"],
  ["DATABASE_URL", "Neon Postgres (Payload + Drizzle)"],
  ["NEXT_PUBLIC_IMAGEKIT_ENDPOINT", "ImageKit CDN"],
  ["RESEND_API_KEY", "Resend email"],
  ["RESEND_FROM_EMAIL", "Resend sender (verify domain in Resend dashboard)"],
  ["NEXT_PUBLIC_RAZORPAY_KEY_ID", "Razorpay checkout (public)"],
  ["RAZORPAY_KEY_ID", "Razorpay server"],
  ["RAZORPAY_KEY_SECRET", "Razorpay server secret"],
  ["REVALIDATE_SECRET", "ISR cache bust"],
  ["SHIPROCKET_EMAIL", "Shiprocket API user email"],
  ["SHIPROCKET_PASSWORD", "Shiprocket API password"],
];

const env = loadEnv(envPath);

console.log("\nGALLE storefront env check");
console.log(
  `File: ${existsSync(envPath) ? envPath : "(missing — copy .env.example → .env.local)"}\n`,
);

for (const [key, label] of checks) {
  const val = env[key];
  const ok = val && val.length > 0 && !val.includes("...");
  console.log(`${ok ? "✓" : "○"} ${label.padEnd(32)} ${key}`);
}

console.log("\nAdmin: http://localhost:3000/admin\n");
