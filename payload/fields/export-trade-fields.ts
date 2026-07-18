import { Field } from 'payload'

export const exportTradeFields: Field[] = [
  {
    name: 'exportDetails',
    type: 'group',
    admin: {
      description: 'Export Trade specific fields',
    },
    fields: [
      { name: 'moq', type: 'text', label: 'Minimum Order Quantity (MOQ)', localized: true },
      { name: 'incoterms', type: 'text', localized: true },
      { name: 'leadTime', type: 'text', localized: true },
      { name: 'paymentTerms', type: 'text', localized: true },
      { name: 'packagingOptions', type: 'textarea', localized: true },
      {
        name: 'origins',
        type: 'relationship',
        relationTo: 'origins',
        hasMany: true,
      },
      {
        name: 'certifications',
        type: 'relationship',
        relationTo: 'certifications',
        hasMany: true,
      },
    ],
  },
]
