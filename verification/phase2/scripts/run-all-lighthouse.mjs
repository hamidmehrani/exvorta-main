import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isDesktop = process.argv.includes('--desktop')
const suffix = isDesktop ? '-desktop' : ''

const routes = [
  { name: `home${suffix}`, path: '/' },
  { name: `portfolio${suffix}`, path: '/portfolio' },
  { name: `portfolio-nutave${suffix}`, path: '/portfolio/nutave' },
  { name: `ecosystem${suffix}`, path: '/ecosystem' },
  { name: `insights${suffix}`, path: '/insights' },
  { name: `contact${suffix}`, path: '/contact' },
  { name: `rfq${suffix}`, path: '/rfq' },
  { name: `waitlist${suffix}`, path: '/waitlist' },
  { name: `legal${suffix}`, path: '/legal' },
]

const outDir = path.resolve(__dirname, '../lighthouse')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

console.log(`Starting Lighthouse Audits (${isDesktop ? 'DESKTOP' : 'MOBILE'})...\n`)

const results = []

for (const route of routes) {
  const url = `http://localhost:3000${route.path}`
  const outFile = path.join(outDir, `${route.name}.json`)
  console.log(`Auditing ${route.name} (${url}) -> ${outFile}...`)
  try {
    const desktopFlag = isDesktop ? '--preset=desktop' : ''
    execSync(
      `npx -y lighthouse "${url}" ${desktopFlag} --output json --output-path "${outFile}" --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --quiet`,
      { stdio: 'inherit' }
    )
    const lh = JSON.parse(fs.readFileSync(outFile, 'utf8'))
    const scores = {
      route: route.name,
      path: route.path,
      perf: Math.round((lh.categories.performance?.score || 0) * 100),
      a11y: Math.round((lh.categories.accessibility?.score || 0) * 100),
      bp: Math.round((lh.categories['best-practices']?.score || 0) * 100),
      seo: Math.round((lh.categories.seo?.score || 0) * 100),
    }
    results.push(scores)
    console.log(
      `Done ${route.name}: Perf ${scores.perf}, A11y ${scores.a11y}, BP ${scores.bp}, SEO ${scores.seo}\n`
    )
    execSync('sleep 2')
  } catch (err) {
    console.error(`Error auditing ${route.name}:`, err)
    execSync('sleep 2')
  }
}

console.log('\n--- ALL AUDIT RESULTS ---')
console.table(results)

const summaryFile = path.join(outDir, isDesktop ? 'summary-desktop.json' : 'summary.json')
fs.writeFileSync(summaryFile, JSON.stringify(results, null, 2))
console.log(`Saved summary to ${summaryFile}`)
