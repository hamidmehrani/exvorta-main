import { submitLead } from '../../../actions/submitLead'
import { getPayloadClient } from '../../../lib/payload'

async function testHoneypotAndSource() {
  console.log('=== HONEYPOT AND SOURCE VERIFICATION TEST ===\n')

  // Test 1: Honeypot Triggered
  console.log('[Test 1] Submitting lead with populated honeypot (bot-field)...')
  const honeypotResult = await submitLead({
    source: 'RFQ',
    email: 'honeypot-test@exvorta.com',
    botField: 'I am a malicious spam bot',
  })
  console.log('Honeypot Submission Result:', honeypotResult)
  if (!honeypotResult.success && honeypotResult.error === 'Spam detected.') {
    console.log('✅ PASS: Honeypot correctly blocked the spam submission.\n')
  } else {
    console.error('❌ FAIL: Honeypot failed to block spam submission!\n')
    process.exit(1)
  }

  // Test 2: Invalid or Missing Source
  console.log('[Test 2] Submitting lead with invalid source...')
  const invalidSourceResult = await submitLead({
    // @ts-expect-error Testing invalid runtime input
    source: 'InvalidSource',
    email: 'source-test@exvorta.com',
  })
  console.log('Invalid Source Result:', invalidSourceResult)
  if (!invalidSourceResult.success && invalidSourceResult.error === 'Invalid lead source.') {
    console.log('✅ PASS: Invalid source rejected by validation.\n')
  } else {
    console.error('❌ FAIL: Invalid source was not rejected!\n')
    process.exit(1)
  }

  // Test 3: Clean Submission with Valid Source ('RFQ')
  console.log('[Test 3] Submitting clean lead with valid source (source="RFQ", clean bot-field)...')
  const cleanResult = await submitLead({
    source: 'RFQ',
    email: 'valid-test-honeypot@exvorta.com',
    company: 'Exvorta Verification Suite',
    botField: undefined,
  })
  console.log('Clean Submission Result:', cleanResult)
  if (cleanResult.success) {
    console.log('✅ PASS: Clean submission accepted.\n')
  } else {
    console.error('❌ FAIL: Clean submission failed:', cleanResult.error)
    process.exit(1)
  }

  // Cleanup test lead
  console.log('[Cleanup] Cleaning up test lead valid-test-honeypot@exvorta.com...')
  const payload = await getPayloadClient()
  const db = payload.db as unknown as {
    drizzle: { execute: (query: unknown) => Promise<any> }
  }
  const { sql } = await import('@payloadcms/db-vercel-postgres/drizzle')
  await db.drizzle.execute(sql`DELETE FROM "leads" WHERE "email" = 'valid-test-honeypot@exvorta.com'`)
  console.log('✅ PASS: Test data cleaned up.\n')

  console.log('=== ALL HONEYPOT & SOURCE TESTS PASSED ===')
  process.exit(0)
}

testHoneypotAndSource().catch((err) => {
  console.error('Test suite failed:', err)
  process.exit(1)
})
