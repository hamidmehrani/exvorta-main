import { Block } from 'payload'

export const TestimonialBlock: Block = {
  slug: 'testimonialBlock',
  interfaceName: 'TestimonialBlock',
  fields: [
    { name: 'sectionTitle', type: 'text', localized: true },
    {
      name: 'type',
      type: 'radio',
      options: [
        { label: 'Select from Collection', value: 'collection' },
        { label: 'Manual Entry', value: 'manual' },
      ],
      defaultValue: 'collection',
    },
    {
      name: 'selectedTestimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData.type === 'collection',
      },
    },
    {
      name: 'manualTestimonials',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'manual',
      },
      fields: [
        { name: 'quote', type: 'textarea', required: true, localized: true },
        { name: 'author', type: 'text', required: true, localized: true },
        { name: 'role', type: 'text', localized: true },
        { name: 'company', type: 'text', localized: true },
      ],
    },
  ],
}
