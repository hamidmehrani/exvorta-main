import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildLeadAutoReplyHtml, buildLeadAdminNotificationHtml } from '../../../payload/collections/Leads/hooks/sendLeadEmails.ts'
import { buildRFQClientConfirmationHtml, buildRFQAdminNotificationHtml } from '../../../payload/collections/FormSubmissions/hooks/sendRFQEmails.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../emails')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const emails = [
  {
    name: 'lead-auto-reply',
    html: buildLeadAutoReplyHtml({
      id: 'L-8942',
      email: 'director@nordic-commodities.com',
      company: 'Nordic Commodities AS',
      source: 'Website Inquiry'
    })
  },
  {
    name: 'lead-admin-notification',
    html: buildLeadAdminNotificationHtml(
      {
        id: 'L-8942',
        email: 'director@nordic-commodities.com',
        company: 'Nordic Commodities AS',
        source: 'Website Inquiry',
        payload: { message: 'Inquiring about global grain commodity trading platform overhaul.' }
      },
      'director@nordic-commodities.com / Nordic Commodities AS'
    )
  },
  {
    name: 'rfq-client-confirmation',
    html: buildRFQClientConfirmationHtml({
      id: 'RFQ-2026-441',
      name: 'Henrik Lindqvist',
      companyName: 'Lindqvist Global Logistics',
      businessType: 'Freight & Trade Infrastructure',
      budget: '$50,000 – $100,000'
    })
  },
  {
    name: 'rfq-admin-notification',
    html: buildRFQAdminNotificationHtml(
      {
        id: 'RFQ-2026-441',
        name: 'Henrik Lindqvist',
        email: 'h.lindqvist@lindqvistlogistics.com',
        companyName: 'Lindqvist Global Logistics',
        businessType: 'Freight & Trade Infrastructure',
        mainMarkets: 'Europe, GCC, East Asia',
        budget: '$50,000 – $100,000',
        message: 'Need institutional CMS and real-time shipment portal for B2B commodity charterers.'
      },
      'h.lindqvist@lindqvistlogistics.com / Lindqvist Global Logistics'
    )
  }
]

async function run() {
  console.log('Generating responsive HTML email previews...')
  for (const email of emails) {
    const htmlPath = path.join(outDir, `${email.name}.html`)
    fs.writeFileSync(htmlPath, email.html, 'utf8')
    console.log(`Saved HTML: ${htmlPath}`)
  }

  console.log('\nLaunching Playwright mobile viewport (375x667, 2x DPR)...')
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true
  })
  const page = await context.newPage()

  for (const email of emails) {
    const htmlPath = path.join(outDir, `${email.name}.html`)
    await page.goto(`file://${htmlPath}`)
    await page.waitForTimeout(500)
    const shotPath = path.join(outDir, `${email.name}.png`)
    await page.screenshot({ path: shotPath, fullPage: true })
    console.log(`Saved Mobile Screenshot: ${shotPath}`)
  }

  await browser.close()
  console.log('\nAll email previews and screenshots saved successfully in verification/phase4/emails/')
}

run().catch((err) => {
  console.error('Error generating email previews:', err)
  process.exit(1)
})
