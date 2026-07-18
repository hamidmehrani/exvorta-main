import { CollectionConfig } from 'payload'
import { isAdmin } from '../../../access/isAdmin'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    group: 'Export Module',
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
    },
    {
      name: 'expiryDate',
      type: 'date',
    },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { in: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'] },
      },
      admin: {
        description: 'Upload PDF or Image for this certification',
      },
    },
  ],
}

export default Certifications
