import { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    { name: 'theme', type: 'text', defaultValue: 'default' },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subheadline',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'primaryCTA',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'url', type: 'text', localized: true },
      ],
    },
    {
      name: 'secondaryCTA',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'url', type: 'text', localized: true },
      ],
    },
    {
      name: 'microcopy',
      type: 'array',
      dbName: 'hero_microcopy',
      fields: [
        { name: 'text', type: 'text', localized: true },
      ],
    },
    { name: 'scrollText', type: 'text', localized: true },
    { name: 'bottomLabel', type: 'text', localized: true },
    { name: 'showDashboard', type: 'checkbox', defaultValue: false },
    { name: 'hideDashboard', type: 'checkbox', defaultValue: false },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
