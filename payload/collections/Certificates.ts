import { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'issueDate', 'expiryDate', 'publiclyVisible'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'verificationNumber',
      type: 'text',
    },
    {
      name: 'issueDate',
      type: 'date',
    },
    {
      name: 'expiryDate',
      type: 'date',
    },
    {
      name: 'publiclyVisible',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export default Certificates
