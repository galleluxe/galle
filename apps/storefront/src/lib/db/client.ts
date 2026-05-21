import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let _db: Db | null = null;

export function getDb(): Db | null {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) return null;

  const client = postgres(url, { max: 1 });
  _db = drizzle(client, { schema });
  return _db;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
