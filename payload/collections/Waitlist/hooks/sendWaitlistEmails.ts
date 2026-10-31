import { CollectionAfterChangeHook } from 'payload'
import { Resend } from 'resend'
import { reportWarning, reportError } from '@/lib/error-reporting'

export interface WaitlistEmailDoc {
  id?: string | number
  email?: string
  source?: string
  payload?: Record<string, unknown>
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

export function buildWaitlistConfirmationText(doc: WaitlistEmailDoc): string {
  const ref = doc.id ? `REF #${doc.id}` : 'REF #WAITLIST'
  return [
    'EXVORTA // PRIVATE ACCESS',
    ref,
    '------------------------------------------------------------',
    'Private Access Waitlist Confirmed.',
    '',
    'Thank you for requesting access to Exvorta institutional trade infrastructure.',
    '',
    'Our technical operations desk reviews registrations in sequence and operates with strict confidentiality. When your organization\'s access tier is provisioned, our operations team will follow up directly with your technical onboarding credentials.',
    '',
    `COHORT: ${doc.source || 'Standard'}`,
    `IDENTIFIER: ${doc.email || '—'}`,
    'STATUS: QUEUED FOR PRIVATE ACCESS REVIEW',
    '',
    '— Exvorta Operations Desk',
    'Dubai International Financial Centre (DIFC) · Dubai, UAE',
    '------------------------------------------------------------',
    '© 2026 EXVORTA GLOBAL ARCHITECTURES. ALL RIGHTS RESERVED.',
  ].join('\n')
}

export function buildWaitlistConfirmationHtml(doc: WaitlistEmailDoc): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Waitlist Confirmed — Exvorta</title>
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
                    <span style="font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.25em;color:#A3A3A3;text-transform:uppercase;">EXVORTA // PRIVATE ACCESS</span>
                  </td>
                  <td align="right">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:10px;color:#737373;">REF #${doc.id || 'WAITLIST'}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="inner-card" style="padding:36px 32px;">
              <h1 class="headline" style="margin:0 0 16px;font-family:Georgia,Cambria,serif;font-size:26px;font-weight:600;color:#0D0D0D;line-height:1.2;">
                Waitlist Confirmed.
              </h1>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#404040;">
                Thank you for requesting access to Exvorta institutional trade infrastructure.
              </p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#404040;">
                Our technical operations desk reviews registrations in sequence and operates with strict confidentiality. When your organization&#39;s access tier is provisioned, our operations team will follow up directly with your technical onboarding credentials.
              </p>
              <div style="background:#FAFAF8;border-left:2px solid #0D0D0D;padding:16px;margin:24px 0;">
                <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#525252;line-height:1.6;">
                  COHORT: ${doc.source || 'Standard'}<br>
                  IDENTIFIER: ${doc.email || '—'}<br>
                  STATUS: QUEUED FOR PRIVATE ACCESS REVIEW
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

export function buildWaitlistAdminNotificationText(doc: WaitlistEmailDoc, identifier: string): string {
  const ref = doc.id ? `REF #${doc.id}` : 'REF #WAITLIST'
  const lines = [
    'EXVORTA OS // WAITLIST INTAKE',
    ref,
    '------------------------------------------------------------',
    `New Waitlist Registration: ${identifier}`,
    '',
    `ID: ${doc.id || 'N/A'}`,
    `Email: ${doc.email || '—'}`,
    `Source / Cohort: ${doc.source || 'Standard'}`,
  ]

  if (doc.payload && typeof doc.payload === 'object') {
    lines.push('', '--- Payload Attributes ---')
    for (const [key, value] of Object.entries(doc.payload)) {
      lines.push(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value ?? '—')}`)
    }
  }

  lines.push(
    '',
    `Target: ${identifier}`,
    'Status: Queued for private access cohort review',
    '------------------------------------------------------------',
    '© 2026 EXVORTA GLOBAL ARCHITECTURES. ALL RIGHTS RESERVED.'
  )

  return lines.join('\n')
}

export function buildWaitlistAdminNotificationHtml(
  doc: WaitlistEmailDoc,
  identifier: string
): string {
  const row = (label: string, value?: string | null) =>
    `<tr><th style="text-align:left;background:#FAFAF8;padding:10px 14px;font-size:11px;font-family:'Courier New',Courier,monospace;border:1px solid #E5E5E0;color:#525252;width:35%;text-transform:uppercase;letter-spacing:0.05em;">${label}</th><td style="padding:10px 14px;font-size:13px;border:1px solid #E5E5E0;color:#0D0D0D;">${value || '—'}</td></tr>`

  const emailValue = doc.email
    ? `<a href="mailto:${doc.email}" style="color:#0D0D0D;font-weight:500;">${doc.email}</a>`
    : '—'

  const payloadRows = doc.payload && typeof doc.payload === 'object'
    ? Object.entries(doc.payload)
        .map(([k, v]) => `<tr><th style="text-align:left;background:#FAFAF8;padding:10px 14px;font-size:11px;font-family:'Courier New',Courier,monospace;border:1px solid #E5E5E0;color:#525252;width:35%;text-transform:uppercase;letter-spacing:0.05em;">${k}</th><td style="padding:10px 14px;font-size:13px;border:1px solid #E5E5E0;color:#0D0D0D;">${typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}</td></tr>`)
        .join('')
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Waitlist Registration — Exvorta OS</title>
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
                    <span style="font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.25em;color:#A3A3A3;text-transform:uppercase;">EXVORTA OS // WAITLIST INTAKE</span>
                  </td>
                  <td align="right">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:10px;color:#737373;">REF #${doc.id || 'WAITLIST'}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="inner-card" style="padding:36px 32px;">
              <h1 class="headline" style="margin:0 0 20px;font-family:Georgia,Cambria,serif;font-size:24px;font-weight:600;color:#0D0D0D;line-height:1.2;">
                New Waitlist Registration: ${identifier}
              </h1>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:24px;">
                ${row('Registration ID', String(doc.id || 'N/A'))}
                ${row('Email', emailValue)}
                ${row('Source / Cohort', doc.source || 'Standard')}
                ${payloadRows}
              </table>
              <p style="margin:16px 0 0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#737373;line-height:1.6;">
                Target: ${identifier} · Queued for private access cohort review
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

export const sendWaitlistEmails: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== 'create') return doc

  if (process.env.ENABLE_WAITLIST_EMAILS !== 'true') return doc

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || isPlaceholder(apiKey)) {
    reportWarning('[EXVORTA OS] RESEND_API_KEY missing — skipping waitlist email automation.')
    return doc
  }

  const rawAdminEmail = process.env.ADMIN_EMAIL
  const hasAdminEmail = Boolean(rawAdminEmail && !isPlaceholder(rawAdminEmail))
  if (!hasAdminEmail) {
    reportWarning('[EXVORTA OS] ADMIN_EMAIL is missing or placeholder. Skipping admin waitlist notification.')
  }
  const adminEmail = hasAdminEmail ? rawAdminEmail : undefined

  const fromDomain = process.env.EMAIL_FROM_DOMAIN || 'exvorta.com'
  const rawOwnerEmail = process.env.OWNER_EMAIL
  const ownerEmail =
    (rawOwnerEmail && !isPlaceholder(rawOwnerEmail) ? rawOwnerEmail : undefined) ||
    adminEmail ||
    `operations@${fromDomain}`
  const identifier = doc.email || 'Anonymous'
  const resend = new Resend(apiKey)

  try {
    // 1. Subscriber confirmation
    if (doc.email) {
      try {
        const subscriberResult = await resend.emails.send({
          from: `Exvorta <hello@${fromDomain}>`,
          to: doc.email,
          replyTo: ownerEmail,
          subject: 'Exvorta Private Access — Waitlist Confirmed',
          text: buildWaitlistConfirmationText(doc),
          html: buildWaitlistConfirmationHtml(doc),
        })

        if (subscriberResult.error) {
          reportError(
            new Error(`[EXVORTA OS] Resend waitlist confirmation failed: ${subscriberResult.error.message} (${subscriberResult.error.name})`),
            { context: 'sendWaitlistEmails.subscriber', waitlistId: doc.id, email: doc.email }
          )
        }
      } catch (subErr) {
        reportError(subErr instanceof Error ? subErr : new Error(String(subErr)), {
          context: 'sendWaitlistEmails.subscriber',
          waitlistId: doc.id,
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
          subject: `[Waitlist] ${doc.email} — ${doc.source || 'Standard'}`,
          text: buildWaitlistAdminNotificationText(doc, identifier),
          html: buildWaitlistAdminNotificationHtml(doc, identifier),
        })

        if (adminResult.error) {
          reportError(
            new Error(`[EXVORTA OS] Resend waitlist admin dispatch failed: ${adminResult.error.message} (${adminResult.error.name})`),
            { context: 'sendWaitlistEmails.adminNotify', waitlistId: doc.id, email: doc.email }
          )
        }
      } catch (adminErr) {
        reportError(adminErr instanceof Error ? adminErr : new Error(String(adminErr)), {
          context: 'sendWaitlistEmails.adminNotify',
          waitlistId: doc.id,
          email: doc.email,
        })
      }
    }
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), {
      context: 'sendWaitlistEmails',
      waitlistId: doc.id,
      email: doc.email,
    })
  }

  return doc
}
