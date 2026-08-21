const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3002';
const OUT_DIR = path.join(__dirname, '../screenshots');

// Allow running a single route for testing
const isTestMode = process.argv.includes('--test');

const LOCALES = isTestMode ? ['en'] : ['en', 'ar', 'fa'];

const ROUTES = isTestMode 
  ? [
      { path: '/ecosystem', name: 'ecosystem' },
      { path: '/portfolio/nutave', name: 'nutave' },
      { path: '/portfolio/spicevo', name: 'spicevo' },
      { path: '/portfolio/stonvi', name: 'stonvi' }
    ]
  : [
      { path: '', name: 'home' },
      { path: '/test-blocks', name: 'test-blocks' },
      { path: '/login', name: 'login' },
      { path: '/portfolio', name: 'portfolio' },
      { path: '/portfolio/nutave', name: 'nutave' },
      { path: '/waitlist', name: 'waitlist' }
    ];

async function run() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log(`Launching browser with Playwright...`);
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  for (const loc of LOCALES) {
    for (const route of ROUTES) {
      const url = `${BASE_URL}/${loc}${route.path}`;
      const filename = `${loc}-${route.name}.png`;
      const outPath = path.join(OUT_DIR, filename);

      console.log(`Taking screenshot: ${url} -> ${filename}`);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        
        await page.waitForTimeout(3000);

        // Auto-scroll to trigger lazy loading
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight - window.innerHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 100);
          });
          window.scrollTo(0, 0);
        });

        await page.waitForTimeout(1000);

        // Hide common overlays like Cookie Consent and Next.js dev widget
        await page.evaluate(() => {
          const overlays = document.querySelectorAll('nextjs-portal, #__next-build-watcher, [id*="cookie"], [class*="cookie"], [id*="banner"], [class*="banner"], [style*="position: fixed"]');
          overlays.forEach(el => {
            if (!el.tagName.toLowerCase().includes('header') && (typeof el.className === 'string' ? !el.className.toLowerCase().includes('header') : true)) {
               el.style.display = 'none';
            }
          });
        });

        await page.waitForTimeout(1000);

        await page.screenshot({ path: outPath, fullPage: true });
        console.log(`  [OK] Saved ${filename}`);
      } catch (e) {
        console.error(`  [ERROR] Failed to screenshot ${url}:`, e.message);
      }
    }
  }

  await browser.close();
  console.log('All screenshots completed.');
}

run().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
