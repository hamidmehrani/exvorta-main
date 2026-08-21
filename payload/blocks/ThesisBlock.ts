import { Block } from 'payload'

export const ThesisBlock: Block = {
  slug: 'thesis',
  interfaceName: 'ThesisBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'headline',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'paragraphs',
      type: 'array',
      dbName: 'thesis_paras',
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
