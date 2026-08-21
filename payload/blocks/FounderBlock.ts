import { Block } from 'payload'

export const FounderBlock: Block = {
  slug: 'founder',
  interfaceName: 'FounderBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'quote',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'name',
      type: 'text',
      localized: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'roleTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'roleCompany',
      type: 'text',
      localized: true,
    },
    {
      name: 'imageSrc',
      type: 'text',
    },
    {
      name: 'imageAlt',
      type: 'text',
    }
  ],
}
