import { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/HeroBlock'
import { FeatureGridBlock } from '../blocks/FeatureGridBlock'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { CTABlock } from '../blocks/CTABlock'
import { PricingBlock } from '../blocks/PricingBlock'
import { FAQBlock } from '../blocks/FAQBlock'
import { TestimonialBlock } from '../blocks/TestimonialBlock'
import { StatsBlock } from '../blocks/StatsBlock'
import { MarqueeBlock } from '../blocks/MarqueeBlock'
import { VideoBlock } from '../blocks/VideoBlock'
import { ProcessBlock } from '../blocks/ProcessBlock'
import { ContactFormBlock } from '../blocks/ContactFormBlock'

import { revalidatePath } from 'next/cache'

const generatePreviewUrl = (doc: Record<string, unknown>, req: { locale?: string | null }) => {
  const locale = req?.locale || 'en'
  const slug = doc?.slug || ''
  return `http://localhost:3000/${locale}/${slug === 'home' ? '' : slug}`
}

const locales = ['en', 'fa', 'ar']
const revalidateHook = ({ doc }: { doc: { slug?: string; _status?: string } }) => {
  if (doc._status === 'published' || !('_status' in doc)) {
    const slug = doc.slug || ''
    locales.forEach((locale) => {
      const path = slug === 'home' || slug === 'index' 
        ? `/${locale}` 
        : `/${locale}/${slug}`
      revalidatePath(path, 'page')
    })
  }
  return doc
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  hooks: {
    afterChange: [revalidateHook],
  },
  admin: {
    useAsTitle: 'title',
    preview: (doc, { req }) => generatePreviewUrl(doc, req),
    livePreview: {
      url: ({ data, req }) => generatePreviewUrl(data, req),
    },
  },
  versions: { 
    maxPerDoc: 50,
    drafts: { autosave: true } 
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
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'blocks',
              type: 'blocks',
              blocks: [
                HeroBlock,
                FeatureGridBlock,
                RichTextBlock,
                CTABlock,
                PricingBlock,
                FAQBlock,
                TestimonialBlock,
                StatsBlock,
                MarqueeBlock,
                VideoBlock,
                ProcessBlock,
                ContactFormBlock,
              ],
            },
          ],
        },
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

export default Pages
