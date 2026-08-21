import { Block } from 'payload'

export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  fields: [
    { name: 'sectionEyebrow', type: 'text', localized: true },
    { name: 'eyebrow', type: 'text', localized: true },
    {
      name: 'sectionTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'theme',
      type: 'select',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark (Columns)', value: 'dark' },
        { label: 'Dark (Cards)', value: 'dark-cards' },
        { label: 'Dark Principles', value: 'dark-principles' },
        { label: 'Light Columns', value: 'light-columns' },
      ],
      defaultValue: 'light',
    },
    {
      name: 'layout',
      type: 'text',
      defaultValue: '3-col',
      admin: { description: 'Grid layout: 3-col or 4-col' },
    },
    {
      name: 'features',
      dbName: 'fg_feats',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Icon name (e.g., from Lucide or similar library)',
          },
        },
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
      ],
    },
  ],
}
