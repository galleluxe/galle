/**
 * Ensures Payload Homepage global tables exist (Neon / production).
 * Run: node scripts/ensure-homepage-global.mjs
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

// Remove dev-mode markers (batch = -1) to prevent interactive prompts blocking CI/Vercel builds
try {
  const deleted = await sql`DELETE FROM payload_migrations WHERE batch = -1`;
  if (deleted.count > 0) {
    console.log(`Cleared ${deleted.count} dev-mode migration marker(s) to prevent interactive prompts.`);
  }
} catch (error) {
  // If payload_migrations doesn't exist yet, ignore
}

await sql`
  CREATE TABLE IF NOT EXISTS homepage (
    id serial PRIMARY KEY NOT NULL,
    launch_section_title varchar DEFAULT 'New Launch',
    gifting_section_title varchar DEFAULT 'Gifting',
    gifting_section_subtitle varchar,
    updated_at timestamptz,
    created_at timestamptz
  )
`;

await sql`
  ALTER TABLE homepage ADD COLUMN IF NOT EXISTS launch_section_title varchar DEFAULT 'New Launch'
`;
await sql`
  ALTER TABLE homepage ADD COLUMN IF NOT EXISTS gifting_section_title varchar DEFAULT 'Gifting'
`;
await sql`
  ALTER TABLE homepage ADD COLUMN IF NOT EXISTS gifting_section_subtitle varchar
`;

await sql`
  CREATE TABLE IF NOT EXISTS homepage_rels (
    id serial PRIMARY KEY NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path varchar NOT NULL,
    products_id integer
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS homepage_hero_slides (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id varchar PRIMARY KEY NOT NULL,
    desktop_image_url varchar NOT NULL,
    mobile_image_url varchar NOT NULL,
    alt varchar,
    eyebrow varchar,
    headline varchar,
    cta_label varchar,
    link_url varchar
  )
`;

try {
  await sql`
    ALTER TABLE homepage_hero_slides
    ADD CONSTRAINT homepage_hero_slides_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES homepage(id) ON DELETE CASCADE
  `;
} catch {
  // constraint already exists
}

await sql`
  CREATE INDEX IF NOT EXISTS homepage_hero_slides_order_idx
  ON homepage_hero_slides (_order)
`;
await sql`
  CREATE INDEX IF NOT EXISTS homepage_hero_slides_parent_id_idx
  ON homepage_hero_slides (_parent_id)
`;

const existing = await sql`SELECT id FROM homepage LIMIT 1`;
if (existing.length === 0) {
  await sql`INSERT INTO homepage (id, created_at, updated_at) VALUES (1, now(), now())`;
  console.log("Created homepage global row (id=1).");
} else {
  console.log("Homepage global row already exists.");
}

console.log("Homepage global tables ready.");
await sql.end();
