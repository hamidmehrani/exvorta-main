import { Block } from 'payload'

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'sectionTitle', type: 'text', localized: true },
    { name: 'subtitle', type: 'text', localized: true },
    {
      name: 'questions',
      type: 'array',
      dbName: 'faq_questions',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}
