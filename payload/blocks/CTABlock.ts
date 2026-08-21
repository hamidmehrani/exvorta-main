import { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  fields: [
    {
      name: 'theme',
      type: 'select',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      defaultValue: 'light',
    },
    { name: 'eyebrow', type: 'text', localized: true },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'buttonUrl',
      type: 'text',
      required: true,
      localized: true,
    },
    { name: 'secondaryButtonText', type: 'text', localized: true },
    { name: 'secondaryButtonUrl', type: 'text', localized: true },
    { name: 'disclaimer', type: 'text', localized: true },
  ],
}
