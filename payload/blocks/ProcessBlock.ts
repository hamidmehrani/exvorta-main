import { Block } from 'payload'

export const ProcessBlock: Block = {
  slug: 'process',
  interfaceName: 'ProcessBlock',
  fields: [
    { name: 'sectionTitle', type: 'text', localized: true },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'stepNumber', type: 'text', required: true },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'icon', type: 'text' },
      ],
    },
  ],
}
