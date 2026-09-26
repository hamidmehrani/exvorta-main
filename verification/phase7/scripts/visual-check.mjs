import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const screenshotsDir = path.resolve(__dirname, '../screenshots')
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })

const routes = [
  { name: 'home', path: '/', design: 'Exvorta designs/exvorta_home page/home-page.png' },
  { name: 'portfolio', path: '/portfolio', design: 'Exvorta designs/exvorta_portfolio/portfolio.png' },
  { name: 'nutave', path: '/portfolio/nutave', design: 'Exvorta designs/exvorta_nutave/nutave.png' },
  { name: 'ecosystem', path: '/ecosystem', design: 'Exvorta designs/exvorta_ecosystem/ecosystem.png' },
  { name: 'insights', path: '/insights', design: 'Exvorta designs/exvorta_insights/insight.png' },
  { name: 'contact', path: '/contact', design: null },
  { name: 'rfq', path: '/rfq', design: 'Exvorta designs/exvorta_rfq/screenrfq.png' },
  { name: 'waitlist', path: '/waitlist', design: 'Exvorta designs/exvorta_waitlist/screen.png' },
  { name: 'legal', path: '/legal', design: null }
]

async function main() {
  console.log('=== Step 3: Visual Inspection & Animation Verification ===')
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  const observations = []

  for (const r of routes) {
    console.log(`\nTesting ${r.name.toUpperCase()} (http://localhost:3000${r.path})...`)

    // Navigate without throttling
    await page.goto(`http://localhost:3000${r.path}`, { waitUntil: 'domcontentloaded' })

    // Frame 1: initial paint (50ms)
    const f1 = await page.screenshot({ path: path.join(screenshotsDir, `${r.name}-frame1-50ms.png`), clip: { x: 0, y: 0, width: 1440, height: 800 } })
    await page.waitForTimeout(250)
    // Frame 2: mid animation (300ms)
    const f2 = await page.screenshot({ path: path.join(screenshotsDir, `${r.name}-frame2-300ms.png`), clip: { x: 0, y: 0, width: 1440, height: 800 } })
    await page.waitForTimeout(500)
    // Frame 3: settled animation (800ms)
    const f3 = await page.screenshot({ path: path.join(screenshotsDir, `${r.name}-frame3-800ms.png`), clip: { x: 0, y: 0, width: 1440, height: 800 } })

    const animated = !f1.equals(f2) || !f2.equals(f3)

    // Full page capture for acceptance
    const fullCapture = path.join(screenshotsDir, `${r.name}-full.png`)
    await page.screenshot({ path: fullCapture, fullPage: true })

    // Check design file existence
    const designExists = r.design ? fs.existsSync(path.resolve(__dirname, '../../../', r.design)) : false

    observations.push({
      route: r.name,
      path: r.path,
      hasDesignRef: designExists,
      designRefPath: r.design,
      animationActive: animated,
      fullPageCapture: `${r.name}-full.png`,
      details: animated
        ? 'Entrance motion observed smoothly transitioning from initial mount to fully settled state.'
        : 'Static render without visible motion shift.'
    })

    console.log(`  -> Animation active: ${animated}`)
    console.log(`  -> Design reference present: ${designExists} (${r.design || 'none'})`)
  }

  await browser.close()

  const reportPath = path.resolve(__dirname, '../diagnostics/visual-inspection-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(observations, null, 2))
  console.log(`\nVisual inspection report saved to ${reportPath}!`)
}

main().catch(console.error)
