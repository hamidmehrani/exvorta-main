import { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { boilerplateConfig } from '../../boilerplate.config'
import { exportTradeFields } from '../fields/export-trade-fields'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'richDescription',
      type: 'richText',
      localized: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        }
      ]
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'specifications',
      type: 'array',
      labels: {
        singular: 'Specification',
        plural: 'Specifications',
      },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true, localized: true },
        { name: 'group', type: 'text', localized: true },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional override for the RFQ/contact button text',
      },
    },
    // Spread conditional export trade fields if module is enabled
    ...(boilerplateConfig.modules.exportTrade ? exportTradeFields : []),
  ],
}

export default Products
