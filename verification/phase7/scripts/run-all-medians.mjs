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

function computeMedian(runs) {
  const sorted = [...runs].sort((a, b) => a.perf - b.perf)
  const median = sorted[1] // For N=3, index 1 is median
  const minPerf = sorted[0].perf
  const maxPerf = sorted[2].perf
  const spread = maxPerf - minPerf
  return {
    median,
    allRuns: runs,
    spread,
    minPerf,
    maxPerf
  }
}

async function main() {
  console.log('========================================================================')
  console.log('PHASE 7 STEP 0: FULL-SITE MEDIAN CONSISTENCY MATRIX (ALL 9 ROUTES, N=3)')
  console.log('Single continuous session on live production server on port 3000')
  console.log('========================================================================\n')

  const results = []
  const allSpreads = []

  for (const route of routes) {
    const url = `http://localhost:3000${route.path}`
    console.log(`\n-------------------------------------------------------------`)
    console.log(`AUDITING ROUTE: ${route.name.toUpperCase()} (${url})`)
    console.log(`-------------------------------------------------------------`)

    // 1. Mobile 3-run audit
    console.log(`\n>> Mobile (3 runs):`)
    const mobileRuns = []
    for (let r = 1; r <= 3; r++) {
      const outFile = path.join(outDir, `${route.name}-mobile-run${r}.json`)
      const res = runLighthouse(url, outFile, false)
      mobileRuns.push(res)
      console.log(`   Run ${r}: Perf=${res.perf}, LCP=${res.lcp}ms, TBT=${res.tbt}ms, A11y=${res.a11y}, BP=${res.bp}, SEO=${res.seo}`)
      execSync('sleep 2')
    }
    const mobileStats = computeMedian(mobileRuns)
    allSpreads.push(mobileStats.spread)
    console.log(`   => Mobile Median: Perf=${mobileStats.median.perf} (Spread: ${mobileStats.spread} pts, [${mobileStats.minPerf}-${mobileStats.maxPerf}])`)

    // 2. Desktop 3-run audit
    console.log(`\n>> Desktop (3 runs):`)
    const desktopRuns = []
    for (let r = 1; r <= 3; r++) {
      const outFile = path.join(outDir, `${route.name}-desktop-run${r}.json`)
      const res = runLighthouse(url, outFile, true)
      desktopRuns.push(res)
      console.log(`   Run ${r}: Perf=${res.perf}, LCP=${res.lcp}ms, TBT=${res.tbt}ms, A11y=${res.a11y}, BP=${res.bp}, SEO=${res.seo}`)
      execSync('sleep 2')
    }
    const desktopStats = computeMedian(desktopRuns)
    allSpreads.push(desktopStats.spread)
    console.log(`   => Desktop Median: Perf=${desktopStats.median.perf} (Spread: ${desktopStats.spread} pts, [${desktopStats.minPerf}-${desktopStats.maxPerf}])`)

    results.push({
      route: route.name,
      path: route.path,
      mobile: mobileStats,
      desktop: desktopStats,
      mobileTargetMet: mobileStats.median.perf >= 90,
      desktopTargetMet: desktopStats.median.perf >= 95
    })
  }

  // Compute empirical noise threshold from observed spreads
  const avgSpread = allSpreads.reduce((sum, s) => sum + s, 0) / allSpreads.length
  // Typical noise threshold is roughly half the max observed spread or average spread (~±3 points)
  const recommendedThreshold = Math.max(3, Math.round(avgSpread / 2))
  console.log(`\n========================================================================`)
  console.log(`EMPIRICAL VARIANCE ANALYSIS:`)
  console.log(`Average 3-Run Spread: ${avgSpread.toFixed(2)} points`)
  console.log(`Empirical Noise Threshold: ±${recommendedThreshold} points`)
  console.log(`========================================================================\n`)

  // Baseline comparisons
  const phase5File = path.resolve(__dirname, '../../phase5/lighthouse/final-summary.json')
  const phase5Summary = fs.existsSync(phase5File) ? JSON.parse(fs.readFileSync(phase5File, 'utf8')) : []
  const phase5Map = new Map(phase5Summary.map(item => [item.route, item]))

  const phase5MedianFile = path.resolve(__dirname, '../../phase5/lighthouse/step1-median-summary.json')
  const phase5Medians = fs.existsSync(phase5MedianFile) ? JSON.parse(fs.readFileSync(phase5MedianFile, 'utf8')) : {}

  const finalOutput = {
    methodology: {
      runsPerPlatform: 3,
      selectionCriterion: 'median by performance score',
      averageSpread: parseFloat(avgSpread.toFixed(2)),
      noiseThreshold: recommendedThreshold,
      noiseThresholdRationale: `Empirically derived from the average 3-run spread (${avgSpread.toFixed(2)} pts). Differences within ±${recommendedThreshold} points are within normal run-to-run variance on 4x throttled mobile emulation.`
    },
    routes: results.map(r => {
      const p5Final = phase5Map.get(r.route)
      const p5MedianObj = phase5Medians[r.route]

      // Baseline mobile: if 3-run median exists in P5, use it; else use P5 final-summary single run
      const p5MobileBaseline = p5MedianObj ? p5MedianObj.medianPerf : p5Final?.mobile?.perf ?? 0
      const p5MobileSource = p5MedianObj ? '3-run median (step1-median-summary.json)' : 'single run (final-summary.json)'
      const p5DesktopBaseline = p5Final?.desktop?.perf ?? 0

      const mobileDelta = r.mobile.median.perf - p5MobileBaseline
      const desktopDelta = r.desktop.median.perf - p5DesktopBaseline

      const determineStatus = (delta, score, target) => {
        if (score >= target) return 'TARGET MET'
        if (delta > recommendedThreshold) return 'IMPROVED'
        if (delta < -recommendedThreshold) return 'REGRESSED'
        return 'UNCHANGED (within noise)'
      }

      const mobileStatus = determineStatus(mobileDelta, r.mobile.median.perf, 90)
      const desktopStatus = determineStatus(desktopDelta, r.desktop.median.perf, 95)

      return {
        route: r.route,
        path: r.path,
        mobile: {
          median: r.mobile.median,
          spread: r.mobile.spread,
          minPerf: r.mobile.minPerf,
          maxPerf: r.mobile.maxPerf,
          runs: r.mobile.allRuns.map((run, idx) => ({ run: idx + 1, perf: run.perf, lcp: run.lcp, tbt: run.tbt, cls: run.cls }))
        },
        desktop: {
          median: r.desktop.median,
          spread: r.desktop.spread,
          minPerf: r.desktop.minPerf,
          maxPerf: r.desktop.maxPerf,
          runs: r.desktop.allRuns.map((run, idx) => ({ run: idx + 1, perf: run.perf, lcp: run.lcp, tbt: run.tbt, cls: run.cls }))
        },
        comparisonVsPhase5: {
          mobile: {
            phase5Baseline: p5MobileBaseline,
            phase5Source: p5MobileSource,
            phase7Median: r.mobile.median.perf,
            delta: mobileDelta,
            status: mobileStatus
          },
          desktop: {
            phase5Baseline: p5DesktopBaseline,
            phase5Source: 'single run (final-summary.json)',
            phase7Median: r.desktop.median.perf,
            delta: desktopDelta,
            status: desktopStatus
          }
        }
      }
    })
  }

  const finalSummaryFile = path.join(outDir, 'final-summary-median.json')
  fs.writeFileSync(finalSummaryFile, JSON.stringify(finalOutput, null, 2))
  console.log(`Successfully saved ${finalSummaryFile}!`)
}

main().catch(console.error)
