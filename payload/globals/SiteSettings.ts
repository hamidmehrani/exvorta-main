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
              name: 'maintenanceMode',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Enable to put the entire site into maintenance mode.' },
            },
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
              label: 'Brand Logo',
              admin: {
                description:
                  'Shown in the header & footer. Transparent PNG/SVG recommended, ~64px height. Remove to fall back to the text wordmark.',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon / App Icon',
              admin: {
                description:
                  'Browser tab + PWA icon. Square PNG 512×512 recommended. Applied site-wide after save.',
              },
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
