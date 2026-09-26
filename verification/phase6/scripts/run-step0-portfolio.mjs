import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../lighthouse')
const diagDir = path.resolve(__dirname, '../diagnostics')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
if (!fs.existsSync(diagDir)) fs.mkdirSync(diagDir, { recursive: true })

const nodePath = '/home/hamid/.nvm/versions/node/v20.20.2/bin'

function runLighthouse(url, outFile) {
  const cmd = `npx -y lighthouse "${url}" --output json --output-path "${outFile}" --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu" --max-wait-for-load=60000 --only-categories=performance,accessibility,best-practices,seo --quiet`
  execSync(cmd, {
    stdio: 'inherit',
    env: { ...process.env, PATH: `${nodePath}:${process.env.PATH}` }
  })
  const lh = JSON.parse(fs.readFileSync(outFile, 'utf8'))
  const lcpElement = lh.audits?.['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node
  const lazyAudit = lh.audits?.['prioritize-lcp-image'] || {}
  const lcpBreakdown = lh.audits?.['lcp-breakdown-insight']?.details?.items?.[0] || {}
  const metrics = lh.audits?.['metrics']?.details?.items?.[0] || {}

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
    lcpSelector: lcpElement?.selector || 'N/A',
    lcpSnippet: lcpElement?.snippet || 'N/A',
    lazyScore: lazyAudit.score,
    lazySavings: lazyAudit.details?.overallSavingsMs || 0,
    lcpBreakdown,
    metrics
  }
}

async function main() {
  console.log('=== Step 0: Portfolio 3-Run Mobile Benchmark ===')
  const runs = []
  for (let i = 1; i <= 3; i++) {
    console.log(`Run ${i}/3...`)
    const outFile = path.join(outDir, `portfolio-p6-run${i}.json`)
    const res = runLighthouse('http://localhost:3000/portfolio', outFile)
    runs.push(res)
    console.log(`  Run ${i}: Perf=${res.perf}, LCP=${res.lcp}ms, TBT=${res.tbt}ms, LazyScore=${res.lazyScore}, LazySavings=${res.lazySavings}ms`)
    execSync('sleep 2')
  }

  // Pick median by perf score
  runs.sort((a, b) => a.perf - b.perf)
  const median = runs[1]
  console.log(`\nMedian Run: Perf=${median.perf}, LCP=${median.lcp}ms, TBT=${median.tbt}ms, LazyScore=${median.lazyScore}`)

  // Baseline comparison
  const baseline = JSON.parse(fs.readFileSync(path.join(diagDir, 'step0-portfolio-phase5-baseline.json'), 'utf8'))

  const summary = {
    baseline: {
      perfScore: baseline.perfScore,
      lcpMs: baseline.lcpMs,
      tbtMs: baseline.tbtMs,
      lcpLoadStart: baseline.metrics.lcpLoadStart,
      timeToFirstByte: baseline.metrics.timeToFirstByte,
      lazyLoadedAuditScore: baseline.lazyLoadedAuditScore,
      lazyLoadedSavingsLcp: baseline.lazyLoadedSavingsLcp,
      lcpElementSnippet: baseline.lcpElementSnippet
    },
    runs: runs.map((r, idx) => ({ run: idx + 1, perf: r.perf, lcp: r.lcp, tbt: r.tbt, lazyScore: r.lazyScore })),
    phase6Median: {
      perfScore: median.perf,
      lcpMs: median.lcp,
      tbtMs: median.tbt,
      fcpMs: median.fcp,
      cls: median.cls,
      lcpLoadStart: median.metrics.lcpLoadStart,
      timeToFirstByte: median.metrics.timeToFirstByte,
      lazyLoadedAuditScore: median.lazyScore,
      lazyLoadedSavingsLcp: median.lazySavings,
      lcpElementSnippet: median.lcpSnippet,
      lcpBreakdownSubparts: median.lcpBreakdown.subparts || []
    },
    delta: {
      perfDiff: median.perf - baseline.perfScore,
      lcpDiffMs: median.lcp - baseline.lcpMs,
      lazyAuditResolved: median.lazyScore === 1
    }
  }

  fs.writeFileSync(path.join(diagDir, 'step0-portfolio-resolved.json'), JSON.stringify(summary, null, 2))
  console.log('\nSaved step0-portfolio-resolved.json successfully!')
  console.log(JSON.stringify(summary, null, 2))
}

main().catch(console.error)
