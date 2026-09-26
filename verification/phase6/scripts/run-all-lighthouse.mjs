import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../lighthouse')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const routes = [
  { name: 'home', path: '/' },
  { name: 'portfolio', path: '/portfolio' },
  { name: 'portfolio-nutave', path: '/portfolio/nutave' },
  { name: 'ecosystem', path: '/ecosystem' },
  { name: 'insights', path: '/insights' },
  { name: 'contact', path: '/contact' },
  { name: 'rfq', path: '/rfq' },
  { name: 'waitlist', path: '/waitlist' },
  { name: 'legal', path: '/legal' }
]

const nodePath = '/home/hamid/.nvm/versions/node/v20.20.2/bin'

function runLighthouse(url, outFile, isDesktop) {
  const flags = isDesktop ? '--preset=desktop' : ''
  const cmd = `npx -y lighthouse "${url}" ${flags} --output json --output-path "${outFile}" --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu" --max-wait-for-load=60000 --only-categories=performance,accessibility,best-practices,seo --quiet`
  execSync(cmd, {
    stdio: 'inherit',
    env: { ...process.env, PATH: `${nodePath}:${process.env.PATH}` }
  })
  const lh = JSON.parse(fs.readFileSync(outFile, 'utf8'))
  const lcpElement = lh.audits?.['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node
  const consoleAudit = lh.audits?.['errors-in-console'] || {}
  const errors = consoleAudit.details?.items || []

  return {
    perf: Math.round((lh.categories.performance?.score || 0) * 100),
    a11y: Math.round((lh.categories.accessibility?.score || 0) * 100),
    bp: Math.round((lh.categories['best-practices']?.score || 0) * 100),
    seo: Math.round((lh.categories.seo?.score || 0) * 100),
    lcp: Math.round(lh.audits?.['largest-contentful-paint']?.numericValue || 0),
    tbt: Math.round(lh.audits?.['total-blocking-time']?.numericValue || 0),
    cls: parseFloat((lh.audits?.['cumulative-layout-shift']?.numericValue || 0).toFixed(3)),
    fcp: Math.round(lh.audits?.['first-contentful-paint']?.numericValue || 0),
    si: Math.round(lh.audits?.['speed-index']?.numericValue || 0),
    consoleErrorsCount: errors.length,
    lcpSelector: lcpElement?.selector || 'N/A'
  }
}

async function main() {
  console.log('===============================================================')
  console.log('PHASE 6 STEP 3: FULL-SITE FINAL CONSISTENCY MATRIX (ALL 9 ROUTES)')
  console.log('Single continuous session on live production server on port 3000')
  console.log('===============================================================\n')

  const phase5File = path.resolve(__dirname, '../../phase5/lighthouse/final-summary.json')
  const phase5Summary = fs.existsSync(phase5File) ? JSON.parse(fs.readFileSync(phase5File, 'utf8')) : []
  const phase5Map = new Map(phase5Summary.map(item => [item.route, item]))

  const fullResults = []

  for (const route of routes) {
    const url = `http://localhost:3000${route.path}`

    // 1. Mobile Audit
    console.log(`[MOBILE] Auditing ${route.name} (${url})...`)
    const mobileOut = path.join(outDir, `${route.name}.json`)
    let mobileData
    try {
      mobileData = runLighthouse(url, mobileOut, false)
      console.log(`  -> Mobile: Perf ${mobileData.perf}, A11y ${mobileData.a11y}, BP ${mobileData.bp}, SEO ${mobileData.seo}, LCP ${mobileData.lcp}ms, TBT ${mobileData.tbt}ms, CLS ${mobileData.cls}`)
    } catch (err) {
      console.error(`  -> Failed mobile audit on ${route.name}:`, err.message)
      mobileData = { perf: 0, a11y: 0, bp: 0, seo: 0, lcp: 0, tbt: 0, cls: 0, fcp: 0, si: 0, consoleErrorsCount: -1, lcpSelector: 'ERROR' }
    }
    execSync('sleep 2')

    // 2. Desktop Audit
    console.log(`[DESKTOP] Auditing ${route.name} (${url})...`)
    const desktopOut = path.join(outDir, `${route.name}-desktop.json`)
    let desktopData
    try {
      desktopData = runLighthouse(url, desktopOut, true)
      console.log(`  -> Desktop: Perf ${desktopData.perf}, A11y ${desktopData.a11y}, BP ${desktopData.bp}, SEO ${desktopData.seo}, LCP ${desktopData.lcp}ms, TBT ${desktopData.tbt}ms, CLS ${desktopData.cls}`)
    } catch (err) {
      console.error(`  -> Failed desktop audit on ${route.name}:`, err.message)
      desktopData = { perf: 0, a11y: 0, bp: 0, seo: 0, lcp: 0, tbt: 0, cls: 0, fcp: 0, si: 0, consoleErrorsCount: -1, lcpSelector: 'ERROR' }
    }
    execSync('sleep 2')

    const p5 = phase5Map.get(route.name)
    const p5MobilePerf = p5?.mobile?.perf ?? 0
    const p5DesktopPerf = p5?.desktop?.perf ?? 0

    const mobileDelta = mobileData.perf - p5MobilePerf
    const desktopDelta = desktopData.perf - p5DesktopPerf

    const mobileStatus = mobileData.perf >= 90
      ? 'TARGET MET'
      : (mobileDelta > 0 ? 'IMPROVED' : (mobileDelta < 0 ? 'REGRESSED' : 'UNCHANGED'))

    const desktopStatus = desktopData.perf >= 95
      ? 'TARGET MET'
      : (desktopDelta > 0 ? 'IMPROVED' : (desktopDelta < 0 ? 'REGRESSED' : 'UNCHANGED'))

    fullResults.push({
      route: route.name,
      path: route.path,
      mobile: mobileData,
      desktop: desktopData,
      mobileTargetMet: mobileData.perf >= 90,
      desktopTargetMet: desktopData.perf >= 95,
      comparisonVsPhase5: {
        mobilePerf: { phase5: p5MobilePerf, phase6: mobileData.perf, delta: mobileDelta, status: mobileStatus },
        desktopPerf: { phase5: p5DesktopPerf, phase6: desktopData.perf, delta: desktopDelta, status: desktopStatus }
      }
    })
  }

  const finalSummaryFile = path.join(outDir, 'final-summary.json')
  fs.writeFileSync(finalSummaryFile, JSON.stringify(fullResults, null, 2))

  console.log('\n===============================================================')
  console.log('PHASE 6 FINAL SUMMARY MATRIX vs PHASE 5')
  console.log('===============================================================')
  console.log('Route | Mobile (P5->P6) [Status] | Desktop (P5->P6) [Status] | Mobile A11y/BP/SEO | Desktop A11y/BP/SEO')
  for (const r of fullResults) {
    const m = r.comparisonVsPhase5.mobilePerf
    const d = r.comparisonVsPhase5.desktopPerf
    console.log(`${r.route.padEnd(16)} | M: ${m.phase5}->${m.phase6} (${m.delta >= 0 ? '+' : ''}${m.delta}) [${m.status}] | D: ${d.phase5}->${d.phase6} (${d.delta >= 0 ? '+' : ''}${d.delta}) [${d.status}] | M:${r.mobile.a11y}/${r.mobile.bp}/${r.mobile.seo} | D:${r.desktop.a11y}/${r.desktop.bp}/${r.desktop.seo}`)
  }
}

main().catch(console.error)
