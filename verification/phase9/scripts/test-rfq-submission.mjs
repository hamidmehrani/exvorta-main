import { chromium } from 'playwright';
import fs from 'fs';

async function runTest() {
  const result = {
    timestamp: new Date().toISOString(),
    route: 'http://localhost:3000/rfq',
    turnstileLoaded: false,
    turnstileTokenReceived: false,
    formSubmitted: false,
    submissionSuccessful: false,
    details: {}
  };

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });

  const page = await context.newPage();

  page.on('response', (res) => {
    const url = res.url();
    if (url.includes('challenges.cloudflare.com/turnstile')) {
      result.details.turnstileApiStatus = res.status();
    }
  });

  try {
    console.log('1. Navigating to http://localhost:3000/rfq...');
    await page.goto('http://localhost:3000/rfq', { waitUntil: 'domcontentloaded', timeout: 30000 });

    console.log('2. Waiting for dynamic Turnstile component to mount...');
    await page.waitForSelector('#cf-turnstile', { timeout: 15000 });
    result.turnstileLoaded = true;
    console.log('   Turnstile container mounted successfully!');

    console.log('3. Triggering Turnstile viewport interaction...');
    await page.locator('#cf-turnstile').scrollIntoViewIfNeeded();
    await page.mouse.move(600, 300);

    // Poll until Turnstile provides response token
    let token = null;
    for (let i = 0; i < 20; i++) {
      token = await page.evaluate(() => window.turnstile?.getResponse());
      if (token) break;
      await page.waitForTimeout(500);
    }

    if (!token) {
      throw new Error('Turnstile token was not generated within timeout');
    }
    result.turnstileTokenReceived = true;
    result.details.tokenSnippet = token.slice(0, 15) + '...';
    console.log('   Token acquired:', result.details.tokenSnippet);

    console.log('4. Filling form fields...');
    await page.fill('input[name="name"]', 'Automated QA Engineer');
    await page.fill('input[name="companyName"]', 'Exvorta Pilot Systems Inc');
    await page.fill('input[name="email"]', 'qa-benchmark@exvorta.com');
    await page.selectOption('select[name="businessType"]', 'exporter');
    await page.fill('input[name="mainMarkets"]', 'North America & Europe');
    await page.fill('textarea[name="message"]', 'Automated E2E functional test verifying dynamic Turnstile lazy-loading and Server Action submission pipeline.');
    await page.selectOption('select[name="budget"]', '$1.5–3k');

    console.log('5. Submitting RFQ form...');
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    result.formSubmitted = true;

    console.log('6. Waiting for [ SUCCESS ] confirmation state...');
    await page.waitForSelector('text=[ SUCCESS ]', { timeout: 15000 });
    result.submissionSuccessful = true;
    console.log('   SUCCESS: Form accepted and [ SUCCESS ] confirmation rendered!');

    // Capture screenshot of success view
    await page.screenshot({ path: 'verification/phase9/diagnostics/rfq-success.png', fullPage: true });
    result.screenshot = 'verification/phase9/diagnostics/rfq-success.png';

  } catch (err) {
    console.error('Test encountered error:', err.message);
    result.error = err.message;
    await page.screenshot({ path: 'verification/phase9/diagnostics/rfq-failure.png', fullPage: true }).catch(() => {});
  } finally {
    await browser.close();
    fs.writeFileSync('verification/phase9/diagnostics/rfq-functional-result.json', JSON.stringify(result, null, 2));
    console.log('Test completed. Results saved to verification/phase9/diagnostics/rfq-functional-result.json');
  }
}

runTest();
