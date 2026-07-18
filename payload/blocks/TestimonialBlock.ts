import { Block } from 'payload'

export const TestimonialBlock: Block = {
  slug: 'testimonialBlock',
  interfaceName: 'TestimonialBlock',
  fields: [
    { name: 'sectionTitle', type: 'text', localized: true },
    {
      name: 'manualTestimonials',
      type: 'array',
      fields: [
        { name: 'quote', type: 'textarea', required: true, localized: true },
        { name: 'author', type: 'text', required: true, localized: true },
        { name: 'role', type: 'text', localized: true },
        { name: 'company', type: 'text', localized: true },
      ],
    },
  ],
}
