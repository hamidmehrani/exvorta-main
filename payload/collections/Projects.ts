import { CollectionConfig } from 'payload'
import {
  lexicalEditor,
  HTMLConverterFeature,
} from '@payloadcms/richtext-lexical'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
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
      name: 'excerpt',
      type: 'textarea',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'heroBgColor',
      type: 'text',
      defaultValue: '#FAFAF8',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'accentColor',
      type: 'text',
      defaultValue: '#059669',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'liveUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'clientInfo',
      type: 'group',
      fields: [
        { name: 'industry', type: 'text' },
        { name: 'volume', type: 'text' },
        { name: 'service', type: 'text' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'clientName',
      type: 'text',
    },
    {
      name: 'metrics',
      type: 'array',
      dbName: 'proj_metrics',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      dbName: 'proj_gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HTMLConverterFeature({}),
        ],
      }),
    },
  ],
}

export default Projects
