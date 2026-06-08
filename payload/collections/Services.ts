import { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, localized: true, admin: { position: 'sidebar' } },
    { name: 'icon', type: 'text', admin: { description: 'Icon name/identifier' } },
    { name: 'shortDescription', type: 'textarea', required: true, localized: true },
    { name: 'detailedContent', type: 'richText', editor: lexicalEditor({}), localized: true },
  ],
}

export default Services
