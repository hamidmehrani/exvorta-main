const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const getArg = (prefix) => {
  const arg = args.find((a) => a.startsWith(prefix));
  return arg ? arg.split('=')[1] : null;
};

const BASE_URL = process.env.BASE_URL || getArg('--base') || 'http://localhost:3000';
const OUT_DIR = process.env.OUT_DIR || getArg('--outDir') || path.join(__dirname, '../verification/phase3/screenshots');
const specificRoute = getArg('--route');
const specificName = getArg('--name');
const specificSelector = getArg('--selector');

const defaultRoutes = [
  { path: '/', name: 'home' },
  { path: '/portfolio', name: 'portfolio' },
  { path: '/portfolio/nutave', name: 'nutave' },
  { path: '/ecosystem', name: 'ecosystem' },
  { path: '/insights', name: 'insights' },
  { path: '/contact', name: 'contact' },
  { path: '/rfq', name: 'rfq' },
  { path: '/waitlist', name: 'waitlist' },
  { path: '/legal', name: 'legal' },
  { path: '/web', name: 'web' },
];

async function run() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log(`Launching browser with Playwright...`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  const routesToRun = specificRoute
    ? [{ path: specificRoute, name: specificName || specificRoute.replace(/\//g, '_') || 'page' }]
    : defaultRoutes;

  for (const route of routesToRun) {
    const url = route.path.startsWith('http') ? route.path : `${BASE_URL}${route.path}`;
    const filename = `${route.name}.png`;
    const outPath = path.join(OUT_DIR, filename);

    console.log(`Taking screenshot: ${url} -> ${filename}`);
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Auto-scroll to trigger reveal animations and image loading
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 150;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight - window.innerHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 80);
        });
        window.scrollTo(0, 0);
      });

      await page.waitForTimeout(1000);

      // Hide overlays like cookie consent for clean screenshot
      await page.evaluate(() => {
        const overlays = document.querySelectorAll(
          'nextjs-portal, #__next-build-watcher, [id*="cookie"], [class*="cookie"], aside[aria-label="Cookie consent"]'
        );
        overlays.forEach((el) => {
          el.style.display = 'none';
        });
      });

      await page.waitForTimeout(500);

      if (specificSelector) {
        const locator = page.locator(specificSelector).first();
        if (await locator.count() > 0) {
          await locator.scrollIntoViewIfNeeded();
          await page.waitForTimeout(1200);
          await locator.screenshot({ path: outPath });
          console.log(`  [OK] Saved element screenshot: ${filename} (selector: ${specificSelector})`);
        } else {
          console.warn(`Selector "${specificSelector}" not found, falling back to full page screenshot.`);
          await page.screenshot({ path: outPath, fullPage: true });
          console.log(`  [OK] Saved fullPage fallback: ${filename}`);
        }
      } else {
        await page.screenshot({ path: outPath, fullPage: true });
        console.log(`  [OK] Saved fullPage: ${filename}`);
      }
    } catch (e) {
      console.error(`  [ERROR] Failed to screenshot ${url}:`, e.message);
    }
  }

  await browser.close();
  console.log('Screenshots completed.');
}

run().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
