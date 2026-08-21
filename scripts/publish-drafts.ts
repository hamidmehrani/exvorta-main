import { getPayloadClient } from '../lib/payload'

async function publishDrafts() {
  console.log('Publishing drafts...')
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'pages',
      draft: true,
      limit: 100,
    })
    console.log(`Found ${docs.length} draft pages.`)
    for (const doc of docs) {
      await payload.update({
        collection: 'pages',
        id: doc.id,
        data: {
          _status: 'published',
        } as any,
      })
      console.log(`Published page: ${doc.slug}`)
    }
    process.exit(0)
  } catch (error) {
    console.error('Error publishing:', error)
    process.exit(1)
  }
}

publishDrafts()
