'use server'

import { getPayloadClient } from '@/lib/payload'
import { headers } from 'next/headers'
import { sql } from '@payloadcms/db-vercel-postgres'

const RATE_LIMIT = 5

export interface LeadSubmission {
  source: 'Waitlist' | 'RFQ'
  email: string
  company?: string
  payload?: Record<string, unknown>
  turnstileToken?: string
  botField?: string
  collection?: 'leads' | 'waitlist'
}

export async function submitLead(data: LeadSubmission) {
  const ip = (await headers()).get('x-forwarded-for') || 'unknown'
  const payloadClient = await getPayloadClient()
  const db = payloadClient.db as { drizzle: { execute: (query: unknown) => Promise<{ rows: { attempt_count: number }[] }> } }

  // ── 1. Rate Limiting ────────────────────────────────────────────────────────
  await db.drizzle.execute(
    sql`DELETE FROM "rate_limits" WHERE "window_start" < now() - interval '15 minutes'`
  )

  const existingRecord = await db.drizzle.execute(
    sql`SELECT "attempt_count" FROM "rate_limits" WHERE "identifier" = ${ip}`
  )

  if (existingRecord.rows?.length > 0) {
    if (existingRecord.rows[0].attempt_count >= RATE_LIMIT) {
      return { success: false, error: 'Too many submissions. Please try again later.' }
    }
    await db.drizzle.execute(
      sql`UPDATE "rate_limits" SET "attempt_count" = "attempt_count" + 1 WHERE "identifier" = ${ip}`
    )
  } else {
    await db.drizzle.execute(
      sql`INSERT INTO "rate_limits" ("identifier", "attempt_count", "window_start") VALUES (${ip}, 1, now())`
    )
  }

  // ── 2. Honeypot ─────────────────────────────────────────────────────────────
  if (data.botField) {
    return { success: false, error: 'Spam detected.' }
  }

  // ── 3. Cloudflare Turnstile ─────────────────────────────────────────────────
  const skipTurnstile =
    process.env.NODE_ENV !== 'production' && process.env.SKIP_TURNSTILE_IN_DEV === 'true'

  if (!skipTurnstile) {
    const token = data.turnstileToken
    if (!token) {
      return { success: false, error: 'Security verification failed.' }
    }
    try {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: `secret=${encodeURIComponent(process.env.TURNSTILE_SECRET_KEY || '')}&response=${encodeURIComponent(token)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      const verifyData = await verifyRes.json()
      if (!verifyData.success) {
        return { success: false, error: 'Invalid security token.' }
      }
    } catch (err) {
      console.error('[EXVORTA OS] Turnstile verification failed:', err)
      return { success: false, error: 'Security check failed.' }
    }
  }

  // ── 4. Extract & Validate Core Fields ───────────────────────────────────────
  if (!data.email || typeof data.email !== 'string') {
    return { success: false, error: 'Email is required.' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email) || data.email.length > 254) {
    return { success: false, error: 'Invalid email address.' }
  }

  if (data.company && data.company.length > 100) {
    return { success: false, error: 'Company name is too long.' }
  }

  if (!data.source || !['Waitlist', 'RFQ'].includes(data.source)) {
    return { success: false, error: 'Invalid lead source.' }
  }

  // ── 5. Persist via Payload Local API ─────────────────────────────────────────
  try {
    await payloadClient.create({
      collection: (data.collection || 'leads') as 'leads' | 'waitlist',
      data: {
        source: data.source,
        email: data.email,
        company: data.company,
        payload: data.payload,
        status: 'New',
      },
    })
    return { success: true, error: null }
  } catch (err) {
    console.error('[EXVORTA OS] Lead creation error:', err)
    return { success: false, error: 'Failed to submit the form. Please try again.' }
  }
}

export async function submitLeadAction(prevState: unknown, formData: FormData) {
  const source = formData.get('source') as 'Waitlist' | 'RFQ'
  const email = formData.get('email') as string
  const company = formData.get('company') as string | undefined
  const botField = formData.get('bot-field') as string | undefined
  const turnstileToken = formData.get('cf-turnstile-response') as string | undefined

  const entries = Array.from(formData.entries())
  const extraData: Record<string, string> = {}
  for (const [key, value] of entries) {
    if (!['source', 'email', 'company', 'bot-field', 'cf-turnstile-response'].includes(key)) {
      extraData[key] = value.toString()
    }
  }

  const payload = Object.keys(extraData).length > 0 ? extraData : undefined

  return submitLead({ source, email, company, botField, turnstileToken, payload })
}
