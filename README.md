# Boilerplate Engine

This is the fully scalable, white-label CMS engine designed for B2B export and agency websites.

## Setup Instructions

1. Clone the repository.
2. Run `npm install` (Note: if you experience dependency tree conflicts with Next.js and Payload CMS, use `--legacy-peer-deps` or ensure `next` is pinned to `15.4.11` as per the known issues below).
3. Copy `.env.example` to `.env` and configure your credentials.
4. Set up the database (Neon-First approach):
   - Create a new branch in Neon.
   - Copy the pooled connection string into `DATABASE_URI`.
   - Copy the unpooled/direct connection string into `DATABASE_URI_UNPOOLED`.
   - *(Fallback: You can still use a local Docker Postgres instance if needed).*
5. Run the initial database migration:
   ```bash
   NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" npx tsx scripts/run-migration.ts run
   ```
6. Start the local server: `npm run dev`

## Required Environment Variables

Ensure the following critical variables are set in your `.env` file:
- `DATABASE_URI`: Your Neon POOLED PostgreSQL connection string.
- `DATABASE_URI_UNPOOLED`: Your Neon DIRECT connection string for migrations.
- `PAYLOAD_SECRET`: A secure random string for Payload CMS encryption.
- `TURNSTILE_SECRET_KEY`: Required for contact form security.
- `SKIP_TURNSTILE_IN_DEV`: Set to `true` to disable CAPTCHA verification in local development (ignored in production).
- `CLOUDINARY_*`: API keys for media uploads.

## Export Module Toggling

To enable the specialized B2B export features (Origins, Certifications, and export-specific product fields like MOQ, Incoterms, etc.):
1. Open `boilerplate.config.ts`.
2. Change `exportTrade: true`.
3. Restart the server. The database schemas and admin panels will automatically adapt.

## Adding New Locales

The boilerplate currently ships with English (`en`), Arabic (`ar`), and Persian (`fa`) enabled by default. To enable more:
1. Open `payload.config.ts` and uncomment the target locales in the `localization.locales` array.
2. Ensure you add corresponding translation mappings in the `translations/[locale]/` directory.
3. Run the sync script to compile the new messages:
   ```bash
   NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" npx tsx scripts/sync-locales.ts
   ```

## Stitch-to-Production Pipeline Expectations

When utilizing the generative AI `Stitch` pipeline to create blocks:
- Ensure all custom blocks are fully decoupled from layout logic.
- Avoid rendering core models (Products, Categories) directly within layout-specific blocks. Use utility components or generic blocks for UI rendering.

## Known Issues & Ongoing Maintenance

- **Next.js Version Vulnerability:** `npm audit` will currently report a High-severity vulnerability for `next@15.4.11` as well as a Moderate finding for `postcss`. This is a known conflict. Payload CMS strictly restricts Next.js to `<15.5.0` in its peer dependencies, locking us out of the security patch currently only available in `15.5.x`. Do not wildly upgrade `next` past `15.4.11` via `npm install` without `--legacy-peer-deps` or until Payload officially updates `@payloadcms/next` to support React 19 / Next 15.5+. Do not attempt to force-fix this with `npm audit fix --force`. Revisit this periodically.
- **esbuild Dev-Only Exposure:** `npm audit` reports a moderate vulnerability in `esbuild`. This is a transitive `devDependency` pulled in via `drizzle-kit` (`@esbuild-kit/esm-loader`). It is only used during local development for generating migrations and does not ship in the Next.js production bundle. It is accepted as low-risk.
- **Payload CLI ESM Bug (`generate:types` and `migrate:create`):** Running `npx payload generate:types` or `npx payload migrate:create` currently fails with `ERR_REQUIRE_ASYNC_MODULE` in this environment. This is a known issue caused by the interaction between Node.js 20.19, Next.js 15.4 (with top-level await in config/Lexical), and the underlying `tsx` runner used by the Payload v3 CLI. Until this is fixed upstream, you must manually patch schema changes into `payload-types.ts` and use raw SQL or standard Next.js scripts for migrations. (Note: A manual patch for `Navigation` and `Footer` types was applied on 2026-07-19; be careful not to blindly overwrite it if the generator is partially run).
- **dompurify (monaco-editor):** `npm audit` reports a moderate cross-site scripting vulnerability in `dompurify`. This is a transitive dependency of `@monaco-editor/react`, which is required by `@payloadcms/ui` for Payload Admin's code editor fields and core UI components. Because Payload's admin interface runs behind authentication and is restricted to trusted administrators, this exposure is mitigated. We must wait for Payload to bump their internal `monaco-editor` dependencies.
