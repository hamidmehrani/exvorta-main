import { CollectionAfterChangeHook } from 'payload'
import { Resend } from 'resend'
import { reportWarning, reportError } from '@/lib/error-reporting'

const isPlaceholder = (val: string | undefined): boolean => {
  if (!val) return true
  const lower = val.toLowerCase().trim()
  return (
    lower.includes('your_') ||
    lower.includes('your-') ||
    lower.includes('yourdomain') ||
    lower.includes('placeholder')
  )
}

export const sendLeadEmails: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== 'create') return doc

  // Email Automation (requires ENABLE_LEAD_EMAILS=true + RESEND_API_KEY)
  if (process.env.ENABLE_LEAD_EMAILS !== 'true') {
    return doc
  }

  const isProd = process.env.NODE_ENV === 'production'
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || isPlaceholder(apiKey)) {
    if (isProd) {
      throw new Error('[EXVORTA OS] Fatal: RESEND_API_KEY is missing or configured with a placeholder in production.')
    }
    reportWarning('[EXVORTA OS] RESEND_API_KEY is missing or placeholder. Skipping lead email automation in development.')
    return doc
  }

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || isPlaceholder(adminEmail)) {
    if (isProd) {
      throw new Error('[EXVORTA OS] Fatal: ADMIN_EMAIL is missing or configured with a placeholder in production.')
    }
    reportWarning('[EXVORTA OS] ADMIN_EMAIL is missing or placeholder in dev. Skipping admin notification.')
    return doc
  }

  const fromDomain = process.env.EMAIL_FROM_DOMAIN || 'exvorta.com'
  const identifier = doc.company ? `${doc.email} / ${doc.company}` : doc.email
  const resend = new Resend(apiKey)

  try {
    // 1. Auto-reply to lead
    if (doc.email) {
      await resend.emails.send({
        from: `Exvorta <hello@${fromDomain}>`,
        to: doc.email,
        subject: 'We have received your inquiry — Exvorta',
        html: `
          <p>Thank you for reaching out.</p>
          <p>Your inquiry has been received and assigned to our team. We operate with discretion and will respond within one business day.</p>
          <p style="color:#888;font-size:12px;">— Exvorta Operations</p>
        `,
      })
    }

    // 2. Internal admin notification
    const payloadSummary = doc.payload
      ? Object.entries(doc.payload as Record<string, string>)
          .map(([k, v]) => `<tr><th style="text-align:left;background:#f8f9fa;padding:8px">${k}</th><td style="padding:8px">${v}</td></tr>`)
          .join('')
      : '<tr><td colspan="2" style="padding:8px">No additional data</td></tr>'

    await resend.emails.send({
      from: `Exvorta OS <system@${fromDomain}>`,
      to: adminEmail,
      subject: `[LEAD] ${doc.source} — ${identifier}`,
      html: `
        <h2>New Lead — ${doc.source}</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:600px">
          <tr><th style="text-align:left;background:#f8f9fa">Email</th><td><a href="mailto:${doc.email}">${doc.email}</a></td></tr>
          <tr><th style="text-align:left;background:#f8f9fa">Company</th><td>${doc.company || 'N/A'}</td></tr>
          <tr><th style="text-align:left;background:#f8f9fa">Source</th><td>${doc.source}</td></tr>
          ${payloadSummary}
        </table>
      `,
    })
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), {
      context: 'sendLeadEmails',
      leadId: doc.id,
      email: doc.email,
    })
  }

  return doc
}
