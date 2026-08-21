import { Block } from 'payload'

export const FeatureShowcaseBlock: Block = {
  slug: 'featureShowcase',
  interfaceName: 'FeatureShowcaseBlock',
  fields: [
    {
      name: 'label',
      type: 'text',
      localized: true,
      admin: {
        description: 'Small uppercase label (e.g., SaaS Application Design)',
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
    {
      name: 'features',
      type: 'array',
      dbName: 'fshow_feats',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      localized: true,
    },
    {
      name: 'ctaUrl',
      type: 'text',
      localized: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'mediaPosition',
      type: 'text',
      defaultValue: 'left',
    },
  ],
}
