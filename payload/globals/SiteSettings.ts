import { GlobalConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'theme',
              type: 'group',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  defaultValue: '#D4A843',
                  admin: { description: 'Hex code for the primary brand color' },
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  defaultValue: '#0A0F1E',
                  admin: { description: 'Hex code for the primary background' },
                },
              ],
            },
          ],
        },
        {
          label: 'GDPR & Legal',
          fields: [
            {
              name: 'enableCookieBanner',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'cookieBannerText',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'cookiePolicyUrl',
              type: 'text',
              localized: true,
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              name: 'umamiWebsiteId',
              type: 'text',
              admin: { description: 'Umami Website ID' },
            },
            {
              name: 'umamiScriptUrl',
              type: 'text',
              defaultValue: 'https://cloud.umami.is/script.js',
              admin: { description: 'Umami Script URL' },
            },
          ],
        },
      ],
    },
  ],
}

export default SiteSettings
