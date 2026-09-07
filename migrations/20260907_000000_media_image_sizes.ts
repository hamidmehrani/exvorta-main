import { sql } from 'drizzle-orm'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Adds image-size columns (thumbnail/card/hero) to the media table.
// These were introduced in the Media collection config (imageSizes) after the
// initial migration, so the production DB is missing them and every
// depth-populated media query fails with 42703 (column does not exist).
// The admin list view populates relations with depth=1, so /admin/collections/pages
// (whose docs reference media via hero background images) 500s and renders empty.

const TEXT_COLS = [
  'sizes_thumbnail_url',
  'sizes_thumbnail_mime_type',
  'sizes_thumbnail_filename',
  'sizes_card_url',
  'sizes_card_mime_type',
  'sizes_card_filename',
  'sizes_hero_url',
  'sizes_hero_mime_type',
  'sizes_hero_filename',
]

const INT_COLS = [
  'sizes_thumbnail_width',
  'sizes_thumbnail_height',
  'sizes_thumbnail_filesize',
  'sizes_card_width',
  'sizes_card_height',
  'sizes_card_filesize',
  'sizes_hero_width',
  'sizes_hero_height',
  'sizes_hero_filesize',
]

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  for (const col of TEXT_COLS) {
    await payload.db.drizzle.execute(
      sql.raw(`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "${col}" text`),
    )
  }
  for (const col of INT_COLS) {
    await payload.db.drizzle.execute(
      sql.raw(`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "${col}" integer`),
    )
  }
}

export async function down(): Promise<void> {
  // Intentionally a no-op: dropping columns would destroy image-size data.
}
