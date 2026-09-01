import { CollectionAfterChangeHook } from 'payload'
import { Resend } from 'resend'

/**
 * RFQ email automation — fires on every new form-submissions doc.
 *
 * Required env:
 *   RESEND_API_KEY   — Resend API key
 *   ADMIN_EMAIL      — internal inbox for notifications
 *   EMAIL_FROM_DOMAIN— verified sending domain
 * Optional:
 *   ENABLE_RFQ_EMAILS — 'true' to enable (lets staging run silent)
 */
export const sendRFQEmails: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== 'create') return doc

  const identifier = doc.companyName ? `${doc.email} / ${doc.companyName}` : doc.email
  console.log(`\n╔═══════════════════════════════════════════════════╗`)
  console.log(`║  🔔 [EXVORTA OS] NEW RFQ RECEIVED                 ║`)
  console.log(`║  Identity: ${String(identifier).substring(0, 39).padEnd(39)}║`)
  console.log(`║  Budget  : ${String(doc.budget || '—').padEnd(39)}║`)
  console.log(`╚═══════════════════════════════════════════════════╝\n`)

  if (process.env.ENABLE_RFQ_EMAILS !== 'true') return doc

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[EXVORTA OS] RESEND_API_KEY missing — skipping RFQ email automation.')
    return doc
  }

  const resend = new Resend(apiKey)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com'
  const fromDomain = process.env.EMAIL_FROM_DOMAIN || 'yourdomain.com'

  const row = (label: string, value?: string | null) =>
    `<tr><th style="text-align:left;background:#f8f9fa;padding:8px;width:140px">${label}</th><td style="padding:8px">${value || '—'}</td></tr>`

  try {
    // 1. Client acknowledgment — sets expectations (24h review SLA)
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

    // 2. Internal dispatch notification — full RFQ detail for fast triage
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
    console.error('[EXVORTA OS] Failed to send RFQ emails:', err)
  }

  return doc
}
