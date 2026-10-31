import { CollectionAfterChangeHook } from 'payload'
import { Resend } from 'resend'
import { reportWarning, reportError } from '@/lib/error-reporting'

export interface RFQEmailDoc {
  id?: string | number
  name?: string
  email?: string
  companyName?: string
  businessType?: string
  mainMarkets?: string
  budget?: string
  message?: string
  status?: string
  [key: string]: unknown
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

export function buildRFQClientConfirmationText(doc: RFQEmailDoc): string {
  const ref = doc.id ? `REF #${doc.id}` : 'REF #RFQ'
  return [
    'EXVORTA // PROPOSAL DESK',
    ref,
    '------------------------------------------------------------',
    `Dear ${doc.name || 'Valued Partner'},`,
    '',
    'Your Request for Quotation (RFQ) has been logged and assigned to our direct engineering desk.',
    '',
    'Our engineering team reviews technical specifications directly and operates with strict confidentiality. Each inquiry is assigned for institutional engineering desk review, and our operations team will follow up directly regarding your technical specifications.',
    '',
    `ORGANIZATION: ${doc.companyName || 'Private Enterprise'}`,
    `BUSINESS TYPE: ${doc.businessType || 'Export / Global Trade'}`,
    `BUDGET BRACKET: ${doc.budget || 'Standard Tier'}`,
    'STATUS: SCOPING & ARCHITECTURE IN REVIEW',
    '',
    '— Exvorta Technical Operations',
    'Dubai International Financial Centre (DIFC) · Dubai, UAE',
    '------------------------------------------------------------',
    '© 2026 EXVORTA GLOBAL ARCHITECTURES. ALL RIGHTS RESERVED.',
  ].join('\n')
}

export function buildRFQClientConfirmationHtml(doc: RFQEmailDoc): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RFQ Received — Exvorta</title>
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
                    <span style="font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.25em;color:#A3A3A3;text-transform:uppercase;">EXVORTA // PROPOSAL DESK</span>
                  </td>
                  <td align="right">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:10px;color:#737373;">REF #${doc.id || 'RFQ'}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="inner-card" style="padding:36px 32px;">
              <h1 class="headline" style="margin:0 0 16px;font-family:Georgia,Cambria,serif;font-size:26px;font-weight:600;color:#0D0D0D;line-height:1.2;">
                Dear ${doc.name || 'Valued Partner'},
              </h1>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#404040;">
                Your Request for Quotation (RFQ) has been logged and assigned to our direct engineering desk.
              </p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#404040;">
                Our engineering team reviews technical specifications directly and operates with strict confidentiality. Each inquiry is assigned for institutional engineering desk review, and our operations team will follow up directly regarding your technical specifications.
              </p>
              <div style="background:#FAFAF8;border-left:2px solid #0D0D0D;padding:16px;margin:24px 0;">
                <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#525252;line-height:1.6;">
                  ORGANIZATION: ${doc.companyName || 'Private Enterprise'}<br>
                  BUSINESS TYPE: ${doc.businessType || 'Export / Global Trade'}<br>
                  BUDGET BRACKET: ${doc.budget || 'Standard Tier'}<br>
                  STATUS: SCOPING & ARCHITECTURE IN REVIEW
                </p>
              </div>
              <p style="margin:28px 0 0;font-size:13px;color:#737373;line-height:1.5;">
                — Exvorta Technical Operations<br>
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

export function buildRFQAdminNotificationText(doc: RFQEmailDoc, identifier: string): string {
  const ref = doc.id ? `REF #${doc.id}` : 'REF #RFQ'
  const lines = [
    'EXVORTA OS // PROPOSAL INTAKE',
    ref,
    '------------------------------------------------------------',
    `New RFQ: ${identifier}`,
    '',
    `Submission ID: ${doc.id || 'N/A'}`,
    `Contact Name: ${doc.name || '—'}`,
    `Email: ${doc.email || '—'}`,
    `Company: ${doc.companyName || '—'}`,
    `Business Sector: ${doc.businessType || '—'}`,
    `Target Markets: ${doc.mainMarkets || '—'}`,
    `Budget Bracket: ${doc.budget || '—'}`,
  ]

  if (doc.message) {
    lines.push(`Project Brief: ${doc.message}`)
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

export function buildRFQAdminNotificationHtml(
  doc: RFQEmailDoc,
  identifier: string
): string {
  const row = (label: string, value?: string | null) =>
    `<tr><th style="text-align:left;background:#FAFAF8;padding:10px 14px;font-size:11px;font-family:'Courier New',Courier,monospace;border:1px solid #E5E5E0;color:#525252;width:35%;text-transform:uppercase;letter-spacing:0.05em;">${label}</th><td style="padding:10px 14px;font-size:13px;border:1px solid #E5E5E0;color:#0D0D0D;">${value || '—'}</td></tr>`

  const emailValue = doc.email
    ? `<a href="mailto:${doc.email}" style="color:#0D0D0D;font-weight:500;">${doc.email}</a>`
    : '—'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New RFQ — Exvorta OS</title>
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
                    <span style="font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.25em;color:#A3A3A3;text-transform:uppercase;">EXVORTA OS // PROPOSAL INTAKE</span>
                  </td>
                  <td align="right">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:10px;color:#737373;">REF #${doc.id || 'RFQ'}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="inner-card" style="padding:36px 32px;">
              <h1 class="headline" style="margin:0 0 20px;font-family:Georgia,Cambria,serif;font-size:24px;font-weight:600;color:#0D0D0D;line-height:1.2;">
                New RFQ: ${identifier}
              </h1>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:24px;">
                ${row('Submission ID', String(doc.id || 'N/A'))}
                ${row('Contact Name', doc.name)}
                ${row('Email', emailValue)}
                ${row('Company', doc.companyName)}
                ${row('Business Sector', doc.businessType)}
                ${row('Target Markets', doc.mainMarkets)}
                ${row('Budget Bracket', doc.budget)}
                ${row('Project Brief', doc.message)}
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

export const sendRFQEmails: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== 'create') return doc

  if (process.env.ENABLE_RFQ_EMAILS !== 'true') return doc

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || isPlaceholder(apiKey)) {
    reportWarning('[EXVORTA OS] RESEND_API_KEY missing — skipping RFQ email automation.')
    return doc
  }

  const rawAdminEmail = process.env.ADMIN_EMAIL
  const hasAdminEmail = Boolean(rawAdminEmail && !isPlaceholder(rawAdminEmail))
  if (!hasAdminEmail) {
    reportWarning('[EXVORTA OS] ADMIN_EMAIL is missing or placeholder. Skipping admin RFQ notification.')
  }
  const adminEmail = hasAdminEmail ? rawAdminEmail : undefined

  const fromDomain = process.env.EMAIL_FROM_DOMAIN || 'exvorta.com'
  const rawOwnerEmail = process.env.OWNER_EMAIL
  const ownerEmail =
    (rawOwnerEmail && !isPlaceholder(rawOwnerEmail) ? rawOwnerEmail : undefined) ||
    adminEmail ||
    `operations@${fromDomain}`
  const identifier = doc.companyName ? `${doc.email || '—'} / ${doc.companyName}` : (doc.email || 'Anonymous')
  const resend = new Resend(apiKey)

  try {
    // 1. Client acknowledgment
    if (doc.email) {
      try {
        const clientResult = await resend.emails.send({
          from: `Exvorta <hello@${fromDomain}>`,
          to: doc.email,
          replyTo: ownerEmail,
          subject: 'Your RFQ has been received — Exvorta',
          html: buildRFQClientConfirmationHtml(doc),
          text: buildRFQClientConfirmationText(doc),
        })

        if (clientResult.error) {
          reportError(
            new Error(`[EXVORTA OS] Resend RFQ client auto-reply failed: ${clientResult.error.message} (${clientResult.error.name})`),
            { context: 'sendRFQEmails.clientReply', submissionId: doc.id, email: doc.email }
          )
        }
      } catch (clientErr) {
        reportError(clientErr instanceof Error ? clientErr : new Error(String(clientErr)), {
          context: 'sendRFQEmails.clientReply',
          submissionId: doc.id,
          email: doc.email,
        })
      }
    }

    // 2. Internal dispatch notification
    if (adminEmail) {
      try {
        const adminResult = await resend.emails.send({
          from: `Exvorta OS <system@${fromDomain}>`,
          to: adminEmail,
          ...(doc.email ? { replyTo: doc.email } : {}),
          subject: `[RFQ] ${identifier} — ${doc.budget || 'budget N/A'}`,
          html: buildRFQAdminNotificationHtml(doc, identifier),
          text: buildRFQAdminNotificationText(doc, identifier),
        })

        if (adminResult.error) {
          reportError(
            new Error(`[EXVORTA OS] Resend RFQ admin dispatch failed: ${adminResult.error.message} (${adminResult.error.name})`),
            { context: 'sendRFQEmails.adminNotify', submissionId: doc.id, email: doc.email }
          )
        }
      } catch (adminErr) {
        reportError(adminErr instanceof Error ? adminErr : new Error(String(adminErr)), {
          context: 'sendRFQEmails.adminNotify',
          submissionId: doc.id,
          email: doc.email,
        })
      }
    }
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), {
      context: 'sendRFQEmails',
      submissionId: doc.id,
      email: doc.email,
    })
  }

  return doc
}
