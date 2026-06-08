import { Block } from 'payload'

export const MarqueeBlock: Block = {
  slug: 'marquee',
  interfaceName: 'MarqueeBlock',
  fields: [
    { name: 'sectionTitle', type: 'text', localized: true },
    {
      name: 'logos',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}
