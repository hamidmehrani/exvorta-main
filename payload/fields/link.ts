import { Field } from 'payload'

export const link: Field = {
  name: 'link',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'radio',
      options: [
        { label: 'Internal Reference', value: 'reference' },
        { label: 'Custom URL', value: 'custom' },
      ],
      defaultValue: 'reference',
      admin: { layout: 'horizontal' },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: ['pages'],
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

export default link
