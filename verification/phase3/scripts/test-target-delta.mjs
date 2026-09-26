import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const routes = [
  { name: 'home-after', path: '/' },
  { name: 'ecosystem-after', path: '/ecosystem' },
  { name: 'rfq-after', path: '/rfq' },
  { name: 'portfolio-after', path: '/portfolio' },
]

const outDir = path.resolve(__dirname, '../diagnostics')
const results = []

for (const route of routes) {
  const url = `http://localhost:3000${route.path}`
  const outFile = path.join(outDir, `${route.name}.json`)
  console.log(`Auditing ${route.name} (${url})...`)
  try {
    execSync(
      `npx -y lighthouse "${url}" --output json --output-path "${outFile}" --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --quiet`,
      { stdio: 'inherit', env: { ...process.env, PATH: `/home/hamid/.nvm/versions/node/v20.20.2/bin:${process.env.PATH}` } }
    )
    const lh = JSON.parse(fs.readFileSync(outFile, 'utf8'))
    const scores = {
      route: route.name,
      path: route.path,
      perf: Math.round((lh.categories.performance?.score || 0) * 100),
      tbt: lh.audits?.['total-blocking-time']?.displayValue,
      tbtMs: Math.round(lh.audits?.['total-blocking-time']?.numericValue || 0),
      bootup: lh.audits?.['bootup-time']?.displayValue,
      a11y: Math.round((lh.categories.accessibility?.score || 0) * 100),
      bp: Math.round((lh.categories['best-practices']?.score || 0) * 100),
      seo: Math.round((lh.categories.seo?.score || 0) * 100),
    }
    results.push(scores)
    console.log(`Done ${route.name}: Perf ${scores.perf}, TBT ${scores.tbt}, A11y ${scores.a11y}`)
  } catch (err) {
    console.error(`Error auditing ${route.name}:`, err.message)
  }
}

console.log('\n--- TARGET ROUTES DELTA RESULTS ---')
console.table(results)

const deltaFile = path.join(outDir, 'delta-summary.json')
fs.writeFileSync(deltaFile, JSON.stringify(results, null, 2))
