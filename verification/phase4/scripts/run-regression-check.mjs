import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../lighthouse/regression-check')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const targets = [
  { name: 'home', path: '/' },
  { name: 'portfolio', path: '/portfolio' }
]

const RUNS = 3

function getMedian(arr) {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

console.log('Starting 3-run Lighthouse Mobile Regression Check...\n')

const summary = {}

for (const target of targets) {
  const url = `http://localhost:3000${target.path}`
  const targetResults = []

  for (let i = 1; i <= RUNS; i++) {
    const filename = `${target.name}-run${i}.json`
    const outFile = path.join(outDir, filename)
    console.log(`[Run ${i}/${RUNS}] Auditing ${target.name} (${url}) -> ${outFile}...`)

    try {
      execSync(
        `npx -y lighthouse "${url}" --output json --output-path "${outFile}" --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --quiet`,
        { stdio: 'inherit', env: { ...process.env, PATH: `/home/hamid/.nvm/versions/node/v20.20.2/bin:${process.env.PATH}` } }
      )
      const lh = JSON.parse(fs.readFileSync(outFile, 'utf8'))
      const res = {
        run: i,
        perf: Math.round((lh.categories.performance?.score || 0) * 100),
        a11y: Math.round((lh.categories.accessibility?.score || 0) * 100),
        bp: Math.round((lh.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((lh.categories.seo?.score || 0) * 100),
        tbt: Math.round(lh.audits?.['total-blocking-time']?.numericValue || 0),
        fcp: Math.round(lh.audits?.['first-contentful-paint']?.numericValue || 0),
        lcp: Math.round(lh.audits?.['largest-contentful-paint']?.numericValue || 0),
        si: Math.round(lh.audits?.['speed-index']?.numericValue || 0),
      }
      targetResults.push(res)
      console.log(`  Run ${i} result: Perf ${res.perf}, TBT ${res.tbt}ms, LCP ${res.lcp}ms, SI ${res.si}ms\n`)
      execSync('sleep 2')
    } catch (err) {
      console.error(`  Error in run ${i} for ${target.name}:`, err.message)
      execSync('sleep 2')
    }
  }

  summary[target.name] = {
    runs: targetResults,
    medianPerf: getMedian(targetResults.map(r => r.perf)),
    medianTbt: getMedian(targetResults.map(r => r.tbt)),
    medianFcp: getMedian(targetResults.map(r => r.fcp)),
    medianLcp: getMedian(targetResults.map(r => r.lcp)),
    medianSi: getMedian(targetResults.map(r => r.si)),
    medianA11y: getMedian(targetResults.map(r => r.a11y)),
    medianBp: getMedian(targetResults.map(r => r.bp)),
    medianSeo: getMedian(targetResults.map(r => r.seo)),
  }
}

const summaryFile = path.join(outDir, 'median-summary.json')
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2))

console.log('\n================ REGRESSION CHECK SUMMARY (MEDIANS) ================')
console.table(Object.entries(summary).map(([name, data]) => ({
  route: name,
  runs: data.runs.map(r => r.perf).join(', '),
  medianPerf: data.medianPerf,
  medianTBT: `${data.medianTbt} ms`,
  medianLCP: `${data.medianLcp} ms`,
  medianSI: `${data.medianSi} ms`,
  medianA11y: data.medianA11y,
  medianBP: data.medianBp,
  medianSEO: data.medianSeo
})))
console.log(`Saved summary to ${summaryFile}`)
