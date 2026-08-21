import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('superadmin', 'client');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_theme" AS ENUM('light', 'dark', 'dark-cards', 'dark-principles', 'light-columns');
  CREATE TYPE "public"."enum_pages_blocks_cta_theme" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_process_variant" AS ENUM('default', 'dark-split');
  CREATE TYPE "public"."enum_pages_allowed_roles_role" AS ENUM('admin', 'partner', 'customer');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_theme" AS ENUM('light', 'dark', 'dark-cards', 'dark-principles', 'light-columns');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_theme" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_process_variant" AS ENUM('default', 'dark-split');
  CREATE TYPE "public"."enum__pages_v_version_allowed_roles_role" AS ENUM('admin', 'partner', 'customer');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_leads_source" AS ENUM('Waitlist', 'RFQ');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('New', 'Under Review', 'Contacted', 'Archived');
  CREATE TYPE "public"."enum_redirects_status_code" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_form_submissions_business_type" AS ENUM('importer', 'exporter', 'trading_company');
  CREATE TYPE "public"."enum_form_submissions_budget" AS ENUM('$800–1.5k', '$1.5–3k', '$3k+');
  CREATE TYPE "public"."enum_form_submissions_status" AS ENUM('pending', 'reviewed', 'closed');
  CREATE TYPE "public"."enum_navigation_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_columns_links_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "hero_microcopy" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" varchar DEFAULT 'default',
  	"eyebrow" varchar,
  	"headline" varchar,
  	"subheadline" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_url" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_url" varchar,
  	"scroll_text" varchar,
  	"bottom_label" varchar,
  	"show_dashboard" boolean DEFAULT false,
  	"hide_dashboard" boolean DEFAULT false,
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "fg_feats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_eyebrow" varchar,
  	"eyebrow" varchar,
  	"section_title" varchar,
  	"theme" "enum_pages_blocks_feature_grid_theme" DEFAULT 'light',
  	"layout" varchar DEFAULT '3-col',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_cta_theme" DEFAULT 'light',
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"button_text" varchar,
  	"button_url" varchar,
  	"secondary_button_text" varchar,
  	"secondary_button_url" varchar,
  	"disclaimer" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "cta_banner_guar" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"label" varchar,
  	"headline" varchar,
  	"description" varchar,
  	"subtext" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_url" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "prc_tier_feats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "prc_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tier_name" varchar,
  	"tier_subtitle" varchar,
  	"price" varchar,
  	"highlight" boolean DEFAULT false,
  	"cta_label" varchar,
  	"cta_url" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"section_title_suffix" varchar,
  	"section_title" varchar,
  	"section_subtitle" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"section_title" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "man_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"company" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonial_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"section_title" varchar,
  	"quote" varchar,
  	"quote_author" varchar,
  	"guarantee_title" varchar,
  	"guarantee_text" varchar,
  	"guarantee_signature" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_marquee_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"cover_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_number" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"timeline" varchar,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"section_title" varchar,
  	"variant" "enum_pages_blocks_process_variant" DEFAULT 'default',
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"enable_whats_app" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_portfolio_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"section_title" varchar,
  	"description" varchar,
  	"cta_text" varchar,
  	"cta_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "fshow_feats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_text" varchar,
  	"cta_url" varchar,
  	"media_id" integer,
  	"media_position" varchar DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "roadmap_phases" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_roadmap" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"vision_label" varchar,
  	"vision_title" varchar,
  	"vision_description" varchar,
  	"button_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_waitlist_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"placeholder" varchar DEFAULT 'Enter official corporate email...',
  	"button_text" varchar DEFAULT '[ REQUEST EARLY ACCESS ]',
  	"source" varchar DEFAULT 'waitlist',
  	"block_name" varchar
  );
  
  CREATE TABLE "rfq_phases" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_number" varchar,
  	"step_name" varchar
  );
  
  CREATE TABLE "rfq_objectives" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option" varchar
  );
  
  CREATE TABLE "rfq_timelines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option" varchar
  );
  
  CREATE TABLE "rfq_budgets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option" varchar
  );
  
  CREATE TABLE "pages_blocks_rfq_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"form_config_company_name_placeholder" varchar,
  	"form_config_website_url_placeholder" varchar,
  	"form_config_work_email_placeholder" varchar,
  	"form_config_challenge_placeholder" varchar,
  	"form_config_submit_button_text" varchar,
  	"form_config_disclaimer_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"company" varchar,
  	"bio" varchar,
  	"quote" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_team_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_eyebrow" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "ps_feats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_product_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"module_number" varchar,
  	"eyebrow" varchar,
  	"status" varchar DEFAULT 'coming_soon',
  	"status_label" varchar,
  	"product_name" varchar,
  	"description" varchar,
  	"secondary_description" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"mockup_type" varchar DEFAULT 'web',
  	"theme" varchar DEFAULT 'dark',
  	"block_name" varchar
  );
  
  CREATE TABLE "proj_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"industry" varchar,
  	"volume" varchar,
  	"service" varchar,
  	"link_url" varchar,
  	"link_label" varchar,
  	"image_url" varchar
  );
  
  CREATE TABLE "pages_blocks_portfolio_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"headline" varchar,
  	"subtitle" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "thesis_paras" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_thesis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_global_presence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "prob_stmts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_problem_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" varchar DEFAULT 'dark',
  	"eyebrow" varchar,
  	"headline" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "btm_labels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_vision" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" varchar DEFAULT 'default',
  	"eyebrow" varchar,
  	"headline" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_founder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"quote" varchar,
  	"name" varchar,
  	"bio" varchar,
  	"role_title" varchar,
  	"role_company" varchar,
  	"image_src" varchar,
  	"image_alt" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_allowed_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "enum_pages_allowed_roles_role"
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"requires_auth" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "_hero_microcopy_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"theme" varchar DEFAULT 'default',
  	"eyebrow" varchar,
  	"headline" varchar,
  	"subheadline" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_url" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_url" varchar,
  	"scroll_text" varchar,
  	"bottom_label" varchar,
  	"show_dashboard" boolean DEFAULT false,
  	"hide_dashboard" boolean DEFAULT false,
  	"background_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_fg_feats_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_eyebrow" varchar,
  	"eyebrow" varchar,
  	"section_title" varchar,
  	"theme" "enum__pages_v_blocks_feature_grid_theme" DEFAULT 'light',
  	"layout" varchar DEFAULT '3-col',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"theme" "enum__pages_v_blocks_cta_theme" DEFAULT 'light',
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"button_text" varchar,
  	"button_url" varchar,
  	"secondary_button_text" varchar,
  	"secondary_button_url" varchar,
  	"disclaimer" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_cta_banner_guar_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"label" varchar,
  	"headline" varchar,
  	"description" varchar,
  	"subtext" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_url" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prc_tier_feats_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_prc_tiers_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tier_name" varchar,
  	"tier_subtitle" varchar,
  	"price" varchar,
  	"highlight" boolean DEFAULT false,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"section_title_suffix" varchar,
  	"section_title" varchar,
  	"section_subtitle" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_faq_questions_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"section_title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_man_testimonials_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"company" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"section_title" varchar,
  	"quote" varchar,
  	"quote_author" varchar,
  	"guarantee_title" varchar,
  	"guarantee_text" varchar,
  	"guarantee_signature" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marquee_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"cover_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_process_steps_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step_number" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"timeline" varchar,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"section_title" varchar,
  	"variant" "enum__pages_v_blocks_process_variant" DEFAULT 'default',
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"enable_whats_app" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_portfolio_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"section_title" varchar,
  	"description" varchar,
  	"cta_text" varchar,
  	"cta_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_fshow_feats_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_text" varchar,
  	"cta_url" varchar,
  	"media_id" integer,
  	"media_position" varchar DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_roadmap_phases_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_roadmap" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"vision_label" varchar,
  	"vision_title" varchar,
  	"vision_description" varchar,
  	"button_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_waitlist_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"placeholder" varchar DEFAULT 'Enter official corporate email...',
  	"button_text" varchar DEFAULT '[ REQUEST EARLY ACCESS ]',
  	"source" varchar DEFAULT 'waitlist',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_rfq_phases_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step_number" varchar,
  	"step_name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_rfq_objectives_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"option" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_rfq_timelines_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"option" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_rfq_budgets_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"option" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rfq_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"form_config_company_name_placeholder" varchar,
  	"form_config_website_url_placeholder" varchar,
  	"form_config_work_email_placeholder" varchar,
  	"form_config_challenge_placeholder" varchar,
  	"form_config_submit_button_text" varchar,
  	"form_config_disclaimer_text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_team_members_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"company" varchar,
  	"bio" varchar,
  	"quote" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_eyebrow" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_ps_feats_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"module_number" varchar,
  	"eyebrow" varchar,
  	"status" varchar DEFAULT 'coming_soon',
  	"status_label" varchar,
  	"product_name" varchar,
  	"description" varchar,
  	"secondary_description" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"mockup_type" varchar DEFAULT 'web',
  	"theme" varchar DEFAULT 'dark',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_proj_archive_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"industry" varchar,
  	"volume" varchar,
  	"service" varchar,
  	"link_url" varchar,
  	"link_label" varchar,
  	"image_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_portfolio_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar,
  	"headline" varchar,
  	"subtitle" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_thesis_paras_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_thesis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_locations_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_global_presence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_prob_stmts_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_problem_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"theme" varchar DEFAULT 'dark',
  	"eyebrow" varchar,
  	"headline" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_principles_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_btm_labels_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_vision" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" varchar DEFAULT 'default',
  	"eyebrow" varchar,
  	"headline" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_founder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"quote" varchar,
  	"name" varchar,
  	"bio" varchar,
  	"role_title" varchar,
  	"role_company" varchar,
  	"image_src" varchar,
  	"image_alt" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_allowed_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum__pages_v_version_allowed_roles_role",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_requires_auth" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"author_id" integer,
  	"category_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"cover_image_id" integer,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum_leads_source" NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'New',
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"payload" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"role" varchar,
  	"company" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"status_code" "enum_redirects_status_code" DEFAULT '301' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "proj_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "proj_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"client_name" varchar,
  	"hero_image_id" integer,
  	"body" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company_name" varchar,
  	"business_type" "enum_form_submissions_business_type",
  	"main_markets" varchar,
  	"budget" "enum_form_submissions_budget",
  	"message" varchar,
  	"status" "enum_form_submissions_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"pages_id" integer,
  	"posts_id" integer,
  	"media_id" integer,
  	"leads_id" integer,
  	"testimonials_id" integer,
  	"tags_id" integer,
  	"redirects_id" integer,
  	"categories_id" integer,
  	"projects_id" integer,
  	"form_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"maintenance_mode" boolean DEFAULT false,
  	"site_name" varchar NOT NULL,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"theme_primary_color" varchar DEFAULT '#D4A843',
  	"theme_background_color" varchar DEFAULT '#0A0F1E',
  	"enable_cookie_banner" boolean DEFAULT true,
  	"cookie_banner_text" varchar,
  	"cookie_policy_url" varchar,
  	"umami_website_id" varchar,
  	"umami_script_url" varchar DEFAULT 'https://cloud.umami.is/script.js',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_navigation_links_link_type" DEFAULT 'reference',
  	"link_label" varchar NOT NULL,
  	"link_url" varchar,
  	"link_open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_columns_links_link_type" DEFAULT 'reference',
  	"link_label" varchar NOT NULL,
  	"link_url" varchar,
  	"link_open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"copyright_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "seo_defaults" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"fallback_title" varchar,
  	"fallback_description" varchar,
  	"default_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "social_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "social_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "whatsapp_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enable_widget" boolean DEFAULT false,
  	"phone_number" varchar,
  	"default_message" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "analytics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"gtm_id" varchar,
  	"ga_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_microcopy" ADD CONSTRAINT "hero_microcopy_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fg_feats" ADD CONSTRAINT "fg_feats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta_banner_guar" ADD CONSTRAINT "cta_banner_guar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prc_tier_feats" ADD CONSTRAINT "prc_tier_feats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prc_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prc_tiers" ADD CONSTRAINT "prc_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_questions" ADD CONSTRAINT "faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "man_testimonials" ADD CONSTRAINT "man_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonial_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_block" ADD CONSTRAINT "pages_blocks_testimonial_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_stats" ADD CONSTRAINT "pages_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marquee_logos" ADD CONSTRAINT "pages_blocks_marquee_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_marquee_logos" ADD CONSTRAINT "pages_blocks_marquee_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marquee" ADD CONSTRAINT "pages_blocks_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "process_steps" ADD CONSTRAINT "process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process" ADD CONSTRAINT "pages_blocks_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_portfolio_showcase" ADD CONSTRAINT "pages_blocks_portfolio_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fshow_feats" ADD CONSTRAINT "fshow_feats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_showcase" ADD CONSTRAINT "pages_blocks_feature_showcase_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_showcase" ADD CONSTRAINT "pages_blocks_feature_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "roadmap_phases" ADD CONSTRAINT "roadmap_phases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_roadmap"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_roadmap" ADD CONSTRAINT "pages_blocks_roadmap_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_waitlist_form" ADD CONSTRAINT "pages_blocks_waitlist_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rfq_phases" ADD CONSTRAINT "rfq_phases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rfq_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rfq_objectives" ADD CONSTRAINT "rfq_objectives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rfq_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rfq_timelines" ADD CONSTRAINT "rfq_timelines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rfq_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rfq_budgets" ADD CONSTRAINT "rfq_budgets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rfq_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rfq_form" ADD CONSTRAINT "pages_blocks_rfq_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_showcase" ADD CONSTRAINT "pages_blocks_team_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ps_feats" ADD CONSTRAINT "ps_feats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_showcase" ADD CONSTRAINT "pages_blocks_product_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proj_archive" ADD CONSTRAINT "proj_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_portfolio_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_portfolio_archive" ADD CONSTRAINT "pages_blocks_portfolio_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "thesis_paras" ADD CONSTRAINT "thesis_paras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_thesis"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_thesis" ADD CONSTRAINT "pages_blocks_thesis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_global_presence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_global_presence" ADD CONSTRAINT "pages_blocks_global_presence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prob_stmts" ADD CONSTRAINT "prob_stmts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_problem_statement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_problem_statement" ADD CONSTRAINT "pages_blocks_problem_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "principles" ADD CONSTRAINT "principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_vision"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "btm_labels" ADD CONSTRAINT "btm_labels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_vision"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_vision" ADD CONSTRAINT "pages_blocks_vision_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_founder" ADD CONSTRAINT "pages_blocks_founder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_allowed_roles" ADD CONSTRAINT "pages_allowed_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hero_microcopy_v" ADD CONSTRAINT "_hero_microcopy_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_fg_feats_v" ADD CONSTRAINT "_fg_feats_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD CONSTRAINT "_pages_v_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cta_banner_guar_v" ADD CONSTRAINT "_cta_banner_guar_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prc_tier_feats_v" ADD CONSTRAINT "_prc_tier_feats_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prc_tiers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prc_tiers_v" ADD CONSTRAINT "_prc_tiers_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faq_questions_v" ADD CONSTRAINT "_faq_questions_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_man_testimonials_v" ADD CONSTRAINT "_man_testimonials_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonial_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_block" ADD CONSTRAINT "_pages_v_blocks_testimonial_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_stats" ADD CONSTRAINT "_pages_v_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marquee_logos" ADD CONSTRAINT "_pages_v_blocks_marquee_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marquee_logos" ADD CONSTRAINT "_pages_v_blocks_marquee_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marquee" ADD CONSTRAINT "_pages_v_blocks_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_process_steps_v" ADD CONSTRAINT "_process_steps_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process" ADD CONSTRAINT "_pages_v_blocks_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_portfolio_showcase" ADD CONSTRAINT "_pages_v_blocks_portfolio_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_fshow_feats_v" ADD CONSTRAINT "_fshow_feats_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_showcase" ADD CONSTRAINT "_pages_v_blocks_feature_showcase_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_showcase" ADD CONSTRAINT "_pages_v_blocks_feature_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_roadmap_phases_v" ADD CONSTRAINT "_roadmap_phases_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_roadmap"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_roadmap" ADD CONSTRAINT "_pages_v_blocks_roadmap_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_waitlist_form" ADD CONSTRAINT "_pages_v_blocks_waitlist_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rfq_phases_v" ADD CONSTRAINT "_rfq_phases_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rfq_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rfq_objectives_v" ADD CONSTRAINT "_rfq_objectives_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rfq_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rfq_timelines_v" ADD CONSTRAINT "_rfq_timelines_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rfq_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rfq_budgets_v" ADD CONSTRAINT "_rfq_budgets_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rfq_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rfq_form" ADD CONSTRAINT "_pages_v_blocks_rfq_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_showcase" ADD CONSTRAINT "_pages_v_blocks_team_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ps_feats_v" ADD CONSTRAINT "_ps_feats_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_product_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_showcase" ADD CONSTRAINT "_pages_v_blocks_product_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proj_archive_v" ADD CONSTRAINT "_proj_archive_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_portfolio_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_portfolio_archive" ADD CONSTRAINT "_pages_v_blocks_portfolio_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_thesis_paras_v" ADD CONSTRAINT "_thesis_paras_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_thesis"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_thesis" ADD CONSTRAINT "_pages_v_blocks_thesis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_global_presence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_global_presence" ADD CONSTRAINT "_pages_v_blocks_global_presence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prob_stmts_v" ADD CONSTRAINT "_prob_stmts_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_problem_statement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problem_statement" ADD CONSTRAINT "_pages_v_blocks_problem_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_principles_v" ADD CONSTRAINT "_principles_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_vision"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_btm_labels_v" ADD CONSTRAINT "_btm_labels_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_vision"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_vision" ADD CONSTRAINT "_pages_v_blocks_vision_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_founder" ADD CONSTRAINT "_pages_v_blocks_founder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_allowed_roles" ADD CONSTRAINT "_pages_v_version_allowed_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proj_metrics" ADD CONSTRAINT "proj_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proj_gallery" ADD CONSTRAINT "proj_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proj_gallery" ADD CONSTRAINT "proj_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_links" ADD CONSTRAINT "navigation_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_defaults" ADD CONSTRAINT "seo_defaults_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_links_links" ADD CONSTRAINT "social_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_links"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "hero_microcopy_order_idx" ON "hero_microcopy" USING btree ("_order");
  CREATE INDEX "hero_microcopy_parent_id_idx" ON "hero_microcopy" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_background_image_idx" ON "pages_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "fg_feats_order_idx" ON "fg_feats" USING btree ("_order");
  CREATE INDEX "fg_feats_parent_id_idx" ON "fg_feats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_order_idx" ON "pages_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_parent_id_idx" ON "pages_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_path_idx" ON "pages_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "cta_banner_guar_order_idx" ON "cta_banner_guar" USING btree ("_order");
  CREATE INDEX "cta_banner_guar_parent_id_idx" ON "cta_banner_guar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_order_idx" ON "pages_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_banner_parent_id_idx" ON "pages_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_path_idx" ON "pages_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "prc_tier_feats_order_idx" ON "prc_tier_feats" USING btree ("_order");
  CREATE INDEX "prc_tier_feats_parent_id_idx" ON "prc_tier_feats" USING btree ("_parent_id");
  CREATE INDEX "prc_tiers_order_idx" ON "prc_tiers" USING btree ("_order");
  CREATE INDEX "prc_tiers_parent_id_idx" ON "prc_tiers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_order_idx" ON "pages_blocks_pricing" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_parent_id_idx" ON "pages_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_path_idx" ON "pages_blocks_pricing" USING btree ("_path");
  CREATE INDEX "faq_questions_order_idx" ON "faq_questions" USING btree ("_order");
  CREATE INDEX "faq_questions_parent_id_idx" ON "faq_questions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "man_testimonials_order_idx" ON "man_testimonials" USING btree ("_order");
  CREATE INDEX "man_testimonials_parent_id_idx" ON "man_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_block_order_idx" ON "pages_blocks_testimonial_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonial_block_parent_id_idx" ON "pages_blocks_testimonial_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_block_path_idx" ON "pages_blocks_testimonial_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_stats_order_idx" ON "pages_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_stats_parent_id_idx" ON "pages_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_marquee_logos_order_idx" ON "pages_blocks_marquee_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_marquee_logos_parent_id_idx" ON "pages_blocks_marquee_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marquee_logos_logo_idx" ON "pages_blocks_marquee_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_marquee_order_idx" ON "pages_blocks_marquee" USING btree ("_order");
  CREATE INDEX "pages_blocks_marquee_parent_id_idx" ON "pages_blocks_marquee" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marquee_path_idx" ON "pages_blocks_marquee" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_cover_image_idx" ON "pages_blocks_video" USING btree ("cover_image_id");
  CREATE INDEX "process_steps_order_idx" ON "process_steps" USING btree ("_order");
  CREATE INDEX "process_steps_parent_id_idx" ON "process_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_order_idx" ON "pages_blocks_process" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_parent_id_idx" ON "pages_blocks_process" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_path_idx" ON "pages_blocks_process" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_portfolio_showcase_order_idx" ON "pages_blocks_portfolio_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_portfolio_showcase_parent_id_idx" ON "pages_blocks_portfolio_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_portfolio_showcase_path_idx" ON "pages_blocks_portfolio_showcase" USING btree ("_path");
  CREATE INDEX "fshow_feats_order_idx" ON "fshow_feats" USING btree ("_order");
  CREATE INDEX "fshow_feats_parent_id_idx" ON "fshow_feats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_showcase_order_idx" ON "pages_blocks_feature_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_showcase_parent_id_idx" ON "pages_blocks_feature_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_showcase_path_idx" ON "pages_blocks_feature_showcase" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_showcase_media_idx" ON "pages_blocks_feature_showcase" USING btree ("media_id");
  CREATE INDEX "roadmap_phases_order_idx" ON "roadmap_phases" USING btree ("_order");
  CREATE INDEX "roadmap_phases_parent_id_idx" ON "roadmap_phases" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_roadmap_order_idx" ON "pages_blocks_roadmap" USING btree ("_order");
  CREATE INDEX "pages_blocks_roadmap_parent_id_idx" ON "pages_blocks_roadmap" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_roadmap_path_idx" ON "pages_blocks_roadmap" USING btree ("_path");
  CREATE INDEX "pages_blocks_waitlist_form_order_idx" ON "pages_blocks_waitlist_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_waitlist_form_parent_id_idx" ON "pages_blocks_waitlist_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_waitlist_form_path_idx" ON "pages_blocks_waitlist_form" USING btree ("_path");
  CREATE INDEX "rfq_phases_order_idx" ON "rfq_phases" USING btree ("_order");
  CREATE INDEX "rfq_phases_parent_id_idx" ON "rfq_phases" USING btree ("_parent_id");
  CREATE INDEX "rfq_objectives_order_idx" ON "rfq_objectives" USING btree ("_order");
  CREATE INDEX "rfq_objectives_parent_id_idx" ON "rfq_objectives" USING btree ("_parent_id");
  CREATE INDEX "rfq_timelines_order_idx" ON "rfq_timelines" USING btree ("_order");
  CREATE INDEX "rfq_timelines_parent_id_idx" ON "rfq_timelines" USING btree ("_parent_id");
  CREATE INDEX "rfq_budgets_order_idx" ON "rfq_budgets" USING btree ("_order");
  CREATE INDEX "rfq_budgets_parent_id_idx" ON "rfq_budgets" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rfq_form_order_idx" ON "pages_blocks_rfq_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_rfq_form_parent_id_idx" ON "pages_blocks_rfq_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rfq_form_path_idx" ON "pages_blocks_rfq_form" USING btree ("_path");
  CREATE INDEX "team_members_order_idx" ON "team_members" USING btree ("_order");
  CREATE INDEX "team_members_parent_id_idx" ON "team_members" USING btree ("_parent_id");
  CREATE INDEX "team_members_image_idx" ON "team_members" USING btree ("image_id");
  CREATE INDEX "pages_blocks_team_showcase_order_idx" ON "pages_blocks_team_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_showcase_parent_id_idx" ON "pages_blocks_team_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_showcase_path_idx" ON "pages_blocks_team_showcase" USING btree ("_path");
  CREATE INDEX "ps_feats_order_idx" ON "ps_feats" USING btree ("_order");
  CREATE INDEX "ps_feats_parent_id_idx" ON "ps_feats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_showcase_order_idx" ON "pages_blocks_product_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_showcase_parent_id_idx" ON "pages_blocks_product_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_showcase_path_idx" ON "pages_blocks_product_showcase" USING btree ("_path");
  CREATE INDEX "proj_archive_order_idx" ON "proj_archive" USING btree ("_order");
  CREATE INDEX "proj_archive_parent_id_idx" ON "proj_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_portfolio_archive_order_idx" ON "pages_blocks_portfolio_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_portfolio_archive_parent_id_idx" ON "pages_blocks_portfolio_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_portfolio_archive_path_idx" ON "pages_blocks_portfolio_archive" USING btree ("_path");
  CREATE INDEX "thesis_paras_order_idx" ON "thesis_paras" USING btree ("_order");
  CREATE INDEX "thesis_paras_parent_id_idx" ON "thesis_paras" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_thesis_order_idx" ON "pages_blocks_thesis" USING btree ("_order");
  CREATE INDEX "pages_blocks_thesis_parent_id_idx" ON "pages_blocks_thesis" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_thesis_path_idx" ON "pages_blocks_thesis" USING btree ("_path");
  CREATE INDEX "locations_order_idx" ON "locations" USING btree ("_order");
  CREATE INDEX "locations_parent_id_idx" ON "locations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_global_presence_order_idx" ON "pages_blocks_global_presence" USING btree ("_order");
  CREATE INDEX "pages_blocks_global_presence_parent_id_idx" ON "pages_blocks_global_presence" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_global_presence_path_idx" ON "pages_blocks_global_presence" USING btree ("_path");
  CREATE INDEX "prob_stmts_order_idx" ON "prob_stmts" USING btree ("_order");
  CREATE INDEX "prob_stmts_parent_id_idx" ON "prob_stmts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_problem_statement_order_idx" ON "pages_blocks_problem_statement" USING btree ("_order");
  CREATE INDEX "pages_blocks_problem_statement_parent_id_idx" ON "pages_blocks_problem_statement" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_problem_statement_path_idx" ON "pages_blocks_problem_statement" USING btree ("_path");
  CREATE INDEX "principles_order_idx" ON "principles" USING btree ("_order");
  CREATE INDEX "principles_parent_id_idx" ON "principles" USING btree ("_parent_id");
  CREATE INDEX "btm_labels_order_idx" ON "btm_labels" USING btree ("_order");
  CREATE INDEX "btm_labels_parent_id_idx" ON "btm_labels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_vision_order_idx" ON "pages_blocks_vision" USING btree ("_order");
  CREATE INDEX "pages_blocks_vision_parent_id_idx" ON "pages_blocks_vision" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_vision_path_idx" ON "pages_blocks_vision" USING btree ("_path");
  CREATE INDEX "pages_blocks_founder_order_idx" ON "pages_blocks_founder" USING btree ("_order");
  CREATE INDEX "pages_blocks_founder_parent_id_idx" ON "pages_blocks_founder" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_founder_path_idx" ON "pages_blocks_founder" USING btree ("_path");
  CREATE INDEX "pages_allowed_roles_order_idx" ON "pages_allowed_roles" USING btree ("_order");
  CREATE INDEX "pages_allowed_roles_parent_id_idx" ON "pages_allowed_roles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_projects_id_idx" ON "pages_rels" USING btree ("projects_id");
  CREATE INDEX "_hero_microcopy_v_order_idx" ON "_hero_microcopy_v" USING btree ("_order");
  CREATE INDEX "_hero_microcopy_v_parent_id_idx" ON "_hero_microcopy_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_background_image_idx" ON "_pages_v_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "_fg_feats_v_order_idx" ON "_fg_feats_v" USING btree ("_order");
  CREATE INDEX "_fg_feats_v_parent_id_idx" ON "_fg_feats_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_order_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_parent_id_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_path_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_cta_banner_guar_v_order_idx" ON "_cta_banner_guar_v" USING btree ("_order");
  CREATE INDEX "_cta_banner_guar_v_parent_id_idx" ON "_cta_banner_guar_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_order_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_banner_parent_id_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_path_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "_prc_tier_feats_v_order_idx" ON "_prc_tier_feats_v" USING btree ("_order");
  CREATE INDEX "_prc_tier_feats_v_parent_id_idx" ON "_prc_tier_feats_v" USING btree ("_parent_id");
  CREATE INDEX "_prc_tiers_v_order_idx" ON "_prc_tiers_v" USING btree ("_order");
  CREATE INDEX "_prc_tiers_v_parent_id_idx" ON "_prc_tiers_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_order_idx" ON "_pages_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_parent_id_idx" ON "_pages_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_path_idx" ON "_pages_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_faq_questions_v_order_idx" ON "_faq_questions_v" USING btree ("_order");
  CREATE INDEX "_faq_questions_v_parent_id_idx" ON "_faq_questions_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_man_testimonials_v_order_idx" ON "_man_testimonials_v" USING btree ("_order");
  CREATE INDEX "_man_testimonials_v_parent_id_idx" ON "_man_testimonials_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_block_order_idx" ON "_pages_v_blocks_testimonial_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonial_block_parent_id_idx" ON "_pages_v_blocks_testimonial_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_block_path_idx" ON "_pages_v_blocks_testimonial_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_stats_order_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_stats_parent_id_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_marquee_logos_order_idx" ON "_pages_v_blocks_marquee_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marquee_logos_parent_id_idx" ON "_pages_v_blocks_marquee_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marquee_logos_logo_idx" ON "_pages_v_blocks_marquee_logos" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_marquee_order_idx" ON "_pages_v_blocks_marquee" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marquee_parent_id_idx" ON "_pages_v_blocks_marquee" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marquee_path_idx" ON "_pages_v_blocks_marquee" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_cover_image_idx" ON "_pages_v_blocks_video" USING btree ("cover_image_id");
  CREATE INDEX "_process_steps_v_order_idx" ON "_process_steps_v" USING btree ("_order");
  CREATE INDEX "_process_steps_v_parent_id_idx" ON "_process_steps_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_order_idx" ON "_pages_v_blocks_process" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_parent_id_idx" ON "_pages_v_blocks_process" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_path_idx" ON "_pages_v_blocks_process" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_portfolio_showcase_order_idx" ON "_pages_v_blocks_portfolio_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_portfolio_showcase_parent_id_idx" ON "_pages_v_blocks_portfolio_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_portfolio_showcase_path_idx" ON "_pages_v_blocks_portfolio_showcase" USING btree ("_path");
  CREATE INDEX "_fshow_feats_v_order_idx" ON "_fshow_feats_v" USING btree ("_order");
  CREATE INDEX "_fshow_feats_v_parent_id_idx" ON "_fshow_feats_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_showcase_order_idx" ON "_pages_v_blocks_feature_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_showcase_parent_id_idx" ON "_pages_v_blocks_feature_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_showcase_path_idx" ON "_pages_v_blocks_feature_showcase" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_showcase_media_idx" ON "_pages_v_blocks_feature_showcase" USING btree ("media_id");
  CREATE INDEX "_roadmap_phases_v_order_idx" ON "_roadmap_phases_v" USING btree ("_order");
  CREATE INDEX "_roadmap_phases_v_parent_id_idx" ON "_roadmap_phases_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_roadmap_order_idx" ON "_pages_v_blocks_roadmap" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_roadmap_parent_id_idx" ON "_pages_v_blocks_roadmap" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_roadmap_path_idx" ON "_pages_v_blocks_roadmap" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_waitlist_form_order_idx" ON "_pages_v_blocks_waitlist_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_waitlist_form_parent_id_idx" ON "_pages_v_blocks_waitlist_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_waitlist_form_path_idx" ON "_pages_v_blocks_waitlist_form" USING btree ("_path");
  CREATE INDEX "_rfq_phases_v_order_idx" ON "_rfq_phases_v" USING btree ("_order");
  CREATE INDEX "_rfq_phases_v_parent_id_idx" ON "_rfq_phases_v" USING btree ("_parent_id");
  CREATE INDEX "_rfq_objectives_v_order_idx" ON "_rfq_objectives_v" USING btree ("_order");
  CREATE INDEX "_rfq_objectives_v_parent_id_idx" ON "_rfq_objectives_v" USING btree ("_parent_id");
  CREATE INDEX "_rfq_timelines_v_order_idx" ON "_rfq_timelines_v" USING btree ("_order");
  CREATE INDEX "_rfq_timelines_v_parent_id_idx" ON "_rfq_timelines_v" USING btree ("_parent_id");
  CREATE INDEX "_rfq_budgets_v_order_idx" ON "_rfq_budgets_v" USING btree ("_order");
  CREATE INDEX "_rfq_budgets_v_parent_id_idx" ON "_rfq_budgets_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rfq_form_order_idx" ON "_pages_v_blocks_rfq_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rfq_form_parent_id_idx" ON "_pages_v_blocks_rfq_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rfq_form_path_idx" ON "_pages_v_blocks_rfq_form" USING btree ("_path");
  CREATE INDEX "_team_members_v_order_idx" ON "_team_members_v" USING btree ("_order");
  CREATE INDEX "_team_members_v_parent_id_idx" ON "_team_members_v" USING btree ("_parent_id");
  CREATE INDEX "_team_members_v_image_idx" ON "_team_members_v" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_team_showcase_order_idx" ON "_pages_v_blocks_team_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_showcase_parent_id_idx" ON "_pages_v_blocks_team_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_showcase_path_idx" ON "_pages_v_blocks_team_showcase" USING btree ("_path");
  CREATE INDEX "_ps_feats_v_order_idx" ON "_ps_feats_v" USING btree ("_order");
  CREATE INDEX "_ps_feats_v_parent_id_idx" ON "_ps_feats_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_showcase_order_idx" ON "_pages_v_blocks_product_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_showcase_parent_id_idx" ON "_pages_v_blocks_product_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_showcase_path_idx" ON "_pages_v_blocks_product_showcase" USING btree ("_path");
  CREATE INDEX "_proj_archive_v_order_idx" ON "_proj_archive_v" USING btree ("_order");
  CREATE INDEX "_proj_archive_v_parent_id_idx" ON "_proj_archive_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_portfolio_archive_order_idx" ON "_pages_v_blocks_portfolio_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_portfolio_archive_parent_id_idx" ON "_pages_v_blocks_portfolio_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_portfolio_archive_path_idx" ON "_pages_v_blocks_portfolio_archive" USING btree ("_path");
  CREATE INDEX "_thesis_paras_v_order_idx" ON "_thesis_paras_v" USING btree ("_order");
  CREATE INDEX "_thesis_paras_v_parent_id_idx" ON "_thesis_paras_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_thesis_order_idx" ON "_pages_v_blocks_thesis" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_thesis_parent_id_idx" ON "_pages_v_blocks_thesis" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_thesis_path_idx" ON "_pages_v_blocks_thesis" USING btree ("_path");
  CREATE INDEX "_locations_v_order_idx" ON "_locations_v" USING btree ("_order");
  CREATE INDEX "_locations_v_parent_id_idx" ON "_locations_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_global_presence_order_idx" ON "_pages_v_blocks_global_presence" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_global_presence_parent_id_idx" ON "_pages_v_blocks_global_presence" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_global_presence_path_idx" ON "_pages_v_blocks_global_presence" USING btree ("_path");
  CREATE INDEX "_prob_stmts_v_order_idx" ON "_prob_stmts_v" USING btree ("_order");
  CREATE INDEX "_prob_stmts_v_parent_id_idx" ON "_prob_stmts_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_problem_statement_order_idx" ON "_pages_v_blocks_problem_statement" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_problem_statement_parent_id_idx" ON "_pages_v_blocks_problem_statement" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_problem_statement_path_idx" ON "_pages_v_blocks_problem_statement" USING btree ("_path");
  CREATE INDEX "_principles_v_order_idx" ON "_principles_v" USING btree ("_order");
  CREATE INDEX "_principles_v_parent_id_idx" ON "_principles_v" USING btree ("_parent_id");
  CREATE INDEX "_btm_labels_v_order_idx" ON "_btm_labels_v" USING btree ("_order");
  CREATE INDEX "_btm_labels_v_parent_id_idx" ON "_btm_labels_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_vision_order_idx" ON "_pages_v_blocks_vision" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_vision_parent_id_idx" ON "_pages_v_blocks_vision" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_vision_path_idx" ON "_pages_v_blocks_vision" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_founder_order_idx" ON "_pages_v_blocks_founder" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_founder_parent_id_idx" ON "_pages_v_blocks_founder" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_founder_path_idx" ON "_pages_v_blocks_founder" USING btree ("_path");
  CREATE INDEX "_pages_v_version_allowed_roles_order_idx" ON "_pages_v_version_allowed_roles" USING btree ("_order");
  CREATE INDEX "_pages_v_version_allowed_roles_parent_id_idx" ON "_pages_v_version_allowed_roles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_projects_id_idx" ON "_pages_v_rels" USING btree ("projects_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "testimonials_image_idx" ON "testimonials" USING btree ("image_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "proj_metrics_order_idx" ON "proj_metrics" USING btree ("_order");
  CREATE INDEX "proj_metrics_parent_id_idx" ON "proj_metrics" USING btree ("_parent_id");
  CREATE INDEX "proj_gallery_order_idx" ON "proj_gallery" USING btree ("_order");
  CREATE INDEX "proj_gallery_parent_id_idx" ON "proj_gallery" USING btree ("_parent_id");
  CREATE INDEX "proj_gallery_image_idx" ON "proj_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "navigation_links_order_idx" ON "navigation_links" USING btree ("_order");
  CREATE INDEX "navigation_links_parent_id_idx" ON "navigation_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_rels_order_idx" ON "navigation_rels" USING btree ("order");
  CREATE INDEX "navigation_rels_parent_idx" ON "navigation_rels" USING btree ("parent_id");
  CREATE INDEX "navigation_rels_path_idx" ON "navigation_rels" USING btree ("path");
  CREATE INDEX "navigation_rels_pages_id_idx" ON "navigation_rels" USING btree ("pages_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "seo_defaults_default_og_image_idx" ON "seo_defaults" USING btree ("default_og_image_id");
  CREATE INDEX "social_links_links_order_idx" ON "social_links_links" USING btree ("_order");
  CREATE INDEX "social_links_links_parent_id_idx" ON "social_links_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "hero_microcopy" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "fg_feats" CASCADE;
  DROP TABLE "pages_blocks_feature_grid" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "cta_banner_guar" CASCADE;
  DROP TABLE "pages_blocks_cta_banner" CASCADE;
  DROP TABLE "prc_tier_feats" CASCADE;
  DROP TABLE "prc_tiers" CASCADE;
  DROP TABLE "pages_blocks_pricing" CASCADE;
  DROP TABLE "faq_questions" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "man_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonial_block" CASCADE;
  DROP TABLE "pages_blocks_stats_stats" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_marquee_logos" CASCADE;
  DROP TABLE "pages_blocks_marquee" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "process_steps" CASCADE;
  DROP TABLE "pages_blocks_process" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_portfolio_showcase" CASCADE;
  DROP TABLE "fshow_feats" CASCADE;
  DROP TABLE "pages_blocks_feature_showcase" CASCADE;
  DROP TABLE "roadmap_phases" CASCADE;
  DROP TABLE "pages_blocks_roadmap" CASCADE;
  DROP TABLE "pages_blocks_waitlist_form" CASCADE;
  DROP TABLE "rfq_phases" CASCADE;
  DROP TABLE "rfq_objectives" CASCADE;
  DROP TABLE "rfq_timelines" CASCADE;
  DROP TABLE "rfq_budgets" CASCADE;
  DROP TABLE "pages_blocks_rfq_form" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "pages_blocks_team_showcase" CASCADE;
  DROP TABLE "ps_feats" CASCADE;
  DROP TABLE "pages_blocks_product_showcase" CASCADE;
  DROP TABLE "proj_archive" CASCADE;
  DROP TABLE "pages_blocks_portfolio_archive" CASCADE;
  DROP TABLE "thesis_paras" CASCADE;
  DROP TABLE "pages_blocks_thesis" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "pages_blocks_global_presence" CASCADE;
  DROP TABLE "prob_stmts" CASCADE;
  DROP TABLE "pages_blocks_problem_statement" CASCADE;
  DROP TABLE "principles" CASCADE;
  DROP TABLE "btm_labels" CASCADE;
  DROP TABLE "pages_blocks_vision" CASCADE;
  DROP TABLE "pages_blocks_founder" CASCADE;
  DROP TABLE "pages_allowed_roles" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_hero_microcopy_v" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_fg_feats_v" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_cta_banner_guar_v" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner" CASCADE;
  DROP TABLE "_prc_tier_feats_v" CASCADE;
  DROP TABLE "_prc_tiers_v" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing" CASCADE;
  DROP TABLE "_faq_questions_v" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_man_testimonials_v" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_block" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_marquee_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_marquee" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_process_steps_v" CASCADE;
  DROP TABLE "_pages_v_blocks_process" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_portfolio_showcase" CASCADE;
  DROP TABLE "_fshow_feats_v" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_showcase" CASCADE;
  DROP TABLE "_roadmap_phases_v" CASCADE;
  DROP TABLE "_pages_v_blocks_roadmap" CASCADE;
  DROP TABLE "_pages_v_blocks_waitlist_form" CASCADE;
  DROP TABLE "_rfq_phases_v" CASCADE;
  DROP TABLE "_rfq_objectives_v" CASCADE;
  DROP TABLE "_rfq_timelines_v" CASCADE;
  DROP TABLE "_rfq_budgets_v" CASCADE;
  DROP TABLE "_pages_v_blocks_rfq_form" CASCADE;
  DROP TABLE "_team_members_v" CASCADE;
  DROP TABLE "_pages_v_blocks_team_showcase" CASCADE;
  DROP TABLE "_ps_feats_v" CASCADE;
  DROP TABLE "_pages_v_blocks_product_showcase" CASCADE;
  DROP TABLE "_proj_archive_v" CASCADE;
  DROP TABLE "_pages_v_blocks_portfolio_archive" CASCADE;
  DROP TABLE "_thesis_paras_v" CASCADE;
  DROP TABLE "_pages_v_blocks_thesis" CASCADE;
  DROP TABLE "_locations_v" CASCADE;
  DROP TABLE "_pages_v_blocks_global_presence" CASCADE;
  DROP TABLE "_prob_stmts_v" CASCADE;
  DROP TABLE "_pages_v_blocks_problem_statement" CASCADE;
  DROP TABLE "_principles_v" CASCADE;
  DROP TABLE "_btm_labels_v" CASCADE;
  DROP TABLE "_pages_v_blocks_vision" CASCADE;
  DROP TABLE "_pages_v_blocks_founder" CASCADE;
  DROP TABLE "_pages_v_version_allowed_roles" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "proj_metrics" CASCADE;
  DROP TABLE "proj_gallery" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_links" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_rels" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "seo_defaults" CASCADE;
  DROP TABLE "social_links_links" CASCADE;
  DROP TABLE "social_links" CASCADE;
  DROP TABLE "whatsapp_config" CASCADE;
  DROP TABLE "analytics" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_theme";
  DROP TYPE "public"."enum_pages_blocks_cta_theme";
  DROP TYPE "public"."enum_pages_blocks_process_variant";
  DROP TYPE "public"."enum_pages_allowed_roles_role";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_theme";
  DROP TYPE "public"."enum__pages_v_blocks_cta_theme";
  DROP TYPE "public"."enum__pages_v_blocks_process_variant";
  DROP TYPE "public"."enum__pages_v_version_allowed_roles_role";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_leads_source";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_redirects_status_code";
  DROP TYPE "public"."enum_form_submissions_business_type";
  DROP TYPE "public"."enum_form_submissions_budget";
  DROP TYPE "public"."enum_form_submissions_status";
  DROP TYPE "public"."enum_navigation_links_link_type";
  DROP TYPE "public"."enum_footer_columns_links_link_type";`)
}
