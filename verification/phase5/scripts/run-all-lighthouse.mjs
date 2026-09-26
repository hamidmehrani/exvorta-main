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
    lcpSelector: lcpElement?.selector || 'N/A'
  }
}

async function main() {
  console.log('===============================================================')
  console.log('PHASE 5 STEP 4: FULL-SITE FINAL CONSISTENCY PASS (ALL 9 ROUTES)')
  console.log('Single continuous session on live production server on port 3000')
  console.log('===============================================================\n')

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
      mobileData = { perf: 0, a11y: 0, bp: 0, seo: 0, lcp: 0, tbt: 0, cls: 0, fcp: 0, si: 0, lcpSelector: 'ERROR' }
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
      desktopData = { perf: 0, a11y: 0, bp: 0, seo: 0, lcp: 0, tbt: 0, cls: 0, fcp: 0, si: 0, lcpSelector: 'ERROR' }
    }
    execSync('sleep 2')

    fullResults.push({
      route: route.name,
      path: route.path,
      mobile: mobileData,
      desktop: desktopData,
      mobileTargetMet: mobileData.perf >= 90,
      desktopTargetMet: desktopData.perf >= 95
    })
  }

  const finalSummaryFile = path.join(outDir, 'final-summary.json')
  fs.writeFileSync(finalSummaryFile, JSON.stringify(fullResults, null, 2))

  console.log('\n================ FINAL LIGHTHOUSE MATRIX ================')
  console.table(fullResults.map(r => ({
    route: r.route,
    'M Perf': r.mobile.perf,
    'D Perf': r.desktop.perf,
    'M LCP': `${r.mobile.lcp}ms`,
    'D LCP': `${r.desktop.lcp}ms`,
    'M TBT': `${r.mobile.tbt}ms`,
    'M CLS': r.mobile.cls,
    'A11y': `${r.mobile.a11y}/${r.desktop.a11y}`,
    'BP': `${r.mobile.bp}/${r.desktop.bp}`,
    'SEO': `${r.mobile.seo}/${r.desktop.seo}`,
    'M Target (>=90)': r.mobileTargetMet ? 'MET' : 'MISSED',
    'D Target (>=95)': r.desktopTargetMet ? 'MET' : 'MISSED'
  })))

  console.log(`\nResults written to: ${finalSummaryFile}`)
}

main().catch(err => {
  console.error('Fatal error in audit script:', err)
  process.exit(1)
})
