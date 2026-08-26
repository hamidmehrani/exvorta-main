import { getPayloadClient } from '../lib/payload'

const payloadData = {
  title: 'Home',
  slug: 'home',
  blocks: [
    {
      blockType: 'hero',
      headline: 'Digital Infrastructure for Global Traders',
      subheadline: 'The definitive digital foundation for elite importers and exporters. Precision-engineered web presence and automated compliance.',
      primaryCTA: {
        label: '[ REQUEST PROPOSAL ]',
        url: '/rfq'
      }
    }
  ]
}

async function run() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.create({
      collection: 'pages',
      data: payloadData,
    })
    console.log('Success:', result)
    process.exit(0)
  } catch (error) {
    console.error('Validation Error:', error)
    if (error.data) {
      console.error('Details:', JSON.stringify(error.data, null, 2))
    }
    process.exit(1)
  }
}

run()
