import { execSync, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import http from 'http'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../lighthouse/interleaved')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

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

function runLighthouse(url, outFile) {
  const cmd = `npx -y lighthouse "${url}" --output json --output-path "${outFile}" --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu" --max-wait-for-load=60000 --only-categories=performance,accessibility,best-practices,seo --quiet`
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

async function startServer() {
  const serverProc = spawn('pnpm', ['start', '-p', '3000'], {
    stdio: 'ignore',
    env: { ...process.env, PATH: `${nodePath}:${process.env.PATH}` },
    detached: true
  })
  await waitForServer('http://localhost:3000/api/health')
  return serverProc
}

function stopServer(serverProc) {
  try {
    process.kill(-serverProc.pid, 'SIGTERM')
  } catch (e) {
    try { serverProc.kill() } catch (e2) {}
  }
  execSync('fuser -k 3000/tcp 2>/dev/null || true')
  // Sleep 1s to ensure socket release
  execSync('sleep 1')
}

function setBuild(type) {
  console.log(`Setting build to .next-${type}...`)
  execSync(`rm -rf .next && cp -r .next-${type} .next`)
}

function computeStats(runs, metric) {
  const values = runs.map(r => r[metric]).sort((a, b) => a - b)
  const min = values[0]
  const max = values[values.length - 1]
  const median = values[Math.floor(values.length / 2)]
  const q1 = values[Math.floor(values.length / 4)]
  const q3 = values[Math.floor((3 * values.length) / 4)]
  const iqr = q3 - q1
  const spread = max - min
  return { min, max, median, q1, q3, iqr, spread, sortedValues: values }
}

async function runInterleavedBenchmark() {
  const totalRounds = 7
  const staticRuns = []
  const dynamicRuns = []

  console.log(`=== Starting ${totalRounds}-Run Interleaved Benchmark (Static vs Dynamic Turnstile) ===\n`)

  for (let round = 1; round <= totalRounds; round++) {
    console.log(`\n========================================`)
    console.log(`ROUND ${round}/${totalRounds}`)
    console.log(`========================================`)

    // 1. Static Condition
    console.log(`\n[Round ${round}] 1/2: Testing STATIC condition...`)
    setBuild('static')
    const staticServer = await startServer()
    const staticOutFile = path.join(outDir, `rfq-static-run${round}.json`)
    const staticMetrics = runLighthouse('http://localhost:3000/rfq', staticOutFile)
    staticRuns.push({ round, condition: 'static', ...staticMetrics })
    stopServer(staticServer)
    console.log(`[Round ${round} Static] Perf=${staticMetrics.perf} | LCP=${staticMetrics.lcp}ms | TBT=${staticMetrics.tbt}ms | CLS=${staticMetrics.cls}`)

    // 2. Dynamic Condition
    console.log(`\n[Round ${round}] 2/2: Testing DYNAMIC condition...`)
    setBuild('dynamic')
    const dynamicServer = await startServer()
    const dynamicOutFile = path.join(outDir, `rfq-dynamic-run${round}.json`)
    const dynamicMetrics = runLighthouse('http://localhost:3000/rfq', dynamicOutFile)
    dynamicRuns.push({ round, condition: 'dynamic', ...dynamicMetrics })
    stopServer(dynamicServer)
    console.log(`[Round ${round} Dynamic] Perf=${dynamicMetrics.perf} | LCP=${dynamicMetrics.lcp}ms | TBT=${dynamicMetrics.tbt}ms | CLS=${dynamicMetrics.cls}`)
  }

  // Statistical evaluation
  const staticStats = {
    perf: computeStats(staticRuns, 'perf'),
    tbt: computeStats(staticRuns, 'tbt'),
    lcp: computeStats(staticRuns, 'lcp'),
    cls: computeStats(staticRuns, 'cls')
  }

  const dynamicStats = {
    perf: computeStats(dynamicRuns, 'perf'),
    tbt: computeStats(dynamicRuns, 'tbt'),
    lcp: computeStats(dynamicRuns, 'lcp'),
    cls: computeStats(dynamicRuns, 'cls')
  }

  // Compute pooled noise threshold from interquartile ranges and spreads
  const pooledPerfIQR = (staticStats.perf.iqr + dynamicStats.perf.iqr) / 2
  const pooledPerfSpread = (staticStats.perf.spread + dynamicStats.perf.spread) / 2
  const noiseThreshold = Math.max(pooledPerfIQR, 5) // at least IQR or 5

  const deltaPerf = dynamicStats.perf.median - staticStats.perf.median
  const deltaTbt = dynamicStats.tbt.median - staticStats.tbt.median
  const deltaLcp = dynamicStats.lcp.median - staticStats.lcp.median

  let verdict = ''
  if (Math.abs(deltaPerf) <= noiseThreshold) {
    verdict = `INDISTINGUISHABLE_FROM_NOISE: Composite perf delta (${deltaPerf > 0 ? '+' : ''}${deltaPerf}) is within data-derived noise threshold (±${noiseThreshold.toFixed(1)}). TBT changed by ${deltaTbt}ms, LCP changed by ${deltaLcp}ms.`
  } else if (deltaPerf > noiseThreshold) {
    verdict = `SIGNIFICANT_IMPROVEMENT: Composite perf improved by +${deltaPerf} exceeding noise threshold (±${noiseThreshold.toFixed(1)}).`
  } else {
    verdict = `REGRESSION: Composite perf regressed by ${deltaPerf} exceeding noise threshold (±${noiseThreshold.toFixed(1)}).`
  }

  const summary = {
    benchmarkName: 'Interleaved 7-Run Pilot Benchmark: Static vs Dynamic Turnstile',
    timestamp: new Date().toISOString(),
    totalRounds,
    noiseThreshold: {
      derivedValue: noiseThreshold,
      staticPerfSpread: staticStats.perf.spread,
      dynamicPerfSpread: dynamicStats.perf.spread,
      staticPerfIQR: staticStats.perf.iqr,
      dynamicPerfIQR: dynamicStats.perf.iqr,
      derivationFormula: 'max(mean(static_iqr, dynamic_iqr), 5)'
    },
    static: {
      runs: staticRuns,
      stats: staticStats
    },
    dynamic: {
      runs: dynamicRuns,
      stats: dynamicStats
    },
    comparison: {
      deltaPerf,
      deltaTbt,
      deltaLcp,
      verdict
    }
  }

  const summaryPath = path.resolve(__dirname, '../lighthouse/interleaved-pilot-summary.json')
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))

  console.log('\n========================================')
  console.log('INTERLEAVED BENCHMARK COMPLETE')
  console.log('========================================')
  console.log('STATIC  Perf Runs:   ', staticRuns.map(r => r.perf))
  console.log(`STATIC  Median Perf:  ${staticStats.perf.median} (Min: ${staticStats.perf.min}, Max: ${staticStats.perf.max}, Spread: ${staticStats.perf.spread}, IQR: ${staticStats.perf.iqr})`)
  console.log(`STATIC  Median TBT:   ${staticStats.tbt.median}ms`)
  console.log(`STATIC  Median LCP:   ${staticStats.lcp.median}ms`)
  console.log('----------------------------------------')
  console.log('DYNAMIC Perf Runs:   ', dynamicRuns.map(r => r.perf))
  console.log(`DYNAMIC Median Perf: ${dynamicStats.perf.median} (Min: ${dynamicStats.perf.min}, Max: ${dynamicStats.perf.max}, Spread: ${dynamicStats.perf.spread}, IQR: ${dynamicStats.perf.iqr})`)
  console.log(`DYNAMIC Median TBT:  ${dynamicStats.tbt.median}ms`)
  console.log(`DYNAMIC Median LCP:  ${dynamicStats.lcp.median}ms`)
  console.log('----------------------------------------')
  console.log(`Delta Perf: ${deltaPerf > 0 ? '+' : ''}${deltaPerf}`)
  console.log(`Delta TBT:  ${deltaTbt > 0 ? '+' : ''}${deltaTbt}ms`)
  console.log(`Delta LCP:  ${deltaLcp > 0 ? '+' : ''}${deltaLcp}ms`)
  console.log(`Data-Derived Noise Threshold: ±${noiseThreshold.toFixed(1)}`)
  console.log(`VERDICT: ${verdict}`)
  console.log(`Summary written to: ${summaryPath}`)
}

runInterleavedBenchmark().catch(err => {
  console.error('Interleaved benchmark failed:', err)
  process.exit(1)
})
