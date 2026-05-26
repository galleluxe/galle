import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/** Homepage launch/gifting relationships + section titles. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "launch_section_title" varchar DEFAULT 'New Launch';
    ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gifting_section_title" varchar DEFAULT 'Gifting';
    ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "gifting_section_subtitle" varchar;

    CREATE TABLE IF NOT EXISTS "homepage_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "products_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_products_fk"
        FOREIGN KEY ("products_id") REFERENCES "public"."products"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "homepage_rels_products_id_idx" ON "homepage_rels" USING btree ("products_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "homepage_rels" CASCADE;
    ALTER TABLE "homepage" DROP COLUMN IF EXISTS "launch_section_title";
    ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gifting_section_title";
    ALTER TABLE "homepage" DROP COLUMN IF EXISTS "gifting_section_subtitle";
  `);
}
