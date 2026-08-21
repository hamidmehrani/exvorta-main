const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, '../screenshots');

const ROUTES = [
  { path: '/insights', name: 'insights' },
  { path: '/insights/test-post', name: 'insights-single' },
];

async function run() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.waitForTimeout(2000);

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    const filename = `${route.name}.png`;
    const outPath = path.join(OUT_DIR, filename);

    console.log(`Taking screenshot: ${url} -> ${filename}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(3000);

      if (route.name === 'insights') {
         const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('/insights/'));
         });
         if (links.length > 0) {
             ROUTES[1].path = new URL(links[0]).pathname;
             console.log(`Found real post slug: ${ROUTES[1].path}`);
         }
      }

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
      await page.screenshot({ path: outPath, fullPage: true });
      console.log(`  [OK] Saved ${filename}`);
    } catch (e) {
      console.error(`  [ERROR] Failed to screenshot ${url}:`, e.message);
    }
  }

  await browser.close();
}

run().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
