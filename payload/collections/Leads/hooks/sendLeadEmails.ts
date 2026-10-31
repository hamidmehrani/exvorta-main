import { CollectionAfterChangeHook } from 'payload'
import { Resend } from 'resend'
import { reportWarning, reportError } from '@/lib/error-reporting'

export interface LeadEmailDoc {
  id?: string | number
  email?: string
  company?: string
  source?: string
  payload?: unknown
}

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

export function buildLeadAutoReplyText(doc: LeadEmailDoc): string {
  const ref = doc.id ? `REF #${doc.id}` : 'REF #INQ'
  return [
    'EXVORTA // INFRASTRUCTURE',
    ref,
    '------------------------------------------------------------',
    'Inquiry Received.',
    '',
    'Thank you for contacting Exvorta. We have logged your submission regarding institutional digital infrastructure.',
    '',
    'Our engineering team reviews briefs directly and operates with strict confidentiality. Each inquiry is assigned for institutional engineering desk review, and our operations team will follow up directly regarding your technical specifications.',
    '',
    `CHANNEL: ${doc.source || 'Direct Website'}`,
    `REPRESENTING: ${doc.company || 'Private Enterprise'}`,
    'STATUS: QUEUED FOR ENGINEERING DESK REVIEW',
    '',
    '— Exvorta Operations Desk',
    'Dubai International Financial Centre (DIFC) · Dubai, UAE',
    '------------------------------------------------------------',
    '© 2026 EXVORTA GLOBAL ARCHITECTURES. ALL RIGHTS RESERVED.',
  ].join('\n')
}

