import { getPayloadClient } from '../lib/payload'

async function validatePages() {
  console.log('Validating pages...')
  process.env.DATABASE_URI = process.env.DATABASE_URI_UNPOOLED || process.env.DATABASE_URI
  try {
    const payload = await getPayloadClient()
    
    const requiredSlugs = ['waitlist', 'ecosystem', 'portfolio', 'insights', 'blog']
    let allExist = true

    for (const slug of requiredSlugs) {
      const { docs } = await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        draft: true,
        depth: 0,
      })

      if (docs && docs.length > 0) {
        console.log(`✅ Page exists: ${slug} (ID: ${docs[0].id})`)
      } else {
        console.error(`❌ Missing page: ${slug}`)
        allExist = false
      }
    }

    if (allExist) {
      console.log('All required pages have been successfully seeded!')
    } else {
      console.error('Some pages are missing. Please review the seeding scripts.')
      process.exit(1)
    }
    process.exit(0)
  } catch (error) {
    console.error('Error validating pages:', error)
    process.exit(1)
  }
}

validatePages()
