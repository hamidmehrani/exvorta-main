import { CollectionConfig } from 'payload'
import { sendWaitlistEmails } from './Waitlist/hooks/sendWaitlistEmails'

export const Waitlist: CollectionConfig = {
  slug: 'waitlist',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
    group: 'Content',
  },
  hooks: {
    afterChange: [sendWaitlistEmails],
  },
  access: {
    // Server actions use the Local API (overrideAccess: true); REST stays closed.
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'payload',
      type: 'json',
    },
  ],
}

export default Waitlist
