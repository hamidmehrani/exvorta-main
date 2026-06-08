import { GlobalConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const CookieConsent: GlobalConfig = {
  slug: 'cookie-consent',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    { name: 'enable', type: 'checkbox', defaultValue: true },
    { name: 'message', type: 'textarea', required: true, localized: true, defaultValue: 'We use cookies to ensure you get the best experience on our website.' },
    { name: 'acceptLabel', type: 'text', required: true, localized: true, defaultValue: 'Accept' },
    { name: 'declineLabel', type: 'text', required: true, localized: true, defaultValue: 'Decline' },
  ],
}

export default CookieConsent
