import { readOnlyPublic } from '../access'
import { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  access: readOnlyPublic,
  slug: 'testimonials',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'company', 'role'],
    group: 'Content',
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true, localized: true },
    { name: 'author', type: 'text', required: true, localized: true },
    { name: 'role', type: 'text', localized: true },
    { name: 'company', type: 'text', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export default Testimonials
