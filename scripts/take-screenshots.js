/**
 * Full-page screenshots of every public route, desktop + mobile, for visual
 * review against `Exvorta designs/*` (screen.png is the acceptance test).
 *
 *   pnpm build && pnpm start -p 3100           # or: pnpm dev (port 3100)
 *   node scripts/take-screenshots.js            # all routes, both viewports
 *   node scripts/take-screenshots.js /rfq       # only routes containing "/rfq"
 *
 * Env: BASE_URL (default http://localhost:3100), OUT_DIR (default ./screenshots),
 *      CHROMIUM_PATH (optional explicit browser binary, e.g. /opt/pw-browsers/chromium).
 *
 * Notes
 * - Scrolling uses real wheel events: Lenis smooths programmatic scrollTo, which
 *   would leave scroll-reveal sections invisible in the capture.
 * - The consent cookie is pre-set so the cookie banner never covers the page.
 * - Playwright uses the Chromium that ships with the environment
 *   (PLAYWRIGHT_BROWSERS_PATH) — never run `playwright install`.
 */
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3100'
const OUT_DIR = process.env.OUT_DIR || path.join(__dirname, '../screenshots')

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/web', name: 'web' },
  { path: '/portfolio', name: 'portfolio' },
  { path: '/portfolio/nutave', name: 'nutave' },
  { path: '/portfolio/spicevo', name: 'spicevo' },
  { path: '/portfolio/stonvi', name: 'stonvi' },
  { path: '/ecosystem', name: 'ecosystem' },
  { path: '/rfq', name: 'rfq' },
  { path: '/waitlist', name: 'waitlist' },
  { path: '/contact', name: 'contact' },
  { path: '/login', name: 'login' },
  { path: '/legal', name: 'legal' },
]

const VIEWPORTS = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'mobile', width: 390, height: 844 },
]

async function revealEverything(page) {
  let height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height + 900; y += 450) {
    await page.mouse.wheel(0, 450)
    await page.waitForTimeout(260)
    height = await page.evaluate(() => document.documentElement.scrollHeight)
  }
  await page.waitForTimeout(800)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(1200)
}

async function run() {
  const filter = process.argv.slice(2)
  const routes = filter.length ? ROUTES.filter((r) => filter.some((f) => r.path.includes(f))) : ROUTES

  fs.mkdirSync(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined })

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    await context.addCookies([{ name: 'exv_consent', value: 'declined', url: BASE_URL }])
    const page = await context.newPage()

    for (const route of routes) {
      const url = `${BASE_URL}${route.path}`
      const out = path.join(OUT_DIR, `${vp.label}-${route.name}.png`)
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 120000 })
        await page.waitForTimeout(1500)
        await revealEverything(page)
        await page.screenshot({ path: out, fullPage: true })
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        console.log(`[OK] ${vp.label.padEnd(7)} ${route.path.padEnd(20)} ${overflow > 0 ? `⚠ horizontal overflow ${overflow}px` : ''}`)
      } catch (e) {
        console.error(`[ERROR] ${vp.label} ${url}: ${e.message}`)
      }
    }
    await context.close()
  }

  await browser.close()
  console.log(`Screenshots written to ${OUT_DIR}`)
}

run().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
