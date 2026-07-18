import { Block } from 'payload'

export const CTABannerBlock: Block = {
  slug: 'ctaBanner',
  interfaceName: 'CTABannerBlock',
  fields: [
    { name: 'label', type: 'text', localized: true },
    { name: 'headline', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'primaryCTA',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'secondaryCTA',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'guarantees',
      type: 'array',
      fields: [
        { name: 'text', type: 'text', localized: true },
      ],
    },
  ],
}
