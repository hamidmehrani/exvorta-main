import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const axePath = path.resolve(__dirname, 'axe.min.js')
const axeSource = fs.readFileSync(axePath, 'utf8')

const routes = [
  { name: 'home', path: '/' },
  { name: 'portfolio', path: '/portfolio' },
  { name: 'portfolio-nutave', path: '/portfolio/nutave' },
  { name: 'ecosystem', path: '/ecosystem' },
  { name: 'insights', path: '/insights' },
  { name: 'contact', path: '/contact' },
  { name: 'rfq', path: '/rfq' },
  { name: 'waitlist', path: '/waitlist' },
  { name: 'legal', path: '/legal' },
]

const outDir = path.resolve(__dirname, '../axe')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

console.log('Starting automated axe-core accessibility audit across 9 routes...\n')

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  })

  const results = []

  for (const route of routes) {
    const url = `http://localhost:3000${route.path}`
    const outFile = path.join(outDir, `${route.name}.json`)
    console.log(`Auditing ${route.name} (${url})...`)

    const page = await browser.newPage()
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 })
      await page.waitForTimeout(1000)

      await page.evaluate(axeSource)
      const axeResults = await page.evaluate(async () => {
        return await window.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
          }
        })
      })

      fs.writeFileSync(outFile, JSON.stringify(axeResults, null, 2))

      const violationCount = axeResults.violations.length
      const passesCount = axeResults.passes.length
      const incompleteCount = axeResults.incomplete.length

      results.push({
        route: route.name,
        path: route.path,
        violations: violationCount,
        passes: passesCount,
        incomplete: incompleteCount,
        violationSummary: axeResults.violations.map(v => `${v.id} (${v.nodes.length} nodes)`).join(', ') || 'None'
      })

      console.log(`Done ${route.name}: Violations=${violationCount}, Passes=${passesCount}, Incomplete=${incompleteCount}`)
      if (violationCount > 0) {
        console.log(`  Violations in ${route.name}:`)
        axeResults.violations.forEach(v => {
          console.log(`   - [${v.impact}] ${v.id}: ${v.help} (${v.helpUrl})`)
          v.nodes.forEach(n => console.log(`       Target: ${n.target.join(' ')}`))
        })
      }
    } catch (err) {
      console.error(`Error auditing ${route.name}:`, err.message)
      results.push({
        route: route.name,
        path: route.path,
        violations: 'ERROR',
        passes: 0,
        incomplete: 0,
        violationSummary: err.message
      })
    } finally {
      await page.close()
    }
  }

  await browser.close()

  console.log('\n--- AXE-CORE AUDIT SUMMARY ---')
  console.table(results)

  const summaryFile = path.join(outDir, 'summary.json')
  fs.writeFileSync(summaryFile, JSON.stringify(results, null, 2))
  console.log(`Saved axe-core summary to ${summaryFile}`)
}

run().catch(console.error)
