import { Block } from 'payload'

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  fields: [
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'value', type: 'text', required: true, localized: true, admin: { description: 'E.g., 99%, 10M+, etc.' } },
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'icon', type: 'text', admin: { description: 'Icon name identifier' } },
      ],
    },
  ],
}
