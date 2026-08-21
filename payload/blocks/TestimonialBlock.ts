import { Block } from 'payload'

export const TestimonialBlock: Block = {
  slug: 'testimonialBlock',
  interfaceName: 'TestimonialBlock',
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'sectionTitle', type: 'text', localized: true },
    // Static quote mode — used in seed-master.ts web page testimonial
    { name: 'quote', type: 'textarea', localized: true },
    { name: 'quoteAuthor', type: 'text', localized: true },
    { name: 'guaranteeTitle', type: 'text', localized: true },
    { name: 'guaranteeText', type: 'textarea', localized: true },
    { name: 'guaranteeSignature', type: 'text', localized: true },
    {
      name: 'manualTestimonials',
      type: 'array',
      dbName: 'man_testimonials',
      fields: [
        { name: 'quote', type: 'textarea', required: true, localized: true },
        { name: 'author', type: 'text', required: true, localized: true },
        { name: 'role', type: 'text', localized: true },
        { name: 'company', type: 'text', localized: true },
      ],
    },
  ],
}
