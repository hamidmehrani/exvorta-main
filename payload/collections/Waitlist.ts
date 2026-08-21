import { CollectionConfig } from 'payload'

export const Waitlist: CollectionConfig = {
  slug: 'waitlist',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
    group: 'Content',
  },
  access: {
    create: () => true, // Allow unauthenticated submissions from the frontend
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
