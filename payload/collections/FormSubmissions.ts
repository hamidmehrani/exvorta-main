import { readOnlyPublic } from '../access'
import { CollectionConfig } from 'payload'
import { sendRFQEmails } from './FormSubmissions/hooks/sendRFQEmails'

export const FormSubmissions: CollectionConfig = {
  access: readOnlyPublic,
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    afterChange: [sendRFQEmails],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'companyName',
      type: 'text',
    },
    {
      name: 'businessType',
      type: 'select',
      options: [
        { label: 'Importer', value: 'importer' },
        { label: 'Exporter', value: 'exporter' },
        { label: 'Trading Company', value: 'trading_company' },
      ],
    },
    {
      name: 'mainMarkets',
      type: 'text',
    },
    {
      name: 'budget',
      type: 'select',
      options: [
        { label: '$800–1.5k', value: '$800–1.5k' },
        { label: '$1.5–3k', value: '$1.5–3k' },
        { label: '$3k+', value: '$3k+' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default FormSubmissions
