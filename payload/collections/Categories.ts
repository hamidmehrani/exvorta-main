import { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Used for URL filtering',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
        description: 'Parent category for nesting',
      },
    },
  ],
}

export default Categories
