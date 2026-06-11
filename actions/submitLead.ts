'use server'

import { getPayloadClient } from '@/lib/payload'
import { headers } from 'next/headers'

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

export async function submitLeadAction(prevState: unknown, formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (record) {
    if (now - record.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (record.count >= RATE_LIMIT) {
        return { success: false, error: 'Too many submissions. Please try again later.' }
      }
      record.count++
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now })
    }
  } else {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
  }

  // 1. Honeypot Check
  const honeypot = formData.get('bot-field')
  if (honeypot) {
    return { success: false, error: 'Spam detected' }
  }

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

  // 3. Payload Insertion
  try {
    const payload = await getPayloadClient()
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
