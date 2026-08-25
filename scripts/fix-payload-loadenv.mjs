/**
 * Postinstall fix for payload@3.x CLI bug.
 *
 * payload/dist/bin/loadEnv.js does `import nextEnvImport from '@next/env'`.
 * When the CLI runs under tsx (ESM loader), the CJS interop for @next/env
 * resolves the default export to `undefined`, so `const { loadEnvConfig } =
 * nextEnvImport` throws "Cannot destructure property 'loadEnvConfig'" and
 * every `payload migrate` / `payload generate:*` command crashes before
 * reaching user code. Plain node resolves it fine, which is why this only
 * bites CLI scripts, not next dev.
 *
 * Fix: rewrite the import to a namespace import with a fallback chain,
 * matching what payload fixed in later releases. Idempotent; re-applied on
 * every install so fresh clones never see manual node_modules edits.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

let loadEnvPath
try {
  // payload's exports map exposes neither ./package.json nor ./dist/bin,
  // so resolve the runtime entry and walk to dist/bin from there.
  const entry = require.resolve('payload')
  loadEnvPath = path.join(path.dirname(entry), 'bin', 'loadEnv.js')
} catch {
  console.warn('[fix-payload-loadenv] payload not installed yet, skipping')
  process.exit(0)
}

const FIXED = `import * as nextEnvImport from '@next/env';
import { findUpSync } from '../utilities/findUp.js';
const loadEnvConfig = nextEnvImport.loadEnvConfig || nextEnvImport.default?.loadEnvConfig || (() => ({ loadedEnvFiles: [] }));
export function loadEnv(path) {
    try {
        if (path?.length) {
            loadEnvConfig(path, true);
            return;
        }
        const dev = process.env.NODE_ENV !== 'production';
        const result = loadEnvConfig(process.cwd(), dev) || { loadedEnvFiles: [] };
        const loadedEnvFiles = result.loadedEnvFiles;
        if (!loadedEnvFiles?.length) {
            findUpSync({
                condition: (dir)=>{
                    try {
                        const { loadedEnvFiles } = loadEnvConfig(dir, true) || {};
                        if (loadedEnvFiles?.length) {
                            return true;
                        }
                    } catch {}
                },
                dir: process.cwd()
            });
        }
    } catch {}
}
//# sourceMappingURL=loadEnv.js.map
`

const original = readFileSync(loadEnvPath, 'utf8')

if (original.includes("import * as nextEnvImport")) {
  console.log('[fix-payload-loadenv] already patched, skipping')
  process.exit(0)
}

if (!original.includes("import nextEnvImport from '@next/env'") || !original.includes('const { loadEnvConfig } = nextEnvImport')) {
  console.error('[fix-payload-loadenv] unexpected loadEnv.js content, refusing to patch.')
  console.error('[fix-payload-loadenv] payload may have shipped its own fix — check upstream before updating this script.')
  process.exit(1)
}

writeFileSync(loadEnvPath, FIXED)
console.log('[fix-payload-loadenv] patched payload/dist/bin/loadEnv.js (namespace import + fallback)')
