import { Block } from 'payload'

export const RoadmapBlock: Block = {
  slug: 'roadmap',
  interfaceName: 'RoadmapBlock',
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
      name: 'phases',
      type: 'array',
      dbName: 'roadmap_phases',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
      ],
    },
    {
      name: 'vision',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'buttonLabel',
      type: 'text',
    },
  ],
}
