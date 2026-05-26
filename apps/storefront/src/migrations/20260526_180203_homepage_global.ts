import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/** Adds Payload Homepage global tables only (safe on existing Neon schemas). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "homepage" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "homepage_hero_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "desktop_image_url" varchar NOT NULL,
      "mobile_image_url" varchar NOT NULL,
      "alt" varchar,
      "eyebrow" varchar,
      "headline" varchar,
      "cta_label" varchar,
      "link_url" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "homepage_hero_slides" ADD CONSTRAINT "homepage_hero_slides_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "homepage_hero_slides_order_idx"
      ON "homepage_hero_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "homepage_hero_slides_parent_id_idx"
      ON "homepage_hero_slides" USING btree ("_parent_id");

    INSERT INTO "homepage" ("id", "created_at", "updated_at")
    SELECT 1, now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "homepage" LIMIT 1);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "homepage_hero_slides" CASCADE;
    DROP TABLE IF EXISTS "homepage" CASCADE;
  `);
}
