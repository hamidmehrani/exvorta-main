const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3003';
const OUT_DIR = path.join(__dirname, '../screenshots/qa');

const ROUTES = [
  { path: '', name: 'home' },
  { path: '/portfolio', name: 'portfolio' },
  { path: '/portfolio/nutave', name: 'nutave' },
  { path: '/ecosystem', name: 'ecosystem' },
  { path: '/insights', name: 'insights' },
  { path: '/rfq', name: 'rfq' },
  { path: '/waitlist', name: 'waitlist' }
];

const BREAKPOINTS = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' }
];

async function run() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log(`Launching browser with Playwright...`);
  const browser = await chromium.launch({ headless: true });

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    console.log(`Testing ${url}...`);

    for (const bp of BREAKPOINTS) {
      const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
      const filename = `${route.name}-${bp.name}.png`;
      const outPath = path.join(OUT_DIR, filename);

      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(2000);

        // Hide overlays
        await page.evaluate(() => {
          const overlays = document.querySelectorAll('nextjs-portal, #__next-build-watcher');
          overlays.forEach(el => el.style.display = 'none');
        });

        await page.screenshot({ path: outPath, fullPage: true });
        console.log(`  [OK] Saved ${filename}`);

        // Test mobile menu on mobile breakpoint
        if (bp.name === 'mobile') {
          const menuBtn = await page.$('button[aria-label*="menu"], .hamburger, [class*="menu-btn"]');
          if (menuBtn) {
            await menuBtn.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: path.join(OUT_DIR, `${route.name}-mobile-menu.png`) });
            console.log(`  [OK] Saved ${route.name}-mobile-menu.png`);
          } else {
             // Maybe it's an SVG or something without a good aria-label
             // Try to click an svg in header
             const headerSvg = await page.$('header svg');
             if (headerSvg) {
                try {
                  await headerSvg.click();
                  await page.waitForTimeout(1000);
                  await page.screenshot({ path: path.join(OUT_DIR, `${route.name}-mobile-menu.png`) });
                  console.log(`  [OK] Saved ${route.name}-mobile-menu.png (clicked svg)`);
                } catch(e) {}
             }
          }
        }
      } catch (e) {
        console.error(`  [ERROR] Failed to screenshot ${url} at ${bp.name}:`, e.message);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  console.log('All QA screenshots completed.');
}

run().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
