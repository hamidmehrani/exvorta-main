# Boilerplate Getting Started Guide

Welcome to the Exvorta Boilerplate! This is a clean, minimal starting point for new client projects, featuring a generic component architecture and an optimized Payload CMS setup.

## 1. Initial Setup Checklist

Follow these steps to initialize a new client project:

- [ ] **Global Search & Replace**: Rename `boilerplate` and `exvorta_local` in your `.env`, `docker-compose.yml`, and `package.json` to match your specific `{{PROJECT_NAME}}`.
- [ ] **Environment Variables**:
  - Copy `.env.example` to `.env`.
  - Set a secure `PAYLOAD_SECRET`.
  - Populate the `CLOUDINARY_*` API keys (required for media uploads).
  - Add Turnstile keys if using the Contact Form.
- [ ] **Database Setup (Neon-First)**:
  - Create a new Neon branch for your local development environment from the main project.
  - Copy both the pooled (`DATABASE_URI`) and unpooled (`DATABASE_URI_UNPOOLED`) connection strings from the Neon Connect dialog into your `.env`.
- [ ] **Initialize CMS Schema**: Run `npm run db:migrate` or use the migration script:
  `NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" npx tsx scripts/run-migration.ts run`
- [ ] **Start Development Server**: Run `npm run dev`. This will connect using the pooled database connection.

### Fallback: Local Database via Docker
If you cannot use Neon or need a strictly offline setup, you can still use Docker:
- Run `docker compose up -d` to spin up a local Postgres container.
- Use the local connection string for both `DATABASE_URI` and `DATABASE_URI_UNPOOLED`.
- [ ] **Branding Update**:
  - Replace `app/icon.svg` with the client's favicon.
  - Update `@/components/admin/AgencyLogo` with the client's logo for the admin panel.

## 2. Infrastructure Notes

### Cloudinary Integration & Image Optimization
This boilerplate uses a custom Payload storage plugin that automatically uploads media to Cloudinary.
- **Why no `next/image`?** You'll notice `CMSImage.tsx` uses a standard HTML `<img>` tag instead of Next.js's built-in image optimization. This is intentional. The Cloudinary plugin uses an `afterRead` hook to automatically inject `f_auto,q_auto` and `CMSImage.tsx` automatically injects `c_fill,g_auto`. This allows Cloudinary's edge servers to handle all cropping and optimization dynamically, bypassing the Next.js server entirely and significantly improving performance.

### Internationalization (i18n)
The boilerplate is pre-configured with `next-intl` and defaults to three locales: `en` (LTR default), `ar` (RTL), and `fa` (RTL). 
- If you need to add or remove languages, update the `locales` array in `payload.config.ts`, `i18n/routing.ts`, and the `LOCALES` array inside `scripts/take-screenshots.js` and `scripts/sync-page-images.ts`.

### Lead Emails & Resend
The `Leads` collection contains an optional `sendLeadEmails.ts` hook. By default, if no `RESEND_API_KEY` is present, it gracefully skips execution. If the client requires automated email notifications upon contact form submission, simply provide the API key.

## 3. Tooling & Scripts

- **`npm run test:screenshots`** (or `node scripts/take-screenshots.js`): Uses system Chrome to capture full-page localized screenshots. Very useful for visual QA.
- **`node scripts/sync-page-images.ts <page-slug>`**: A safe, non-destructive script to sync image references from the default English layout to all localized layouts, preventing image drift without needing destructive database migrations.
- **`node scripts/diagnose-broken-images.ts`**: Deeply traverses all CMS blocks to verify no images return 404s.
