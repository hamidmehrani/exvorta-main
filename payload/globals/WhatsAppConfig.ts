import { isAdmin } from '../access/isAdmin'
import { GlobalConfig } from 'payload'

export const WhatsAppConfig: GlobalConfig = {
  slug: 'whatsapp-config',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    { name: 'enableWidget', type: 'checkbox', defaultValue: false },
    { name: 'phoneNumber', type: 'text', admin: { description: 'Include country code without +, e.g., 971501234567' } },
    { name: 'defaultMessage', type: 'textarea', localized: true },
  ],
}

export default WhatsAppConfig
