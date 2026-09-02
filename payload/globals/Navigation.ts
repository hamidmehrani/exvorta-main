import { isAdmin } from '../access/isAdmin'
import { GlobalConfig } from 'payload'
import { link } from '../fields/link'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Global Settings',
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      required: true,
      fields: [link],
    },
  ],
}

export default Navigation
