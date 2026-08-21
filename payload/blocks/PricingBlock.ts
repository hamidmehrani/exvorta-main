import { Block } from 'payload'

export const PricingBlock: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'sectionTitleSuffix', type: 'text' },
    { name: 'sectionTitle', type: 'text', localized: true },
    { name: 'sectionSubtitle', type: 'textarea', localized: true },
    {
      name: 'tiers',
      dbName: 'prc_tiers',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'tierName', type: 'text', required: true, localized: true },
        { name: 'tierSubtitle', type: 'text' },
        { name: 'price', type: 'text', required: true, localized: true },
        { name: 'highlight', type: 'checkbox', defaultValue: false },
        {
          name: 'features',
          dbName: 'prc_tier_feats',
          type: 'array',
          fields: [
            { name: 'feature', type: 'text', required: true, localized: true },
          ],
        },
        {
          name: 'cta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', localized: true },
            { name: 'url', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [{ name: 'label', type: 'text' }, { name: 'url', type: 'text' }]
    }
  ],
}
