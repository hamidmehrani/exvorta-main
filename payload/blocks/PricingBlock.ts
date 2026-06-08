import { Block } from 'payload'

export const PricingBlock: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  fields: [
    { name: 'sectionTitle', type: 'text', localized: true },
    { name: 'sectionSubtitle', type: 'textarea', localized: true },
    {
      name: 'tiers',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'tierName', type: 'text', required: true, localized: true },
        { name: 'price', type: 'text', required: true, localized: true },
        { name: 'highlight', type: 'checkbox', defaultValue: false },
        {
          name: 'features',
          type: 'array',
          fields: [
            { name: 'feature', type: 'text', required: true, localized: true },
          ],
        },
        {
          name: 'cta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