export function buildLeadAutoReplyHtml(doc: LeadEmailDoc): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Received — Exvorta</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .inner-card { padding: 24px 18px !important; }
      .headline { font-size: 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0D0D0D;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FAFAF8;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" class="container" style="max-width:600px;width:100%;border-collapse:collapse;background:#FFFFFF;border:1px solid #E5E5E0;">
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid #E5E5E0;background:#0D0D0D;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.25em;color:#A3A3A3;text-transform:uppercase;">EXVORTA // INFRASTRUCTURE</span>
                  </td>
                  <td align="right">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:10px;color:#737373;">REF #${doc.id || 'INQ'}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="inner-card" style="padding:36px 32px;">
              <h1 class="headline" style="margin:0 0 16px;font-family:Georgia,Cambria,serif;font-size:26px;font-weight:600;color:#0D0D0D;line-height:1.2;">
                Inquiry Received.
              </h1>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#404040;">
                Thank you for contacting Exvorta. We have logged your submission regarding institutional digital infrastructure.
              </p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#404040;">
                Our engineering team reviews briefs directly and operates with strict confidentiality. Each inquiry is assigned for institutional engineering desk review, and our operations team will follow up directly regarding your technical specifications.
              </p>
              <div style="background:#FAFAF8;border-left:2px solid #0D0D0D;padding:16px;margin:24px 0;">
                <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#525252;line-height:1.6;">
                  CHANNEL: ${doc.source || 'Direct Website'}<br>
                  REPRESENTING: ${doc.company || 'Private Enterprise'}<br>
                  STATUS: QUEUED FOR ENGINEERING DESK REVIEW
                </p>
              </div>
              <p style="margin:28px 0 0;font-size:13px;color:#737373;line-height:1.5;">
                — Exvorta Operations Desk<br>
                Dubai International Financial Centre (DIFC) · Dubai, UAE
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#F5F5F0;border-top:1px solid #E5E5E0;text-align:center;">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.15em;color:#737373;text-transform:uppercase;">
                © 2026 EXVORTA GLOBAL ARCHITECTURES. ALL RIGHTS RESERVED.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function buildLeadAdminNotificationText(doc: LeadEmailDoc, identifier: string): string {
  const ref = doc.id ? `REF #${doc.id}` : 'REF #INQ'
  const lines = [
    'EXVORTA OS // INTAKE DISPATCH',
    ref,
    '------------------------------------------------------------',
    `New Lead Captured: ${doc.source || 'Website'}`,
    '',
    `ID: ${doc.id || 'N/A'}`,
    `Email: ${doc.email || '—'}`,
    `Company: ${doc.company || '—'}`,
    `Source: ${doc.source || 'Website'}`,
  ]

  if (doc.payload && typeof doc.payload === 'object') {
    lines.push('', '--- Payload Attributes ---')
    for (const [key, value] of Object.entries(doc.payload as Record<string, unknown>)) {
      lines.push(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value ?? '—')}`)
    }
  }

  lines.push(
    '',
    `Target: ${identifier}`,
    'Status: Queued for institutional desk review',
    '------------------------------------------------------------',
    '© 2026 EXVORTA GLOBAL ARCHITECTURES. ALL RIGHTS RESERVED.'
  )

  return lines.join('\n')
}

export function buildLeadAdminNotificationHtml(doc: LeadEmailDoc, identifier: string): string {
  const payloadRows = doc.payload && typeof doc.payload === 'object'
    ? Object.entries(doc.payload as Record<string, unknown>)
        .map(([k, v]) => `<tr><th style="text-align:left;background:#FAFAF8;padding:10px 14px;font-size:11px;font-family:'Courier New',Courier,monospace;border:1px solid #E5E5E0;color:#525252;width:35%;text-transform:uppercase;letter-spacing:0.05em;">${k}</th><td style="padding:10px 14px;font-size:13px;border:1px solid #E5E5E0;color:#0D0D0D;">${typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}</td></tr>`)
        .join('')
    : '<tr><td colspan="2" style="padding:10px 14px;font-size:13px;color:#737373;border:1px solid #E5E5E0;">No additional payload attributes</td></tr>'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead — Exvorta OS</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .inner-card { padding: 24px 18px !important; }
      .headline { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0D0D0D;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FAFAF8;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" class="container" style="max-width:600px;width:100%;border-collapse:collapse;background:#FFFFFF;border:1px solid #E5E5E0;">
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid #E5E5E0;background:#0D0D0D;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.25em;color:#A3A3A3;text-transform:uppercase;">EXVORTA OS // INTAKE DISPATCH</span>
                  </td>
                  <td align="right">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:10px;color:#737373;">REF #${doc.id || 'INQ'}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="inner-card" style="padding:36px 32px;">
              <h1 class="headline" style="margin:0 0 20px;font-family:Georgia,Cambria,serif;font-size:24px;font-weight:600;color:#0D0D0D;line-height:1.2;">
                New Lead Captured: ${doc.source || 'Website'}
              </h1>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:24px;">
                <tr><th style="text-align:left;background:#FAFAF8;padding:10px 14px;font-size:11px;font-family:'Courier New',Courier,monospace;border:1px solid #E5E5E0;color:#525252;width:35%;text-transform:uppercase;letter-spacing:0.05em;">ID</th><td style="padding:10px 14px;font-size:13px;border:1px solid #E5E5E0;color:#0D0D0D;">${doc.id || 'N/A'}</td></tr>
                <tr><th style="text-align:left;background:#FAFAF8;padding:10px 14px;font-size:11px;font-family:'Courier New',Courier,monospace;border:1px solid #E5E5E0;color:#525252;width:35%;text-transform:uppercase;letter-spacing:0.05em;">Email</th><td style="padding:10px 14px;font-size:13px;border:1px solid #E5E5E0;color:#0D0D0D;"><a href="mailto:${doc.email}" style="color:#0D0D0D;font-weight:500;">${doc.email}</a></td></tr>
                <tr><th style="text-align:left;background:#FAFAF8;padding:10px 14px;font-size:11px;font-family:'Courier New',Courier,monospace;border:1px solid #E5E5E0;color:#525252;width:35%;text-transform:uppercase;letter-spacing:0.05em;">Company</th><td style="padding:10px 14px;font-size:13px;border:1px solid #E5E5E0;color:#0D0D0D;">${doc.company || '—'}</td></tr>
                <tr><th style="text-align:left;background:#FAFAF8;padding:10px 14px;font-size:11px;font-family:'Courier New',Courier,monospace;border:1px solid #E5E5E0;color:#525252;width:35%;text-transform:uppercase;letter-spacing:0.05em;">Source</th><td style="padding:10px 14px;font-size:13px;border:1px solid #E5E5E0;color:#0D0D0D;"><span style="background:#FAFAF8;border:1px solid #E5E5E0;padding:2px 8px;font-family:'Courier New',Courier,monospace;font-size:11px;">${doc.source || 'Website'}</span></td></tr>
                ${payloadRows}
              </table>
              <p style="margin:16px 0 0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#737373;line-height:1.6;">
                Target: ${identifier} · Queued for institutional desk review
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#F5F5F0;border-top:1px solid #E5E5E0;text-align:center;">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.15em;color:#737373;text-transform:uppercase;">
                © 2026 EXVORTA GLOBAL ARCHITECTURES. ALL RIGHTS RESERVED.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export const sendLeadEmails: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== 'create') return doc

  // Email Automation (requires ENABLE_LEAD_EMAILS=true + RESEND_API_KEY)
  if (process.env.ENABLE_LEAD_EMAILS !== 'true') {
    return doc
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || isPlaceholder(apiKey)) {
    reportWarning('[EXVORTA OS] RESEND_API_KEY is missing or placeholder. Skipping lead email automation.')
    return doc
  }

  const rawAdminEmail = process.env.ADMIN_EMAIL
  const hasAdminEmail = Boolean(rawAdminEmail && !isPlaceholder(rawAdminEmail))
  if (!hasAdminEmail) {
    reportWarning('[EXVORTA OS] ADMIN_EMAIL is missing or placeholder. Skipping admin notification.')
  }
  const adminEmail = hasAdminEmail ? rawAdminEmail : undefined

  const fromDomain = process.env.EMAIL_FROM_DOMAIN || 'exvorta.com'
  const rawOwnerEmail = process.env.OWNER_EMAIL
  const ownerEmail =
    (rawOwnerEmail && !isPlaceholder(rawOwnerEmail) ? rawOwnerEmail : undefined) ||
    adminEmail ||
    `operations@${fromDomain}`
  const identifier = doc.company ? `${doc.email} / ${doc.company}` : (doc.email || 'Anonymous')
  const resend = new Resend(apiKey)

  try {
    // 1. Auto-reply to lead
    if (doc.email) {
      try {
        const autoReplyResult = await resend.emails.send({
          from: `Exvorta <hello@${fromDomain}>`,
          to: doc.email,
          replyTo: ownerEmail,
          subject: 'We have received your inquiry — Exvorta',
          html: buildLeadAutoReplyHtml(doc),
          text: buildLeadAutoReplyText(doc),
        })

        if (autoReplyResult.error) {
          reportError(
            new Error(`[EXVORTA OS] Resend lead auto-reply failed: ${autoReplyResult.error.message} (${autoReplyResult.error.name})`),
            { context: 'sendLeadEmails.autoReply', leadId: doc.id, email: doc.email }
          )
        }
      } catch (autoErr) {
        reportError(autoErr instanceof Error ? autoErr : new Error(String(autoErr)), {
          context: 'sendLeadEmails.autoReply',
          leadId: doc.id,
          email: doc.email,
        })
      }
    }

    // 2. Internal admin notification
    if (adminEmail) {
      try {
        const adminResult = await resend.emails.send({
          from: `Exvorta OS <system@${fromDomain}>`,
          to: adminEmail,
          ...(doc.email ? { replyTo: doc.email } : {}),
          subject: `[LEAD] ${doc.source || 'Website'} — ${identifier}`,
          html: buildLeadAdminNotificationHtml(doc, identifier),
          text: buildLeadAdminNotificationText(doc, identifier),
        })

        if (adminResult.error) {
          reportError(
            new Error(`[EXVORTA OS] Resend lead admin dispatch failed: ${adminResult.error.message} (${adminResult.error.name})`),
            { context: 'sendLeadEmails.adminNotify', leadId: doc.id, email: doc.email }
          )
        }
      } catch (adminErr) {
        reportError(adminErr instanceof Error ? adminErr : new Error(String(adminErr)), {
          context: 'sendLeadEmails.adminNotify',
          leadId: doc.id,
          email: doc.email,
        })
      }
    }
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), {
      context: 'sendLeadEmails',
      leadId: doc.id,
      email: doc.email,
    })
  }

  return doc
}
