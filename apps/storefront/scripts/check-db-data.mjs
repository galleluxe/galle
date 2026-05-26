/**
 * Inspect Neon tables + row counts for form data.
 * Run: node scripts/check-db-data.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
for (const file of [".env.local", ".env"]) {
  const envPath = path.join(__dirname, "..", file);
  if (!fs.existsSync(envPath)) continue;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: "require", max: 1 });

function redactUrl(url) {
  try {
    const u = new URL(url.replace(/^postgresql:\/\//, "postgres://"));
    return `${u.hostname}/${u.pathname.replace(/^\//, "")}`;
  } catch {
    return "(invalid url)";
  }
}

console.log(`\nDatabase: ${redactUrl(connectionString)}`);
console.log(
  "\nForm → table mapping:\n" +
    "  Footer newsletter     → newsletter_subscribers\n" +
    "  VIP popup (Maison Club) → signups (also in Payload admin)\n" +
    "  Contact page          → contact_messages\n" +
    "  Scent quiz            → galle_quiz_responses\n" +
    "  Concierge             → galle_concierge_enquiries\n",
);

const tables = [
  "newsletter_subscribers",
  "contact_messages",
  "galle_quiz_responses",
  "galle_concierge_enquiries",
  "signups",
  "products",
  "orders",
];

for (const table of tables) {
  try {
    const [{ count }] = await sql.unsafe(
      `SELECT COUNT(*)::int AS count FROM "${table}"`,
    );
    const sample = await sql.unsafe(
      `SELECT * FROM "${table}" ORDER BY 1 DESC LIMIT 3`,
    );
    console.log(`${table}: ${count} row(s)`);
    if (sample.length > 0) {
      console.log("  latest:", JSON.stringify(sample[0], null, 0).slice(0, 200));
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("does not exist")) {
      console.log(`${table}: MISSING TABLE`);
    } else {
      console.log(`${table}: ERROR — ${msg}`);
    }
  }
}

await sql.end();
