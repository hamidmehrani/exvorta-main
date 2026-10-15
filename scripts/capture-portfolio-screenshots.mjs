// Re-captures uniform 1440px-wide full-page screenshots of the three live
// client sites for the Exvorta portfolio cards.
//
// Run OUTSIDE the Claude sandbox (it needs live internet):
//   cd ~/Desktop/Exvorta/Exvorta && node scripts/capture-portfolio-screenshots.mjs
//
// Output: public/portfolio-{spicevo,nutave,stonvi}.png — then run
//   node scripts/optimize-portfolio-captures.mjs
// to produce the lightweight .webp files the site serves.
import { chromium } from 'playwright';

const SITES = [
  ['spicevo', 'https://spicevo.exvorta.com'],
  ['nutave', 'https://nutave.exvorta.com'],
  ['stonvi', 'https://stonvi.exvorta.com'],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
  reducedMotion: 'reduce',
});

for (const [name, url] of SITES) {
  const page = await ctx.newPage();

  // Pre-accept cookie consent so the banner never renders in captures.
  await ctx.addCookies([
    { name: 'cookie-consent', value: 'accepted', url, httpOnly: true, sameSite: 'Lax', secure: url.startsWith('https') },
  ]);

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  } catch {
    console.log(`${name}: networkidle timeout — continuing`);
  }
  await page.waitForTimeout(2500);

  // Belt & braces: strip any consent UI that may still be present.
  await page.addStyleTag({
    content: `[class*="cookie" i], [id*="cookie" i], [class*="consent" i], [id*="consent" i], [class*="gdpr" i], [data-consent] { display: none !important; }`,
  });
  await page.evaluate(() => {
    document
      .querySelectorAll(
        '[class*="cookie" i], [id*="cookie" i], [class*="consent" i], [id*="consent" i], [class*="gdpr" i], [data-consent]',
      )
      .forEach((el) => el.remove());
  });

  // Pre-scroll to trigger lazy-loaded images, then return to top.
  await page.evaluate(async () => {
    const el = document.scrollingElement || document.documentElement;
    for (let y = 0; y < el.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 700));
  });
  await page.waitForTimeout(800);

  try {
    await page.screenshot({
      path: `public/portfolio-${name}.png`,
      fullPage: true,
      animations: 'disabled',
      timeout: 90000,
    });
    console.log(`${name}: captured`);
  } catch {
    // fullPage can hang on sites with infinite animations — fall back to
    // viewport stitching.
    console.log(`${name}: fullPage hung, stitching viewport shots...`);
    const shots = [];
    const total = await page.evaluate(
      () => (document.scrollingElement || document.documentElement).scrollHeight,
    );
    const step = 765; // 85% of 900px viewport
    for (let y = 0; y < total; y += step) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(350);
      shots.push({ y, buf: await page.screenshot({ timeout: 20000 }) });
      if (y + 900 >= total) break;
    }
    const bottom = Math.max(0, total - 900);
    if (bottom > shots[shots.length - 1].y) {
      await page.evaluate((yy) => window.scrollTo(0, yy), bottom);
      await page.waitForTimeout(350);
      shots.push({ y: bottom, buf: await page.screenshot({ timeout: 20000 }) });
    }
    // Stitch vertically with PIL equivalent via sharp? Simpler: emit raw shots
    // and let the shell stitch — but keep it self-contained with a tiny PNG
    // canvas via playwright's page.
    const stitchPage = await ctx.newPage();
    const b64s = shots.map((s) => s.buf.toString('base64'));
    const png = await stitchPage.evaluate(async (imgs) => {
      const loads = await Promise.all(
        imgs.map(
          (b) =>
            new Promise((res) => {
              const im = new Image();
              im.onload = () => res(im);
              im.src = 'data:image/png;base64,' + b;
            }),
        ),
      );
      const w = loads[0].width;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = loads[loads.length - 1].y * (loads[0].height / 900) + loads[loads.length - 1].height;
      const c2 = canvas.getContext('2d');
      loads.forEach((im, i) => {
        const yPos = i < loads.length - 1 ? imgs[i].y * (im.height / 900) : canvas.height - im.height;
        c2.drawImage(im, 0, yPos);
      });
      return canvas.toDataURL('image/png').split(',')[1];
    }, b64s.map((b, i) => ({ b, y: shots[i].y })));
    const fs = await import('fs');
    fs.writeFileSync(`public/portfolio-${name}.png`, Buffer.from(png, 'base64'));
    await stitchPage.close();
    console.log(`${name}: stitched`);
  }
  await page.close();
}
await browser.close();
console.log('Done. Screenshots updated in public/.');
