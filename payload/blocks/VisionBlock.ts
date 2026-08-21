import { Block } from 'payload'

export const VisionBlock: Block = {
  slug: 'vision',
  interfaceName: 'VisionBlock',
  fields: [
    { name: 'variant', type: 'text',  defaultValue: 'default' },
    { name: 'principles', type: 'array', dbName: 'principles', fields: [{name: 'number', type: 'text'}, {name: 'title', type: 'text'}, {name: 'subtitle', type: 'text'}, {name: 'description', type: 'textarea'}] },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'headline',
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
    {
      name: 'bottomLabels',
      type: 'array',
      dbName: 'btm_labels',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
