/**
 * CANONICAL BASELINE SOURCE OF TRUTH (PHASE 8 TOOLING)
 * 
 * In strict compliance with Rule 6:
 * Reads ONLY the canonical Phase 5 final output file:
 * `verification/phase5/lighthouse/final-summary.json`.
 * Never falls back to step files, intermediate diagnostic files, or recalled values.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CANONICAL_P5_FILE = path.resolve(__dirname, '../../phase5/lighthouse/final-summary.json')

if (!fs.existsSync(CANONICAL_P5_FILE)) {
  throw new Error(`Canonical Phase 5 baseline file not found at: ${CANONICAL_P5_FILE}`)
}

const rawP5Data = JSON.parse(fs.readFileSync(CANONICAL_P5_FILE, 'utf8'))

export const CANONICAL_BASELINES = Object.freeze(
  rawP5Data.reduce((acc, routeObj) => {
    acc[routeObj.route] = {
      route: routeObj.route,
      path: routeObj.path,
      canonicalFile: 'verification/phase5/lighthouse/final-summary.json',
      mobile: {
        perf: routeObj.mobile.perf,
        lcp: routeObj.mobile.lcp,
        tbt: routeObj.mobile.tbt,
        cls: routeObj.mobile.cls,
        fcp: routeObj.mobile.fcp,
        si: routeObj.mobile.si,
        a11y: routeObj.mobile.a11y,
        bp: routeObj.mobile.bp,
        seo: routeObj.mobile.seo,
        lcpSelector: routeObj.mobile.lcpSelector
      },
      desktop: {
        perf: routeObj.desktop.perf,
        lcp: routeObj.desktop.lcp,
        tbt: routeObj.desktop.tbt,
        cls: routeObj.desktop.cls,
        fcp: routeObj.desktop.fcp,
        si: routeObj.desktop.si,
        a11y: routeObj.desktop.a11y,
        bp: routeObj.desktop.bp,
        seo: routeObj.desktop.seo,
        lcpSelector: routeObj.desktop.lcpSelector
      }
    }
    return acc
  }, {})
)

export function getCanonicalBaseline(route) {
  const baseline = CANONICAL_BASELINES[route]
  if (!baseline) {
    throw new Error(`Route "${route}" not found in canonical Phase 5 baseline. Available: ${Object.keys(CANONICAL_BASELINES).join(', ')}`)
  }
  return baseline
}

// Self-test when executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('=== CANONICAL PHASE 5 BASELINES LOADED SUCCESSFULLY ===')
  console.log(`Source File: ${CANONICAL_P5_FILE}`)
  for (const [route, b] of Object.entries(CANONICAL_BASELINES)) {
    console.log(`${route.padEnd(18)} | Mobile: ${String(b.mobile.perf).padStart(3)} | Desktop: ${String(b.desktop.perf).padStart(3)} | A11y: ${b.mobile.a11y} | BP: ${b.mobile.bp} | SEO: ${b.mobile.seo}`)
  }
}
