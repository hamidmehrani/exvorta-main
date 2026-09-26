import { getPayloadClient } from '../../../lib/payload'

async function checkAndClean() {
  console.log('--- DB TEST DATA AUDIT ---')
  const payload = await getPayloadClient()

  // 1. Check leads collection
  const leads = await payload.find({
    collection: 'leads',
    where: {
      email: {
        contains: 'test-qa@exvorta.com',
      },
    },
  })

  console.log(`Found ${leads.totalDocs} test lead(s) with 'test-qa@exvorta.com'.`)
  if (leads.totalDocs > 0) {
    const db = payload.db as unknown as {
      drizzle: { execute: (query: unknown) => Promise<any> }
    }
    const { sql } = await import('@payloadcms/db-vercel-postgres/drizzle')
    await db.drizzle.execute(sql`DELETE FROM "leads" WHERE "email" = 'test-qa@exvorta.com'`)
    console.log(`✅ Deleted test lead(s) from 'leads' table with SQL.`)
  }

  // 2. Check form-submissions collection
  const rfqSubmissions = await payload.find({
    collection: 'form-submissions',
    where: {
      email: {
        contains: 'test-qa@exvorta.com',
      },
    },
  })

  console.log(`Found ${rfqSubmissions.totalDocs} test RFQ submission(s) with 'test-qa@exvorta.com'.`)
  for (const doc of rfqSubmissions.docs) {
    console.log(`Submission ID: ${doc.id}, Email: ${doc.email}, Created: ${doc.createdAt}`)
    await payload.delete({
      collection: 'form-submissions',
      id: doc.id,
    })
    console.log(`✅ Deleted test submission ID: ${doc.id}`)
  }

  // 3. Confirm clean state
  const remainingLeads = await payload.find({
    collection: 'leads',
    where: {
      email: {
        contains: 'test-qa@exvorta.com',
      },
    },
  })
  console.log(`Remaining test leads: ${remainingLeads.totalDocs}`)

  const remainingSubmissions = await payload.find({
    collection: 'form-submissions',
    where: {
      email: {
        contains: 'test-qa@exvorta.com',
      },
    },
  })
  console.log(`Remaining test RFQs: ${remainingSubmissions.totalDocs}`)
  console.log('--- AUDIT & CLEANUP COMPLETE ---')
  process.exit(0)
}

checkAndClean().catch((err) => {
  console.error('Audit failed:', err)
  process.exit(1)
})
