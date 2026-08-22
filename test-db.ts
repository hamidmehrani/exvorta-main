import { getPayload } from 'payload'
import config from './payload.config'

async function test() {
  const payload = await getPayload({ config })
  const pages = await payload.find({ collection: 'pages', limit: 1 })
  console.log('✅ Pages:', pages.totalDocs)
  const home = await payload.find({ 
    collection: 'pages', 
    where: { slug: { equals: 'home' } } 
  })
  console.log('✅ Home:', home.docs[0]?.title || 'NOT FOUND')
  process.exit(0)
}
test().catch(e => { console.error('❌', e.message); process.exit(1) })
