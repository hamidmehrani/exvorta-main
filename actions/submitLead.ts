'use server'

import { getPayloadClient } from '@/lib/payload'
import { headers } from 'next/headers'

import { sql } from '@payloadcms/db-postgres'

const RATE_LIMIT = 5

export async function submitLeadAction(prevState: unknown, formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for') || 'unknown'
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = payload.db as any
  
  // 1. Rate Limiting via Neon (Postgres)
  // Opportunistic cleanup: delete records older than the window
  await db.drizzle.execute(sql`DELETE FROM "rate_limits" WHERE "window_start" < now() - interval '15 minutes'`)
  
  const existingRecord = await db.drizzle.execute(sql`
    SELECT "attempt_count", "window_start" FROM "rate_limits" WHERE "identifier" = ${ip}
  `)
  
  if (existingRecord.rows && existingRecord.rows.length > 0) {
    const record = existingRecord.rows[0]
    if (record.attempt_count >= RATE_LIMIT) {
      return { success: false, error: 'Too many submissions. Please try again later.' }
    }
    await db.drizzle.execute(sql`
      UPDATE "rate_limits" SET "attempt_count" = "attempt_count" + 1 WHERE "identifier" = ${ip}
    `)
  } else {
    await db.drizzle.execute(sql`
      INSERT INTO "rate_limits" ("identifier", "attempt_count", "window_start") VALUES (${ip}, 1, now())
    `)
  }

  // 1. Honeypot Check
  const honeypot = formData.get('bot-field')
  if (honeypot) {
    return { success: false, error: 'Spam detected' }
  }

  const skipTurnstile = process.env.NODE_ENV !== 'production' && process.env.SKIP_TURNSTILE_IN_DEV === 'true'

  if (!skipTurnstile) {
    // 2. Turnstile Validation
    const token = formData.get('cf-turnstile-response') as string
    if (!token) {
      return { success: false, error: 'Security verification failed.' }
    }

    const secret = process.env.TURNSTILE_SECRET_KEY || ''
  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    const verifyData = await verifyRes.json()

    if (!verifyData.success) {
      return { success: false, error: 'Invalid security token.' }
    }
    } catch (err) {
      console.error('Turnstile verification failed:', err)
      return { success: false, error: 'Security check failed.' }
    }
  }

  // 3. Payload Insertion
  try {
    await payload.create({
      collection: 'leads',
      data: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        message: formData.get('message') as string,
        status: 'new',
      },
    })
    return { success: true, error: null }
  } catch (err) {
    console.error('Lead creation error:', err)
    return { success: false, error: 'Failed to submit the form.' }
  }
}
