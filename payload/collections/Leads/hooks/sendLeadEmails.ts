import { CollectionAfterChangeHook } from 'payload'
import { Resend } from 'resend'

export const sendLeadEmails: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation === 'create') {
    if (process.env.ENABLE_LEAD_EMAILS !== 'true') {
      return doc
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      // NOTE: This is OPTIONAL scaffolding for projects that need email automation.
      // If RESEND_API_KEY is not set, this gracefully skips execution without errors.
      console.warn('RESEND_API_KEY is missing. Skipping email automation.')
      return doc
    }

    const resend = new Resend(apiKey)

    try {
      // 1. Auto-reply to lead
      if (doc.email) {
        await resend.emails.send({
          from: 'Contact <hello@yourdomain.com>', // Update with verified domain later
          to: doc.email,
          subject: 'Thank you for reaching out!',
          html: `<p>Hi ${doc.name},</p><p>Thank you for contacting us. We have received your message and will get back to you shortly.</p>`,
        })
      }

      // 2. Notification to admin
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com'
      await resend.emails.send({
        from: 'System <system@yourdomain.com>', // Update with verified domain later
        to: adminEmail,
        subject: `New B2B Lead Captured: ${doc.name}`,
        html: `
          <h2>New Lead Captured</h2>
          <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr>
              <th style="text-align: left; background-color: #f8f9fa;">Name</th>
              <td>${doc.name}</td>
            </tr>
            <tr>
              <th style="text-align: left; background-color: #f8f9fa;">Email</th>
              <td><a href="mailto:${doc.email}">${doc.email}</a></td>
            </tr>
            <tr>
              <th style="text-align: left; background-color: #f8f9fa;">Phone</th>
              <td>${doc.phone || 'N/A'}</td>
            </tr>
            <tr>
              <th style="text-align: left; background-color: #f8f9fa; vertical-align: top;">Message</th>
              <td>${doc.message || 'No message provided.'}</td>
            </tr>
          </table>
        `,
      })
    } catch (err) {
      console.error('Failed to send lead emails:', err)
    }
  }
  return doc
}
