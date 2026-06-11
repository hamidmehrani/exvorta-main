import { GlobalConfig } from 'payload'

export const GlobalPromos: GlobalConfig = {
  slug: 'global-promos',
  fields: [
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'message',
      type: 'text',
      localized: true,
    },
    {
      name: 'link',
      type: 'text',
    },
    {
      name: 'position',
      type: 'select',
      options: [
        { label: 'Top Banner', value: 'top-banner' },
        { label: 'Floating Bottom', value: 'floating-bottom' },
      ],
      defaultValue: 'top-banner',
    },
  ],
}

export default GlobalPromos
