import { isAdmin } from '../access/isAdmin'
import { GlobalConfig } from 'payload'
import { link } from '../fields/link'
import { revalidateGlobal } from '../hooks/revalidateGlobal'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Global Settings',
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: { afterChange: [revalidateGlobal('navigation')] },
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
