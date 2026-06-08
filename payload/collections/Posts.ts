import { CollectionConfig } from 'payload'
import {
  lexicalEditor,
  BlocksFeature,
  UploadFeature,
  HeadingFeature,
  AlignFeature,
  InlineToolbarFeature,
  LinkFeature,
  HTMLConverterFeature,
} from '@payloadcms/richtext-lexical'
import { CTABlock } from '../blocks/CTABlock'

const generatePreviewUrl = (doc: any, req: any) => {
  const locale = req?.locale || 'en'
  const slug = doc?.slug || ''
  return `http://localhost:3000/${locale}/posts/${slug}`
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedAt', 'status'],
    preview: (doc, { req }) => generatePreviewUrl(doc, req),
    livePreview: {
      url: ({ data, req }) => generatePreviewUrl(data, req),
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          AlignFeature(),
          InlineToolbarFeature(),
          LinkFeature({
            enabledCollections: ['pages', 'posts'],
          }),
          UploadFeature({
            collections: {
              media: {
                fields: [{ name: 'caption', type: 'text' }],
              },
            },
          }),
          BlocksFeature({
            blocks: [CTABlock],
          }),
          HTMLConverterFeature({}),
        ],
      }),
      required: true,
      localized: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Posts
