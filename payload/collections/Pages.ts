import { readOnlyPublic } from '../access'
import { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/HeroBlock'
import { FeatureGridBlock } from '../blocks/FeatureGridBlock'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { CTABlock } from '../blocks/CTABlock'
import { CTABannerBlock } from '../blocks/CTABannerBlock'
import { ThesisBlock } from '../blocks/ThesisBlock'
import { GlobalPresenceBlock } from '../blocks/GlobalPresenceBlock'
import { PricingBlock } from '../blocks/PricingBlock'
import { FAQBlock } from '../blocks/FAQBlock'
import { TestimonialBlock } from '../blocks/TestimonialBlock'
import { StatsBlock } from '../blocks/StatsBlock'
import { MarqueeBlock } from '../blocks/MarqueeBlock'
import { VideoBlock } from '../blocks/VideoBlock'
import { ProcessBlock } from '../blocks/ProcessBlock'
import { ContactFormBlock } from '../blocks/ContactFormBlock'
import { PortfolioShowcaseBlock } from '../blocks/PortfolioShowcaseBlock'
import { FeatureShowcaseBlock } from '../blocks/FeatureShowcaseBlock'
import { RoadmapBlock } from '../blocks/RoadmapBlock'
import { WaitlistFormBlock } from '../blocks/WaitlistFormBlock'
import { RFQFormBlock } from '../blocks/RFQFormBlock'
import { TeamShowcaseBlock } from '../blocks/TeamShowcaseBlock'
import { ProductShowcaseBlock } from '../blocks/ProductShowcaseBlock'
import { PortfolioArchiveBlock } from '../blocks/PortfolioArchiveBlock'
import { ProblemStatementBlock } from '../blocks/ProblemStatementBlock'
import { VisionBlock } from '../blocks/VisionBlock'
import { FounderBlock } from '../blocks/FounderBlock'

import { revalidatePath } from 'next/cache'

const generatePreviewUrl = (doc: Record<string, unknown>, req: { locale?: string | null }) => {
  const slug = doc?.slug || ''
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  return `${baseUrl}/${slug === 'home' ? '' : slug}`
}

const revalidateHook = ({ doc }: { doc: { slug?: string; _status?: string } }) => {
  if (doc._status === 'published' || !('_status' in doc)) {
    const slug = doc.slug || ''
    const path = slug === 'home' || slug === 'index' 
      ? `/` 
      : `/${slug}`
    try {
      revalidatePath(path, 'page')
    } catch {
      // Ignore in standalone scripts
    }
  }
  return doc
}

export const Pages: CollectionConfig = {
  access: readOnlyPublic,
  slug: 'pages',
  hooks: {
    afterChange: [revalidateHook],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
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
              name: 'layout',
              type: 'blocks',
              blocks: [
                HeroBlock,
                FeatureGridBlock,
                RichTextBlock,
                CTABlock,
                CTABannerBlock,
                PricingBlock,
                FAQBlock,
                TestimonialBlock,
                StatsBlock,
                MarqueeBlock,
                VideoBlock,
                ProcessBlock,
                ContactFormBlock,
                PortfolioShowcaseBlock,
                FeatureShowcaseBlock,
                RoadmapBlock,
                WaitlistFormBlock,
                RFQFormBlock,
                TeamShowcaseBlock,
                ProductShowcaseBlock,
                PortfolioArchiveBlock,
                ThesisBlock,
                GlobalPresenceBlock,
                ProblemStatementBlock,
                VisionBlock,
                FounderBlock,
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
              type: 'array',
              admin: {
                condition: (data) => data.requiresAuth === true,
              },
              fields: [
                {
                  name: 'role',
                  type: 'select',
                  options: [
                    { label: 'Admin', value: 'admin' },
                    { label: 'Partner', value: 'partner' },
                    { label: 'Customer', value: 'customer' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Pages
