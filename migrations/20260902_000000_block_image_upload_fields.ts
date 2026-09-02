import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Adds upload-relation columns for the in-place image uploads feature:
 *  - pages_blocks_founder.image_id        (replaces legacy image_src text)
 *  - proj_archive.image_id                (replaces legacy image_url text)
 * Legacy text columns are kept (data preserved, frontend reads both shapes).
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_founder" ADD COLUMN IF NOT EXISTS "image_id" integer;
   ALTER TABLE "proj_archive" ADD COLUMN IF NOT EXISTS "image_id" integer;

   ALTER TABLE "pages_blocks_founder" DROP CONSTRAINT IF EXISTS "pages_blocks_founder_image_id_media_id_fk";
   ALTER TABLE "pages_blocks_founder" ADD CONSTRAINT "pages_blocks_founder_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

   ALTER TABLE "proj_archive" DROP CONSTRAINT IF EXISTS "proj_archive_image_id_media_id_fk";
   ALTER TABLE "proj_archive" ADD CONSTRAINT "proj_archive_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "proj_archive" DROP CONSTRAINT IF EXISTS "proj_archive_image_id_media_id_fk";
   ALTER TABLE "pages_blocks_founder" DROP CONSTRAINT IF EXISTS "pages_blocks_founder_image_id_media_id_fk";
   ALTER TABLE "proj_archive" DROP COLUMN IF EXISTS "image_id";
   ALTER TABLE "pages_blocks_founder" DROP COLUMN IF EXISTS "image_id";
  `)
}
