import { CollectionConfig } from 'payload'
import { isAdmin } from '../../../access/isAdmin'

export const Origins: CollectionConfig = {
  slug: 'origins',
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
  ],
}

export default Origins
