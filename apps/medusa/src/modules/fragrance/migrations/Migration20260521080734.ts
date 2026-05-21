import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260521080734 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "fragrance_profile" drop constraint if exists "fragrance_profile_product_id_unique";`);
    this.addSql(`create table if not exists "fragrance_profile" ("id" text not null, "product_id" text not null, "family" text check ("family" in ('Woody', 'Floral', 'Fresh', 'Amber', 'Oriental', 'Citrus')) not null, "top_notes" jsonb not null, "heart_notes" jsonb not null, "base_notes" jsonb not null, "longevity_hours" integer null, "sillage" text check ("sillage" in ('Intimate', 'Moderate', 'Strong')) null, "occasion" jsonb null, "editorial_pullquote" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fragrance_profile_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_fragrance_profile_product_id_unique" ON "fragrance_profile" ("product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fragrance_profile_deleted_at" ON "fragrance_profile" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "fragrance_profile" cascade;`);
  }

}
