import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "projects" ADD COLUMN "hero_bg_color" varchar DEFAULT '#FAFAF8';
  ALTER TABLE "projects" ADD COLUMN "accent_color" varchar DEFAULT '#059669';
  ALTER TABLE "projects" ADD COLUMN "live_url" varchar;
  ALTER TABLE "projects" ADD COLUMN "client_info_industry" varchar;
  ALTER TABLE "projects" ADD COLUMN "client_info_volume" varchar;
  ALTER TABLE "projects" ADD COLUMN "client_info_service" varchar;
  ALTER TABLE "projects" ADD COLUMN "featured_image_id" integer;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_featured_image_idx" ON "projects" USING btree ("featured_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP CONSTRAINT "projects_featured_image_id_media_id_fk";
  
  DROP INDEX "projects_featured_image_idx";
  ALTER TABLE "projects" DROP COLUMN "excerpt";
  ALTER TABLE "projects" DROP COLUMN "hero_bg_color";
  ALTER TABLE "projects" DROP COLUMN "accent_color";
  ALTER TABLE "projects" DROP COLUMN "live_url";
  ALTER TABLE "projects" DROP COLUMN "client_info_industry";
  ALTER TABLE "projects" DROP COLUMN "client_info_volume";
  ALTER TABLE "projects" DROP COLUMN "client_info_service";
  ALTER TABLE "projects" DROP COLUMN "featured_image_id";`)
}
