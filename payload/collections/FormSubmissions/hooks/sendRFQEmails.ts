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

export const sendRFQEmails: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== 'create') return doc

  if (process.env.ENABLE_RFQ_EMAILS !== 'true') return doc

  const isProd = process.env.NODE_ENV === 'production'
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || isPlaceholder(apiKey)) {
    if (isProd) {
      throw new Error('[EXVORTA OS] Fatal: RESEND_API_KEY is missing or configured with a placeholder in production.')
    }
    reportWarning('[EXVORTA OS] RESEND_API_KEY missing — skipping RFQ email automation in development.')
    return doc
  }

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || isPlaceholder(adminEmail)) {
    if (isProd) {
      throw new Error('[EXVORTA OS] Fatal: ADMIN_EMAIL is missing or configured with a default/placeholder in production.')
    }
    reportWarning('[EXVORTA OS] ADMIN_EMAIL is missing or placeholder in dev. Skipping admin RFQ notification.')
    return doc
  }

  const fromDomain = process.env.EMAIL_FROM_DOMAIN || 'exvorta.com'
  const identifier = doc.companyName ? `${doc.email} / ${doc.companyName}` : doc.email
  const resend = new Resend(apiKey)

  const row = (label: string, value?: string | null) =>
    `<tr><th style="text-align:left;background:#f8f9fa;padding:8px;width:140px">${label}</th><td style="padding:8px">${value || '—'}</td></tr>`

  try {
    // 1. Client acknowledgment
    if (doc.email) {
      await resend.emails.send({
        from: `Exvorta <hello@${fromDomain}>`,
        to: doc.email,
        subject: 'Your RFQ has been received — Exvorta',
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#0D0D0D">
            <p style="font-size:13px;letter-spacing:3px;color:#888;text-transform:uppercase">EXVORTA</p>
            <h2 style="font-weight:600">Dear ${doc.name},</h2>
            <p style="line-height:1.7;color:#333">Your request for quotation has been received and logged. An engineering director will review your requirements and respond within <strong>one business day</strong>.</p>
            <p style="line-height:1.7;color:#333">Reference: <strong>${doc.id}</strong></p>
            <p style="color:#888;font-size:12px;margin-top:32px">— Exvorta Operations · Dubai, UAE</p>
          </div>
        `,
      })
    }

    // 2. Internal dispatch notification
    await resend.emails.send({
      from: `Exvorta OS <system@${fromDomain}>`,
      to: adminEmail,
      subject: `[RFQ] ${identifier} — ${doc.budget || 'budget N/A'}`,
      html: `
        <h2>New RFQ Submission</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px">
          ${row('Name', doc.name)}
          ${row('Email', `<a href="mailto:${doc.email}">${doc.email}</a>`)}
          ${row('Company', doc.companyName)}
          ${row('Business Type', doc.businessType)}
          ${row('Main Markets', doc.mainMarkets)}
          ${row('Budget', doc.budget)}
          ${row('Message', doc.message)}
        </table>
        <p style="color:#888;font-size:12px">Review & set status in the admin panel →</p>
      `,
    })
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), {
      context: 'sendRFQEmails',
      submissionId: doc.id,
      email: doc.email,
    })
  }

  return doc
}
