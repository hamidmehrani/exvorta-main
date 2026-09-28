/**
 * CANONICAL BASELINE SOURCE OF TRUTH (PHASE 11 TOOLING)
 * 
 * In strict compliance with Rule 6:
 * Reads ONLY the canonical Phase 11 post-leak-fix output file:
 * `verification/phase11/lighthouse/post-leak-fix-baseline.json`.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CANONICAL_P11_FILE = path.resolve(__dirname, '../lighthouse/post-leak-fix-baseline.json')

export function getCanonicalBaselineData() {
  if (!fs.existsSync(CANONICAL_P11_FILE)) {
    throw new Error(`Canonical Phase 11 baseline file not found at: ${CANONICAL_P11_FILE}`)
  }
  return JSON.parse(fs.readFileSync(CANONICAL_P11_FILE, 'utf8'))
}

export function getCanonicalRouteBaseline(route) {
  const data = getCanonicalBaselineData()
  const r = data.routes.find(item => item.route === route)
  if (!r) {
    throw new Error(`Route "${route}" not found in canonical Phase 11 baseline. Available: ${data.routes.map(x => x.route).join(', ')}`)
  }
  return r
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('=== CANONICAL PHASE 11 BASELINES LOADED SUCCESSFULLY ===')
  console.log(`Source File: ${CANONICAL_P11_FILE}`)
  const data = getCanonicalBaselineData()
  for (const r of data.routes) {
    console.log(`${r.route.padEnd(18)} | Mobile Median: ${String(r.mobile.median.perf).padStart(3)} | Desktop Median: ${String(r.desktop.median.perf).padStart(3)} | A11y: ${r.mobile.median.a11y}`)
  }
}
