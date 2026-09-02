import { isAdmin } from '../access/isAdmin'
import { GlobalConfig } from 'payload'

export const SEODefaults: GlobalConfig = {
  slug: 'seo-defaults',
  admin: {
    group: 'Global Settings',
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    { name: 'fallbackTitle', type: 'text', localized: true },
    { name: 'fallbackDescription', type: 'textarea', localized: true },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
  ],
}

export default SEODefaults
