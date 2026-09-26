import { z } from 'zod';

// Strict validation schema
const RFQSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254),
  companyName: z.string().max(100).optional(),
  businessType: z.enum(['importer', 'exporter', 'trading_company']),
  mainMarkets: z.string().max(200).optional(),
  budget: z.enum(['$800–1.5k', '$1.5–3k', '$3k+']),
  message: z.string().max(5000).optional(),
  botField: z.literal('').optional(),
  turnstileToken: z.string().optional(),
});

type RFQData = z.infer<typeof RFQSchema>;

'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { checkRateLimit, verifyTurnstile } from '@/lib/rate-limit'

export async function submitRFQ(formData: {
  name: string
  email: string
  companyName?: string
  businessType?: string
  mainMarkets?: string
  budget?: string
  message?: string
  botField?: string
  turnstileToken?: string
}) {
  try {
    // ── 1. Honeypot ─────────────────────────────────────────────────────────
    if (formData.botField) {
      return { success: false, error: 'Spam detected.' }
    }

    // ── 2. Rate Limiting ────────────────────────────────────────────────────
    const ip = (await headers()).get('x-forwarded-for') || 'unknown'
    const payloadClient = await getPayloadClient()
    const rate = await checkRateLimit(payloadClient, ip)
    if (!rate.allowed) {
      return { success: false, error: 'Too many submissions. Please try again later.' }
    }

    // ── 3. Cloudflare Turnstile ─────────────────────────────────────────────
    const skipTurnstile =
      process.env.NODE_ENV !== 'production' && process.env.SKIP_TURNSTILE_IN_DEV === 'true'

    if (!skipTurnstile) {
      const ok = await verifyTurnstile(formData.turnstileToken)
      if (!ok) {
        return { success: false, error: 'Invalid security token.' }
      }
    }

    // ── 4. Validate ─────────────────────────────────────────────────────────
    if (!formData.name?.trim() || formData.name.length > 100) {
      return { success: false, error: 'Please enter your full name.' }
    }

    const email = formData.email?.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email) || email.length > 254) {
      return { success: false, error: 'Please enter a valid email address.' }
    }

    if (formData.companyName && formData.companyName.length > 100) {
      return { success: false, error: 'Company name is too long.' }
    }

    if (formData.message && formData.message.length > 5000) {
      return { success: false, error: 'Message is too long.' }
    }

    await payloadClient.create({
      collection: 'form-submissions',
      data: {
        name: formData.name,
        email,
        companyName: formData.companyName || '',
        businessType: (formData.businessType as "importer" | "exporter" | "trading_company") || undefined,
        mainMarkets: formData.mainMarkets || '',
        budget: (['$800–1.5k', '$1.5–3k', '$3k+'].includes(String(formData.budget)) ? formData.budget : null) as '$800–1.5k' | '$1.5–3k' | '$3k+' | null,
        message: formData.message || '',
        status: 'pending',
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error submitting RFQ:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to submit form' }
  }
}
