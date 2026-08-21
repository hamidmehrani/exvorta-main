import { CollectionConfig } from 'payload'
import { sendLeadEmails } from './Leads/hooks/sendLeadEmails'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'status', 'createdAt'],
    group: 'Content',
  },
  hooks: {
    afterChange: [sendLeadEmails],
  },
  access: {
    create: () => true, // Allow unauthenticated submissions from the frontend
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      required: true,
      options: [
        { label: 'Waitlist', value: 'Waitlist' },
        { label: 'RFQ', value: 'RFQ' },
      ],
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'New',
      options: [
        { label: 'New', value: 'New' },
        { label: 'Under Review', value: 'Under Review' },
        { label: 'Contacted', value: 'Contacted' },
        { label: 'Archived', value: 'Archived' },
      ],
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'payload',
      type: 'json', // Using JSON to safely store arbitrary form data
    },
  ],
}

export default Leads
