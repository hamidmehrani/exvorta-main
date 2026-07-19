import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "global_promos" CASCADE;
  DROP TABLE "global_promos_locales" CASCADE;
  DROP TYPE "public"."enum_global_promos_position";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_global_promos_position" AS ENUM('top-banner', 'floating-bottom');
  CREATE TABLE "global_promos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"is_active" boolean DEFAULT false,
  	"link" varchar,
  	"position" "enum_global_promos_position" DEFAULT 'top-banner',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "global_promos_locales" (
  	"message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "global_promos_locales" ADD CONSTRAINT "global_promos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global_promos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "global_promos_locales_locale_parent_id_unique" ON "global_promos_locales" USING btree ("_locale","_parent_id");`)
}
