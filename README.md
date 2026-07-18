# Boilerplate Engine

This is the fully scalable, white-label CMS engine designed for B2B export and agency websites.

## Setup Instructions

1. Clone the repository.
2. Run `npm install` (Note: if you experience dependency tree conflicts with Next.js and Payload CMS, use `--legacy-peer-deps` or ensure `next` is pinned to `15.4.11` as per the known issues below).
3. Copy `.env.example` to `.env` and configure your credentials.
4. Start the database (e.g., using `docker run` or your own PostgreSQL instance).
5. Run the initial database migration:
   ```bash
   NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" npx tsx scripts/run-migration.ts run
   ```
6. Start the local server: `npm run dev`

## Required Environment Variables

Ensure the following critical variables are set in your `.env` file:
- `DATABASE_URI`: Your PostgreSQL connection string.
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

- **Next.js Version Vulnerability:** `npm audit` will currently report a High-severity vulnerability for `next@15.4.11`. This is a known conflict. Payload CMS strictly restricts Next.js to `<15.5.0` in its peer dependencies, locking us out of the security patch currently only available in `15.5.x`. Do not blindly upgrade `next` past `15.4.11` via `npm install` without `--legacy-peer-deps` or until Payload officially updates `@payloadcms/next` to support React 19 / Next 15.5+. Revisit this periodically.
