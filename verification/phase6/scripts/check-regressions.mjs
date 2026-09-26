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

const targets = [
  { name: 'ecosystem', path: '/ecosystem' },
  { name: 'rfq', path: '/rfq' }
]

const RUNS = 3
const nodePath = '/home/hamid/.nvm/versions/node/v20.20.2/bin'

function getMedian(arr) {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

console.log('Testing Ecosystem and RFQ mobile (3 runs each)...\n')

const summary = {}

for (const target of targets) {
  const url = `http://localhost:3000${target.path}`
  const runs = []

  for (let i = 1; i <= RUNS; i++) {
    const filename = `${target.name}-check-run${i}.json`
    const outFile = path.join(outDir, filename)
    console.log(`[Run ${i}/${RUNS}] ${target.name} (${url}) -> ${filename}...`)

    try {
      execSync(
        `npx -y lighthouse "${url}" --output json --output-path "${outFile}" --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu" --max-wait-for-load=60000 --only-categories=performance,accessibility,best-practices,seo --quiet`,
        { stdio: 'inherit', env: { ...process.env, PATH: `${nodePath}:${process.env.PATH}` } }
      )
      const lh = JSON.parse(fs.readFileSync(outFile, 'utf8'))
      const res = {
        run: i,
        perf: Math.round((lh.categories.performance?.score || 0) * 100),
        a11y: Math.round((lh.categories.accessibility?.score || 0) * 100),
        bp: Math.round((lh.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((lh.categories.seo?.score || 0) * 100),
        lcp: Math.round(lh.audits?.['largest-contentful-paint']?.numericValue || 0),
        tbt: Math.round(lh.audits?.['total-blocking-time']?.numericValue || 0),
        errorsInConsole: lh.audits?.['errors-in-console']?.details?.items || []
      }
      runs.push(res)
      console.log(`  Run ${i}: Perf ${res.perf}, BP ${res.bp}, LCP ${res.lcp}ms, TBT ${res.tbt}ms, ConsoleErrors: ${res.errorsInConsole.length}\n`)
      execSync('sleep 2')
    } catch (err) {
      console.error(`  Error in run ${i}:`, err.message)
      execSync('sleep 2')
    }
  }

  summary[target.name] = {
    runs,
    medianPerf: getMedian(runs.map(r => r.perf)),
    medianBp: getMedian(runs.map(r => r.bp)),
    medianLcp: getMedian(runs.map(r => r.lcp)),
    medianTbt: getMedian(runs.map(r => r.tbt)),
    allConsoleErrors: runs.flatMap(r => r.errorsInConsole)
  }
}

const summaryFile = path.join(outDir, 'regressions-check-summary.json')
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2))
console.log('\n=== REGRESSIONS CHECK SUMMARY ===')
console.table(Object.entries(summary).map(([name, d]) => ({
  route: name,
  runsPerf: d.runs.map(r => r.perf).join(', '),
  medianPerf: d.medianPerf,
  runsBP: d.runs.map(r => r.bp).join(', '),
  medianBP: d.medianBp,
  medianLCP: `${d.medianLcp}ms`,
  medianTBT: `${d.medianTbt}ms`,
  totalErrors: d.allConsoleErrors.length
})))
