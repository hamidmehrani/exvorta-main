import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "rate_limits" (
  	"identifier" varchar PRIMARY KEY NOT NULL,
  	"attempt_count" integer DEFAULT 1 NOT NULL,
  	"window_start" timestamp DEFAULT now() NOT NULL
  );

  CREATE INDEX IF NOT EXISTS "rate_limits_window_start_idx" ON "rate_limits" USING btree ("window_start");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "rate_limits";`)
}
