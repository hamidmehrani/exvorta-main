import { CollectionConfig } from 'payload'

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'role', type: 'text', required: true, localized: true },
    { name: 'bio', type: 'textarea', localized: true },
    { name: 'profileImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}

export default Team
