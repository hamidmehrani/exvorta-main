import { CollectionConfig } from 'payload'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'from',
    group: 'Global Settings',
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
