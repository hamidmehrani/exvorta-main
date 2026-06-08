import { Block } from 'payload'

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  fields: [
    { name: 'sectionTitle', type: 'text', localized: true },
    {
      name: 'questions',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}
