'use server'

import { submitLead, LeadSubmission } from './submitLead'

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
      console.error('[EXVORTA OS] Error sending waitlist webhook:', error);
    }
  }

  return result;
}
