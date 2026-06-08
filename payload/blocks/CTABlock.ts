import { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
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
  ],
}
