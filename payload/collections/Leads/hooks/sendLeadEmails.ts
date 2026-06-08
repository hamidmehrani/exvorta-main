import { CollectionAfterChangeHook } from 'payload'
import { Resend } from 'resend'

export const sendLeadEmails: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation === 'create') {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
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
        subject: 'New Lead Received',
        html: `<p><strong>New Lead Details:</strong></p>
               <p>Name: ${doc.name}</p>
               <p>Email: ${doc.email}</p>
               <p>Phone: ${doc.phone || 'N/A'}</p>
               <p>Message: ${doc.message}</p>`,
      })
    } catch (err) {
      console.error('Failed to send lead emails:', err)
    }
  }
  return doc
}
