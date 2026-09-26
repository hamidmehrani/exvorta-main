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
    consoleErrors: errors.map(e => ({ description: e.description, url: e.url }))
  }
}

async function benchmarkRoute(name, pathname) {
  console.log(`\n=== Auditing ${pathname} (3 mobile runs) ===`)
  const runs = []
  for (let i = 1; i <= 3; i++) {
    const outFile = path.join(outDir, `${name}-p6-run${i}.json`)
    const res = runLighthouse(`http://localhost:3000${pathname}`, outFile)
    runs.push(res)
    console.log(`  Run ${i}: Perf=${res.perf}, BP=${res.bp}, TBT=${res.tbt}ms, LCP=${res.lcp}ms, ConsoleErrors=${res.consoleErrorsCount}`)
    execSync('sleep 2')
  }
  runs.sort((a, b) => a.perf - b.perf)
  return {
    runs,
    median: runs[1]
  }
}

async function main() {
  console.log('=== Step 1: Ecosystem & RFQ Regression Verification ===')
  const ecoResults = await benchmarkRoute('ecosystem', '/ecosystem')
  const rfqResults = await benchmarkRoute('rfq', '/rfq')

  const summary = {
    ecosystem: {
      phase5Baseline: { perf: 43, bp: 96, consoleErrors: 1 },
      runs: ecoResults.runs.map((r, i) => ({ run: i + 1, perf: r.perf, bp: r.bp, tbt: r.tbt, lcp: r.lcp, consoleErrors: r.consoleErrorsCount })),
      phase6Median: ecoResults.median,
      delta: {
        perfDiff: ecoResults.median.perf - 43,
        bpDiff: ecoResults.median.bp - 96,
        consoleErrorsDiff: ecoResults.median.consoleErrorsCount - 1,
        resolved: ecoResults.median.bp === 100 && ecoResults.median.consoleErrorsCount === 0
      }
    },
    rfq: {
      phase5Baseline: { perf: 43, bp: 100, tbt: 1775 },
      runs: rfqResults.runs.map((r, i) => ({ run: i + 1, perf: r.perf, bp: r.bp, tbt: r.tbt, lcp: r.lcp, consoleErrors: r.consoleErrorsCount })),
      phase6Median: rfqResults.median,
      delta: {
        perfDiff: rfqResults.median.perf - 43,
        tbtDiff: rfqResults.median.tbt - 1775
      }
    }
  }

  fs.writeFileSync(path.join(diagDir, 'step1-regressions-resolved.json'), JSON.stringify(summary, null, 2))
  console.log('\nSaved step1-regressions-resolved.json successfully!')
  console.log(JSON.stringify(summary, null, 2))
}

main().catch(console.error)
