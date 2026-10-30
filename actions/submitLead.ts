'use server'

import { getPayloadClient } from '@/lib/payload'
import { headers } from 'next/headers'
import { checkRateLimit, verifyTurnstile } from '@/lib/rate-limit'
import { reportError } from '@/lib/error-reporting'

export interface LeadSubmission {
  source: 'Waitlist' | 'RFQ' | 'Corridor-Checker'
  email: string
  company?: string
  payload?: Record<string, unknown>
  turnstileToken?: string
  botField?: string
  collection?: 'leads' | 'waitlist'
}

export async function submitLead(data: LeadSubmission) {
  let ip = 'unknown'
  try {
    const headersList = await headers()
    ip = headersList.get('x-forwarded-for') || 'unknown'
  } catch {
    ip = '127.0.0.1'
  }
  const payloadClient = await getPayloadClient()

  // ── 1. Rate Limiting ────────────────────────────────────────────────────────
  const rate = await checkRateLimit(payloadClient, ip)
  if (!rate.allowed) {
    return { success: false, error: 'Too many submissions. Please try again later.' }
  }

  // ── 2. Honeypot ─────────────────────────────────────────────────────────────
  if (data.botField) {
    return { success: false, error: 'Spam detected.' }
  }

  // ── 3. Cloudflare Turnstile ─────────────────────────────────────────────────
  const skipTurnstile =
    process.env.NODE_ENV !== 'production' && process.env.SKIP_TURNSTILE_IN_DEV === 'true'

  if (!skipTurnstile) {
    const ok = await verifyTurnstile(data.turnstileToken)
    if (!ok) {
      return { success: false, error: 'Invalid security token.' }
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

  if (!data.source || !['Waitlist', 'RFQ', 'Corridor-Checker'].includes(data.source)) {
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
    reportError(err instanceof Error ? err : new Error(String(err)), { context: 'submitLead', email: data.email, source: data.source })
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
