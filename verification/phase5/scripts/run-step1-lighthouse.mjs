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
  { name: 'home', path: '/' },
  { name: 'portfolio', path: '/portfolio' },
  { name: 'portfolio-nutave', path: '/portfolio/nutave' }
]

const RUNS = 3

function getMedian(arr) {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

console.log('Starting Phase 5 Step 1 Mobile Lighthouse Audits (3 runs each)...\n')

const summary = {}

for (const target of targets) {
  const url = `http://localhost:3000${target.path}`
  const targetResults = []

  for (let i = 1; i <= RUNS; i++) {
    const filename = `${target.name}-run${i}.json`
    const outFile = path.join(outDir, filename)
    console.log(`[Run ${i}/${RUNS}] Auditing ${target.name} (${url}) -> ${filename}...`)

    try {
      execSync(
        `npx -y lighthouse "${url}" --output json --output-path "${outFile}" --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu" --max-wait-for-load=60000 --only-categories=performance,accessibility,best-practices,seo --quiet`,
        { stdio: 'inherit', env: { ...process.env, PATH: `/home/hamid/.nvm/versions/node/v20.20.2/bin:${process.env.PATH}` } }
      )
      const lh = JSON.parse(fs.readFileSync(outFile, 'utf8'))
      const lcpElement = lh.audits?.['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node
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
        lcpElementSelector: lcpElement?.selector || 'N/A',
        lcpElementSnippet: lcpElement?.snippet?.substring(0, 100) || 'N/A'
      }
      targetResults.push(res)
      console.log(`  Run ${i}: Perf ${res.perf}, LCP ${res.lcp}ms, TBT ${res.tbt}ms, SI ${res.si}ms (LCP: ${res.lcpElementSelector})\n`)
      execSync('sleep 2')
    } catch (err) {
      console.error(`  Error in run ${i} for ${target.name}:`, err.message)
      execSync('sleep 2')
    }
  }

  summary[target.name] = {
    runs: targetResults,
    medianPerf: getMedian(targetResults.map(r => r.perf)),
    medianLcp: getMedian(targetResults.map(r => r.lcp)),
    medianTbt: getMedian(targetResults.map(r => r.tbt)),
    medianFcp: getMedian(targetResults.map(r => r.fcp)),
    medianSi: getMedian(targetResults.map(r => r.si)),
    medianA11y: getMedian(targetResults.map(r => r.a11y)),
    medianBp: getMedian(targetResults.map(r => r.bp)),
    medianSeo: getMedian(targetResults.map(r => r.seo)),
    sampleLcpSelector: targetResults[0]?.lcpElementSelector || 'N/A'
  }
}

const summaryFile = path.join(outDir, 'step1-median-summary.json')
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2))

console.log('\n================ PHASE 5 STEP 1 SUMMARY ================')
console.table(Object.entries(summary).map(([name, data]) => ({
  route: name,
  runsPerf: data.runs.map(r => r.perf).join(', '),
  medianPerf: data.medianPerf,
  medianLCP: `${data.medianLcp} ms`,
  medianTBT: `${data.medianTbt} ms`,
  medianA11y: data.medianA11y,
  medianBP: data.medianBp,
  medianSEO: data.medianSeo,
  lcpSelector: data.sampleLcpSelector.substring(0, 40)
})))
console.log(`Saved summary to ${summaryFile}`)
