import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../diagnostics')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

async function run() {
  console.log('Tracing network requests on http://localhost:3000/rfq...')
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  const context = await browser.newContext()
  const page = await context.newPage()

  const client = await context.newCDPSession(page)
  await client.send('Network.enable')

  const capturedRequests = []
  let adminChunkFound = null

  client.on('Network.requestWillBeSent', (params) => {
    capturedRequests.push({
      url: params.request.url,
      method: params.request.method,
      priority: params.request.priority,
      initiator: params.initiator
    })

    if (params.request.url.includes('fff8d4bc') || params.request.url.includes('admin')) {
      adminChunkFound = {
        url: params.request.url,
        initiator: params.initiator,
        priority: params.request.priority
      }
      console.log('ADMIN CHUNK DETECTED:', params.request.url)
    }
  })

  await page.goto('http://localhost:3000/rfq', { waitUntil: 'load', timeout: 30000 })
  await page.waitForTimeout(3000)

  await browser.close()

  const result = {
    timestamp: new Date().toISOString(),
    route: '/rfq',
    totalRequests: capturedRequests.length,
    adminChunkFound,
    allJsChunks: capturedRequests.filter(r => r.url.endsWith('.js')).map(r => r.url)
  }

  const outFile = path.join(outDir, 'rfq-cdp-trace.json')
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2))
  console.log(`Saved CDP network trace to: ${outFile}`)
  console.log(`Admin chunk found on /rfq? ${Boolean(adminChunkFound)}`)
}

run().catch((err) => {
  console.error('CDP trace error:', err.message)
  process.exit(1)
})
