import { CollectionAfterChangeHook } from 'payload'
import { Resend } from 'resend'

export const sendLeadEmails: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== 'create') return doc

  // ── Brutalist OS Notification ────────────────────────────────────────────────
  const identifier = doc.company ? `${doc.email} / ${doc.company}` : doc.email
  console.log(`\n╔═══════════════════════════════════════════════════╗`)
  console.log(`║  🔔 [EXVORTA OS] NEW LEAD CAPTURED                ║`)
  console.log(`║  Source  : ${String(doc.source).padEnd(39)}║`)
  console.log(`║  Identity: ${String(identifier).substring(0, 39).padEnd(39)}║`)
  console.log(`║  Status  : ${String(doc.status).padEnd(39)}║`)
  console.log(`╚═══════════════════════════════════════════════════╝\n`)

  // ── Email Automation (optional — requires ENABLE_LEAD_EMAILS=true + RESEND_API_KEY) ───
  if (process.env.ENABLE_LEAD_EMAILS !== 'true') {
    return doc
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[EXVORTA OS] RESEND_API_KEY is missing. Skipping email automation.')
    return doc
  }

  const resend = new Resend(apiKey)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com'
  const fromDomain = process.env.EMAIL_FROM_DOMAIN || 'yourdomain.com'

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
    console.error('[EXVORTA OS] Failed to send lead emails:', err)
  }

  return doc
}
