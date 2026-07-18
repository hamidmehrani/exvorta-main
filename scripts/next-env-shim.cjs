/*
 * Preload shim that repairs the tsx <-> @next/env ESM/CJS interop bug AND loads
 * the project's .env files, matching the behavior of Payload's CLI `loadEnv()`.
 *
 * Root cause: @next/env ships an ncc bundle that sets `__esModule: true` on its
 * exports but defines NO `.default` property. Under tsx, an ESM
 * `import nextEnvImport from '@next/env'` therefore resolves to `undefined`,
 * which crashes Payload's internal `dist/bin/loadEnv.js` at module-eval time:
 *   `nextEnvImport.loadEnvConfig`  ->  TypeError: Cannot read properties of undefined.
 *
 * Fix: load the module via CJS `require()` (which returns the full namespace
 * object correctly), then attach `.default = module.exports`. Because @next/env
 * is a CJS module, the require cache and tsx's ESM module cache share the same
 * object, so the mutation is visible to Payload's ESM default import.
 *
 * This shim also calls loadEnvConfig() so DATABASE_URI / PAYLOAD_SECRET etc.
 * are populated before payload.config.ts is imported (payload.config.ts reads
 * them at module top-level).
 *
 * Load this with:  NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" npx tsx ...
 */
const m = require('@next/env')
// Repair the interop FIRST, before any other code can trip on the missing default.
if (m && m.loadEnvConfig && !m.default) {
  m.default = m
}
// Load .env files exactly like Payload's CLI does.
m.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production')
