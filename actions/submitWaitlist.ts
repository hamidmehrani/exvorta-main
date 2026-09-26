'use server'

import { submitLead, LeadSubmission } from './submitLead'
import { reportError } from '@/lib/error-reporting'

export async function submitWaitlist(data: LeadSubmission) {
  // 1. Save to the existing system (Turnstile, Rate Limiting, Payload DB)
  const result = await submitLead({ ...data, collection: 'waitlist' });

  if (!result.success) {
    return result;
  }

  // 2. Webhook Integration
  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: data.email,
          source: data.source,
          payload: data.payload 
        }),
      });
    } catch (error) {
      reportError(error instanceof Error ? error : new Error(String(error)), { context: 'submitWaitlistWebhook' });
    }
  }

  return result;
}
