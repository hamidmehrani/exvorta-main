import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../security')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

export async function testSubmission(expectedOutcome, screenshotName) {
  const result = {
    expectedOutcome,
    turnstileLoaded: false,
    tokenAcquired: false,
    formSubmitted: false,
    blockedBySecurityException: false,
    submissionSuccessful: false,
    errorMessage: null,
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  })

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  })

  const page = await context.newPage()

  try {
    console.log(`\nNavigating to http://localhost:3000/rfq (Testing: ${expectedOutcome})...`)
    await page.goto('http://localhost:3000/rfq', { waitUntil: 'domcontentloaded', timeout: 30000 })

    await page.waitForSelector('#cf-turnstile', { timeout: 15000 })
    result.turnstileLoaded = true

    await page.locator('#cf-turnstile').scrollIntoViewIfNeeded()
    await page.mouse.move(600, 300)

    let token = null
    for (let i = 0; i < 20; i++) {
      token = await page.evaluate(() => window.turnstile?.getResponse())
      if (token) break
      await page.waitForTimeout(500)
    }

    if (!token) throw new Error('Turnstile token was not generated within timeout')
    result.tokenAcquired = true

    await page.fill('input[name="name"]', 'Security Test Runner')
    await page.fill('input[name="companyName"]', 'Exvorta Security Audit')
    await page.fill('input[name="email"]', 'security-audit@exvorta.com')
    await page.selectOption('select[name="businessType"]', 'exporter')
    await page.fill('input[name="mainMarkets"]', 'Global')
    await page.fill('textarea[name="message"]', 'Verifying server-side security exception blocking when dummy secret is deployed.')
    await page.selectOption('select[name="budget"]', '$3k+')

    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()
    result.formSubmitted = true

    // Wait for either SUCCESS or ERROR
    const outcome = await Promise.race([
      page.waitForSelector('text=[ SUCCESS ]', { timeout: 10000 }).then(() => 'SUCCESS'),
      page.waitForSelector('text=[ ERROR:', { timeout: 10000 }).then(() => 'ERROR')
    ]).catch(err => 'TIMEOUT: ' + err.message)

    console.log(`Outcome observed on page: ${outcome}`)

    if (outcome === 'SUCCESS') {
      result.submissionSuccessful = true
    } else if (outcome === 'ERROR') {
      const errorText = await page.locator('form [role="alert"]').innerText()
      result.errorMessage = errorText
      if (errorText.toLowerCase().includes('security exception') || errorText.toLowerCase().includes('placeholder')) {
        result.blockedBySecurityException = true
      }
    }

    const scPath = path.join(outDir, screenshotName)
    await page.screenshot({ path: scPath, fullPage: true })
    result.screenshot = scPath
  } catch (err) {
    console.error('Test error:', err.message)
    result.error = err.message
  } finally {
    await browser.close()
  }

  return result
}

async function run() {
  const mode = process.argv[2] || 'blocked'
  const screenshot = mode === 'blocked' ? 'rfq-blocked-default.png' : 'rfq-allowed-optin.png'
  const res = await testSubmission(mode, screenshot)
  console.log('Result:', JSON.stringify(res, null, 2))
  fs.writeFileSync(path.join(outDir, `rfq-${mode}-result.json`), JSON.stringify(res, null, 2))
}

run()
