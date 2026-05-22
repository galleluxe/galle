/**
 * Ensures products_rels exists for bundledProducts relationships.
 * Run: node scripts/ensure-bundle-schema.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
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

await sql`
  CREATE TABLE IF NOT EXISTS products_rels (
    id serial PRIMARY KEY NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path varchar NOT NULL,
    products_id integer
  )
`;

await sql`
  DO $$ BEGIN
    ALTER TABLE products_rels ADD CONSTRAINT products_rels_parent_fk
      FOREIGN KEY (parent_id) REFERENCES public.products(id)
      ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$
`;

await sql`
  DO $$ BEGIN
    ALTER TABLE products_rels ADD CONSTRAINT products_rels_products_fk
      FOREIGN KEY (products_id) REFERENCES public.products(id)
      ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$
`;

await sql`CREATE INDEX IF NOT EXISTS products_rels_order_idx ON products_rels USING btree ("order")`;
await sql`CREATE INDEX IF NOT EXISTS products_rels_parent_idx ON products_rels USING btree (parent_id)`;
await sql`CREATE INDEX IF NOT EXISTS products_rels_path_idx ON products_rels USING btree (path)`;
await sql`CREATE INDEX IF NOT EXISTS products_rels_products_id_idx ON products_rels USING btree (products_id)`;

console.log("products_rels table ready.");
await sql.end();
