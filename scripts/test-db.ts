import { getPayload } from 'payload'
import config from '../src/payload.config' // using src/payload.config based on common Next/Payload setups, or just payload.config if it's at root. Wait, I should check where payload.config is.

async function test() {
  console.log('Testing Payload connection...')
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({ collection: 'pages', limit: 1 })
    console.log('✅ Pages found:', pages.totalDocs)
    const home = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } } })
    console.log('✅ Home page:', home.docs[0]?.title || 'NOT FOUND')
    process.exit(0)
  } catch (e) {
    console.error('❌', e.message)
    process.exit(1)
  }
}
test()
