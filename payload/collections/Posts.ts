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

import { revalidatePath } from 'next/cache'

const generatePreviewUrl = (doc: Record<string, unknown>, req: { locale?: string | null }) => {
  const locale = req?.locale || 'en'
  const slug = doc?.slug || ''
  return `http://localhost:3000/${locale}/posts/${slug}`
}

const locales = ['en', 'fa', 'ar']
const revalidateHook = ({ doc }: { doc: { slug?: string; _status?: string } }) => {
  if (doc._status === 'published' || !('_status' in doc)) {
    const slug = doc.slug || ''
    locales.forEach((locale) => {
      revalidatePath(`/${locale}/posts/${slug}`, 'page')
    })
  }
  return doc
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    afterChange: [revalidateHook],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedAt', 'status'],
    group: 'Content',
    preview: (doc, { req }) => generatePreviewUrl(doc, req),
    livePreview: {
      url: ({ data, req }) => generatePreviewUrl(data, req),
    },
  },
  versions: {
    maxPerDoc: 50,
    drafts: {
      autosave: true,
    },
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
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
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
        {
          label: 'Access Control',
          fields: [
            {
              name: 'requiresAuth',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'If true, this page is locked behind a login wall for VIP/Partner users only.',
              },
            },
            {
              name: 'allowedRoles',
              type: 'select',
              options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Partner', value: 'partner' },
                { label: 'Customer', value: 'customer' },
              ],
              hasMany: true,
              admin: {
                condition: (data) => data.requiresAuth === true,
              },
            },
          ],
        },
      ],
    },
  ],
}

export default Posts
