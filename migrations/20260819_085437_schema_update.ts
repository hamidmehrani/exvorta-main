import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_ecosystem_products_status_color" AS ENUM('emerald', 'black', 'white');
  CREATE TABLE "waitlist" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"source" varchar,
  	"payload" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ecosystem_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"module_tag" varchar,
  	"status" varchar,
  	"status_color" "enum_ecosystem_products_status_color",
  	"title" varchar,
  	"description" varchar,
  	"subtext" varchar,
  	"cta_text" varchar,
  	"cta_link" varchar
  );
  
  CREATE TABLE "ecosystem_roadmap_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phase" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "ecosystem" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT '[ THE GLOBAL TRADE OPERATING SYSTEM ]',
  	"hero_title" varchar DEFAULT 'A Unifying Core.',
  	"hero_subtitle" varchar DEFAULT 'One OS for Global Trading Infrastructure.',
  	"hero_description" varchar DEFAULT 'We do not build isolated products. We engineer an integrated digital command center. From bespoke Web architectures to automated documentation and trade tracking, Exvorta merges Web, Docs, Track, CRM, and Intel into a single, cohesive operating system for global traders.',
  	"hero_badge" varchar DEFAULT '[ WEB · DOCS · TRACK · CRM · INTEL · SUITE ]',
  	"problem_eyebrow" varchar DEFAULT '[ THE FRAGMENTATION PROBLEM ]',
  	"problem_title" varchar DEFAULT 'The modern trading entity is paralyzed by shattered software.',
  	"problem_description" varchar DEFAULT 'You use one vendor for a public website, another for client portals, and legacy systems for tracking. This fragmentation creates data silos, wasted hours, and decisions made on incomplete information. To scale globally, you do not need more apps. You need a singular, unified nervous system.',
  	"vision_badge" varchar DEFAULT 'THE ULTIMATE VISION',
  	"vision_title" varchar DEFAULT 'Total Synthesis.',
  	"vision_subtitle" varchar DEFAULT 'The Exvorta Suite.',
  	"vision_description" varchar DEFAULT 'When Web, Docs, Track, CRM, and Intel converge, they cease to be individual tools. They become a singular, unbreachable digital nervous system. This is the Exvorta Suite: the absolute apex of global trade infrastructure.',
  	"roadmap_eyebrow" varchar DEFAULT '[ DEPLOYMENT SCHEDULE ]',
  	"roadmap_title" varchar DEFAULT 'The Infrastructure Roadmap.',
  	"cta_eyebrow" varchar DEFAULT '[ INITIATE PARTNERSHIP ]',
  	"cta_title" varchar DEFAULT 'Secure your digital foundation.',
  	"cta_subtitle" varchar DEFAULT 'Unlock the ecosystem.',
  	"cta_description" varchar DEFAULT 'Alpha access to Exvorta Docs and Track is strictly prioritized for our active web architecture clients. Upgrade your public infrastructure today to guarantee your position in the future of global trade.',
  	"cta_primary_cta_text" varchar DEFAULT '[ UPGRADE WEB ARCHITECTURE ]',
  	"cta_primary_cta_link" varchar DEFAULT '/proposal',
  	"cta_secondary_cta_text" varchar DEFAULT '[ JOIN SOFTWARE WAITLIST ]',
  	"cta_secondary_cta_link" varchar DEFAULT '/waitlist',
  	"cta_disclaimer" varchar DEFAULT '* Web proposals are subject to capacity constraints.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "waitlist_id" integer;
  ALTER TABLE "ecosystem_products" ADD CONSTRAINT "ecosystem_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ecosystem"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ecosystem_roadmap_timeline" ADD CONSTRAINT "ecosystem_roadmap_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ecosystem"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "waitlist_updated_at_idx" ON "waitlist" USING btree ("updated_at");
  CREATE INDEX "waitlist_created_at_idx" ON "waitlist" USING btree ("created_at");
  CREATE INDEX "ecosystem_products_order_idx" ON "ecosystem_products" USING btree ("_order");
  CREATE INDEX "ecosystem_products_parent_id_idx" ON "ecosystem_products" USING btree ("_parent_id");
  CREATE INDEX "ecosystem_roadmap_timeline_order_idx" ON "ecosystem_roadmap_timeline" USING btree ("_order");
  CREATE INDEX "ecosystem_roadmap_timeline_parent_id_idx" ON "ecosystem_roadmap_timeline" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_waitlist_fk" FOREIGN KEY ("waitlist_id") REFERENCES "public"."waitlist"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_waitlist_id_idx" ON "payload_locked_documents_rels" USING btree ("waitlist_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "waitlist" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ecosystem_products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ecosystem_roadmap_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ecosystem" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "waitlist" CASCADE;
  DROP TABLE "ecosystem_products" CASCADE;
  DROP TABLE "ecosystem_roadmap_timeline" CASCADE;
  DROP TABLE "ecosystem" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_waitlist_fk";
  
  DROP INDEX "payload_locked_documents_rels_waitlist_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "waitlist_id";
  DROP TYPE "public"."enum_ecosystem_products_status_color";`)
}
