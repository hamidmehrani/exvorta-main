import { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'from',
    group: 'Global Settings',
  },
  access: {
    read: () => true, // Public — middleware fetches redirects for all unauthenticated requests
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Incoming URL path, e.g., /old-about',
      },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: {
        description: 'Destination URL path, e.g., /en/about',
      },
    },
    {
      name: 'statusCode',
      type: 'select',
      options: [
        { label: '301', value: '301' },
        { label: '302', value: '302' },
      ],
      defaultValue: '301',
      required: true,
    },
  ],
}

export default Redirects
