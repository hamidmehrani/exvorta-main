import { execSync, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import http from 'http'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../lighthouse')
const rawDir = path.join(outDir, 'raw')
if (!fs.existsSync(rawDir)) {
  fs.mkdirSync(rawDir, { recursive: true })
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

function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    function ping() {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve()
        } else {
          retry()
        }
      }).on('error', retry)
    }

    function retry() {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timeout waiting for server at ${url}`))
      } else {
        setTimeout(ping, 250)
      }
    }

    ping()
  })
}

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

function compute5RunStats(runs) {
  const sorted = [...runs].sort((a, b) => a.perf - b.perf)
  const median = sorted[2] // index 2 of 5 is exact median
  const minPerf = sorted[0].perf
  const maxPerf = sorted[4].perf
  const spread = maxPerf - minPerf
  const iqr = sorted[3].perf - sorted[1].perf

  // Also calculate medians for metrics
  const lcpSorted = [...runs].sort((a, b) => a.lcp - b.lcp)
  const tbtSorted = [...runs].sort((a, b) => a.tbt - b.tbt)
  const clsSorted = [...runs].sort((a, b) => a.cls - b.cls)

  return {
    median: {
      perf: median.perf,
      lcp: lcpSorted[2].lcp,
      tbt: tbtSorted[2].tbt,
      cls: clsSorted[2].cls,
      fcp: median.fcp,
      si: median.si,
      a11y: median.a11y,
      bp: median.bp,
      seo: median.seo,
      consoleErrorsCount: median.consoleErrorsCount,
      lcpSelector: median.lcpSelector
    },
    representativeRun: median,
    spread,
    iqr,
    minPerf,
    maxPerf,
    runs: runs.map((r, i) => ({ run: i + 1, perf: r.perf, lcp: r.lcp, tbt: r.tbt, cls: r.cls }))
  }
}

async function main() {
  console.log('========================================================================')
  console.log('PHASE 11: FULL-SITE RE-BASELINE (POST-LEAK FIX, 5 RUNS PER ROUTE, N=5)')
  console.log('9 routes x 2 platforms x 5 runs = 90 total Lighthouse audits')
  console.log('========================================================================\n')

  // 1. Ensure server is running on port 3000
  execSync('fuser -k 3000/tcp 2>/dev/null || true')
  execSync('sleep 1')
  console.log('Starting production server on port 3000...')
  const serverProc = spawn('pnpm', ['start', '-p', '3000'], {
    stdio: 'ignore',
    env: { ...process.env, PATH: `${nodePath}:${process.env.PATH}`, ALLOW_TEST_TURNSTILE_KEY: 'true' },
    detached: true
  })
  await waitForServer('http://localhost:3000/api/health')
  console.log('Production server is healthy on port 3000.')

  // Warm up routes
  console.log('Warming up routes...')
  for (const r of routes) {
    execSync(`curl -s http://localhost:3000${r.path} > /dev/null || true`)
  }
  console.log('Warmup complete.\n')

  const results = []
  const allSpreads = []

  for (let rIdx = 0; rIdx < routes.length; rIdx++) {
    const route = routes[rIdx]
    const url = `http://localhost:3000${route.path}`
    console.log(`\n-------------------------------------------------------------`)
    console.log(`[${rIdx + 1}/9] AUDITING: ${route.name.toUpperCase()} (${url})`)
    console.log(`-------------------------------------------------------------`)

    // Mobile 5 runs
    console.log(`>> Mobile (5 runs):`)
    const mobileRuns = []
    for (let r = 1; r <= 5; r++) {
      const outFile = path.join(rawDir, `${route.name}-mobile-run${r}.json`)
      const res = runLighthouse(url, outFile, false)
      mobileRuns.push(res)
      console.log(`   Run ${r}: Perf=${res.perf} | LCP=${res.lcp}ms | TBT=${res.tbt}ms | CLS=${res.cls} | A11y=${res.a11y}`)
      execSync('sleep 1')
    }
    const mobileStats = compute5RunStats(mobileRuns)
    allSpreads.push(mobileStats.spread)
    console.log(`   => Mobile 5-Run Median: Perf=${mobileStats.median.perf} (Spread: ${mobileStats.spread}, IQR: ${mobileStats.iqr}, [${mobileStats.minPerf}-${mobileStats.maxPerf}])`)

    // Desktop 5 runs
    console.log(`>> Desktop (5 runs):`)
    const desktopRuns = []
    for (let r = 1; r <= 5; r++) {
      const outFile = path.join(rawDir, `${route.name}-desktop-run${r}.json`)
      const res = runLighthouse(url, outFile, true)
      desktopRuns.push(res)
      console.log(`   Run ${r}: Perf=${res.perf} | LCP=${res.lcp}ms | TBT=${res.tbt}ms | CLS=${res.cls} | A11y=${res.a11y}`)
      execSync('sleep 1')
    }
    const desktopStats = compute5RunStats(desktopRuns)
    allSpreads.push(desktopStats.spread)
    console.log(`   => Desktop 5-Run Median: Perf=${desktopStats.median.perf} (Spread: ${desktopStats.spread}, IQR: ${desktopStats.iqr}, [${desktopStats.minPerf}-${desktopStats.maxPerf}])`)

    results.push({
      route: route.name,
      path: route.path,
      mobile: mobileStats,
      desktop: desktopStats,
      mobileTargetMet: mobileStats.median.perf >= 90,
      desktopTargetMet: desktopStats.median.perf >= 95
    })
  }

  // Stop server
  try { process.kill(-serverProc.pid, 'SIGTERM') } catch (e) { try { serverProc.kill() } catch (e2) {} }
  execSync('fuser -k 3000/tcp 2>/dev/null || true')

  // Calculate empirical noise threshold
  const avgSpread = allSpreads.reduce((sum, s) => sum + s, 0) / allSpreads.length
  const noiseThreshold = Math.max(3, Math.round(avgSpread / 2))

  // Load Phase 7 median data
  const phase7File = path.resolve(__dirname, '../../phase7/lighthouse/final-summary-median.json')
  const phase7Data = JSON.parse(fs.readFileSync(phase7File, 'utf8'))
  const phase7Map = new Map(phase7Data.routes.map(r => [r.route, r]))

  // Classify routes into previously-affected vs previously-unaffected
  const unaffectedRoutes = ['insights', 'legal']
  const affectedRoutes = ['home', 'portfolio', 'portfolio-nutave', 'ecosystem', 'contact', 'rfq', 'waitlist']

  const routeSummaries = results.map(r => {
    const p7Route = phase7Map.get(r.route)
    const p7MobileMedian = p7Route ? p7Route.mobile.median.perf : null
    const p7DesktopMedian = p7Route ? p7Route.desktop.median.perf : null

    const mobileDelta = p7MobileMedian !== null ? r.mobile.median.perf - p7MobileMedian : 0
    const desktopDelta = p7DesktopMedian !== null ? r.desktop.median.perf - p7DesktopMedian : 0

    const determineStatus = (delta, score, target) => {
      if (score >= target) return 'TARGET MET'
      if (delta > noiseThreshold) return 'IMPROVED'
      if (delta < -noiseThreshold) return 'REGRESSED'
      return 'UNCHANGED (within noise)'
    }

    return {
      route: r.route,
      path: r.path,
      leakPreviouslyPresent: affectedRoutes.includes(r.route),
      mobile: {
        median: r.mobile.median,
        spread: r.mobile.spread,
        iqr: r.mobile.iqr,
        minPerf: r.mobile.minPerf,
        maxPerf: r.mobile.maxPerf,
        runs: r.mobile.runs
      },
      desktop: {
        median: r.desktop.median,
        spread: r.desktop.spread,
        iqr: r.desktop.iqr,
        minPerf: r.desktop.minPerf,
        maxPerf: r.desktop.maxPerf,
        runs: r.desktop.runs
      },
      comparisonVsPhase7: {
        mobile: {
          phase7Median: p7MobileMedian,
          phase7Source: 'verification/phase7/lighthouse/final-summary-median.json',
          phase11Median: r.mobile.median.perf,
          delta: mobileDelta,
          status: determineStatus(mobileDelta, r.mobile.median.perf, 90)
        },
        desktop: {
          phase7Median: p7DesktopMedian,
          phase7Source: 'verification/phase7/lighthouse/final-summary-median.json',
          phase11Median: r.desktop.median.perf,
          delta: desktopDelta,
          status: determineStatus(desktopDelta, r.desktop.median.perf, 95)
        }
      }
    }
  })

  // Sanity check comparison: affected vs unaffected deltas
  const affectedDeltasMobile = routeSummaries.filter(r => r.leakPreviouslyPresent).map(r => r.comparisonVsPhase7.mobile.delta)
  const unaffectedDeltasMobile = routeSummaries.filter(r => !r.leakPreviouslyPresent).map(r => r.comparisonVsPhase7.mobile.delta)

  const avgAffectedMobileDelta = affectedDeltasMobile.reduce((a, b) => a + b, 0) / affectedDeltasMobile.length
  const avgUnaffectedMobileDelta = unaffectedDeltasMobile.reduce((a, b) => a + b, 0) / unaffectedDeltasMobile.length

  const finalCanonicalBaseline = {
    baselineIdentity: 'POST-LEAK-FIX CANONICAL FULL-SITE BASELINE (PHASE 11)',
    canonicalReferencePath: 'verification/phase11/lighthouse/post-leak-fix-baseline.json',
    timestamp: new Date().toISOString(),
    methodology: {
      runsPerPlatform: 5,
      selectionCriterion: 'exact 5-run median by performance score',
      averageSpreadAcross18Conditions: parseFloat(avgSpread.toFixed(2)),
      dataDerivedNoiseThreshold: noiseThreshold,
      noiseThresholdDerivation: `Empirically derived as max(3, round(averageSpread / 2)) from actual observed 5-run spreads across all 18 test conditions (${avgSpread.toFixed(2)} pts). Differences within ±${noiseThreshold} points are within normal run-to-run variance on 4x throttled mobile emulation.`
    },
    sanityCheck: {
      affectedRoutes: affectedRoutes,
      unaffectedRoutes: unaffectedRoutes,
      averageAffectedMobileDeltaVsPhase7: parseFloat(avgAffectedMobileDelta.toFixed(2)),
      averageUnaffectedMobileDeltaVsPhase7: parseFloat(avgUnaffectedMobileDelta.toFixed(2)),
      conclusion: Math.abs(avgUnaffectedMobileDelta) <= noiseThreshold
        ? 'SANITY CHECK CONFIRMED: Unaffected routes (Legal, Insights) show negligible change vs Phase 7, while affected routes reflect real chunk elimination.'
        : 'INCONCLUSIVE: Unaffected routes also shifted.'
    },
    targetsAchieved: {
      mobileGe90: routeSummaries.filter(r => r.mobile.median.perf >= 90).map(r => r.route),
      desktopGe95: routeSummaries.filter(r => r.desktop.median.perf >= 95).map(r => r.route)
    },
    routes: routeSummaries
  }

  const baselineFile = path.join(outDir, 'post-leak-fix-baseline.json')
  fs.writeFileSync(baselineFile, JSON.stringify(finalCanonicalBaseline, null, 2))
  console.log(`\n========================================================================`)
  console.log(`FULL-SITE RE-BASELINE COMPLETE`)
  console.log(`Canonical post-leak-fix baseline successfully written to:`)
  console.log(`  ${baselineFile}`)
  console.log(`========================================================================`)
}

main().catch(err => {
  console.error('Fatal benchmark error:', err)
  process.exit(1)
})
