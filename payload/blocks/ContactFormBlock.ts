import { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'subtitle', type: 'textarea', localized: true },
    { name: 'enableWhatsApp', type: 'checkbox', defaultValue: true, admin: { description: 'Show WhatsApp fallback button' } },
  ],
}
