import { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'clientName', 'industry'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, localized: true, admin: { position: 'sidebar' } },
    { name: 'clientName', type: 'text', required: true, localized: true },
    { name: 'industry', type: 'text', required: true, localized: true },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'challenge', type: 'richText', editor: lexicalEditor({}), localized: true },
    { name: 'solution', type: 'richText', editor: lexicalEditor({}), localized: true },
    { name: 'results', type: 'richText', editor: lexicalEditor({}), localized: true },
  ],
}

export default Portfolio
