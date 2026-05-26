/**
 * Creates Drizzle form tables in Neon (newsletter, contact, quiz, concierge).
 * Run: node scripts/ensure-drizzle-schema.mjs
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

const schemaSql = fs.readFileSync(
  path.join(__dirname, "neon-storefront-schema.sql"),
  "utf8",
);

for (const statement of schemaSql.split(";")) {
  const trimmed = statement.trim();
  if (!trimmed || trimmed.startsWith("--")) continue;
  await sql.unsafe(trimmed);
}

console.log("Drizzle form tables ready (newsletter, contact, quiz, concierge).");
await sql.end();
