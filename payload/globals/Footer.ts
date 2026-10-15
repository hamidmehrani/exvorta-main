import { isAdmin } from '../access/isAdmin'
import { GlobalConfig } from 'payload'
import { link } from '../fields/link'
import { revalidateGlobal } from '../hooks/revalidateGlobal'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Global Settings',
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: { afterChange: [revalidateGlobal('footer')] },
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [link],
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      localized: true,
    },
  ],
}

export default Footer
