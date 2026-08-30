import { readOnlyPublic } from '../access'
import { CollectionConfig } from 'payload'

export const Certifications: CollectionConfig = {
  access: readOnlyPublic,
  slug: 'certifications',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'issuer', 'year'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'issuer', type: 'text', localized: true },
    { name: 'year', type: 'text' },
    { name: 'referenceId', type: 'text', label: 'Reference / Certificate ID' },
    {
      name: 'url',
      type: 'text',
      label: 'Verification URL',
      validate: (value: unknown): true | string => {
        if (!value) return true
        const str = String(value)
        return /^https?:\/\/.+/.test(str) || 'Must be a valid http(s) URL'
      },
    },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea', localized: true },
  ],
}

export default Certifications
