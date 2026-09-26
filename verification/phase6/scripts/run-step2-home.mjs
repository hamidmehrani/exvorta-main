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
    subparts: lcpBreakdown.items || [],
    metrics
  }
}

async function main() {
  console.log('=== Step 2: Home (Hero LCP) 3-Run Mobile Benchmark ===')
  const runs = []
  for (let i = 1; i <= 3; i++) {
    console.log(`Run ${i}/3...`)
    const outFile = path.join(outDir, `home-p6-run${i}.json`)
    const res = runLighthouse('http://localhost:3000/', outFile)
    runs.push(res)
    console.log(`  Run ${i}: Perf=${res.perf}, LCP=${res.lcp}ms, TBT=${res.tbt}ms, FCP=${res.fcp}ms`)
    execSync('sleep 2')
  }

  runs.sort((a, b) => a.perf - b.perf)
  const median = runs[1]
  console.log(`\nMedian Run: Perf=${median.perf}, LCP=${median.lcp}ms, TBT=${median.tbt}ms`)

  const summary = {
    route: '/',
    phase5Baseline: {
      perf: 62,
      lcp: 7672,
      tbt: 364,
      fcp: 1510,
      elementRenderDelay: 1238.9
    },
    runs: runs.map((r, idx) => ({ run: idx + 1, perf: r.perf, lcp: r.lcp, tbt: r.tbt, fcp: r.fcp })),
    phase6Median: {
      perf: median.perf,
      a11y: median.a11y,
      bp: median.bp,
      seo: median.seo,
      lcp: median.lcp,
      tbt: median.tbt,
      fcp: median.fcp,
      cls: median.cls,
      lcpSnippet: median.lcpSnippet,
      subparts: median.subparts
    },
    delta: {
      perfDiff: median.perf - 62,
      lcpDiffMs: median.lcp - 7672,
      tbtDiffMs: median.tbt - 364
    }
  }

  fs.writeFileSync(path.join(diagDir, 'step2-hero-lcp.json'), JSON.stringify(summary, null, 2))
  console.log('\nSaved step2-hero-lcp.json successfully!')
  console.log(JSON.stringify(summary, null, 2))
}

main().catch(console.error)
