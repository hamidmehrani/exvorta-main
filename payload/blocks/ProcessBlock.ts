import { Block } from 'payload'

export const ProcessBlock: Block = {
  slug: 'process',
  interfaceName: 'ProcessBlock',
  fields: [
    { name: 'timeline', type: 'text' },
    { name: 'eyebrow', type: 'text', localized: true },
    // headline is the primary label used in seed-master.ts
    { name: 'headline', type: 'text', localized: true },
    // sectionTitle kept for backwards compatibility
    { name: 'sectionTitle', type: 'text', localized: true },
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Dark Split', value: 'dark-split' },
      ],
      defaultValue: 'default',
    },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'steps',
      dbName: 'process_steps',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'stepNumber', type: 'text', required: true },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'subtitle', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'icon', type: 'text' },
      ],
    },
  ],
}
