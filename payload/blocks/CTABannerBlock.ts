import { Block } from 'payload'

export const CTABannerBlock: Block = {
  slug: 'ctaBanner',
  interfaceName: 'CTABannerBlock',
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'label', type: 'text', localized: true },
    { name: 'headline', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'subtext', type: 'text', localized: true },
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
      dbName: 'cta_banner_guar',
      fields: [
        { name: 'text', type: 'text', localized: true },
      ],
    },
  ],
}
