import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, '../screenshots');
const LOCALES = ['en', 'ar', 'fa'];

const ROUTES = [
  { path: '', name: 'home' },
  { path: '/test-blocks', name: 'test-blocks' }
];

async function run() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log(`Launching Playwright...`);
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  for (const loc of LOCALES) {
    for (const route of ROUTES) {
      const url = `${BASE_URL}/${loc}${route.path}`;
      const filename = `boilerplate-${loc}-${route.name}.png`;
      const outPath = path.join(OUT_DIR, filename);

      console.log(`Taking screenshot: ${url} -> ${filename}`);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(2000); // Allow animations to settle

        await page.screenshot({ path: outPath, fullPage: true });
        console.log(`  [OK] Saved ${filename}`);
      } catch (e: any) {
        console.error(`  [ERROR] Failed to screenshot ${url}:`, e.message);
      }
    }
  }

  await browser.close();
  console.log('All Boilerplate screenshots completed.');
}

run().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
