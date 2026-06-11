import { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf, isAdminFieldLevel } from '../access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['client'],
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Client', value: 'client' },
      ],
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
  ],
}

export default Users
