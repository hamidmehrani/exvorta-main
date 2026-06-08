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

const generatePreviewUrl = (doc: any, req: any) => {
  const locale = req?.locale || 'en'
  const slug = doc?.slug || ''
  return `http://localhost:3000/${locale}/${slug === 'home' ? '' : slug}`
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    preview: (doc, { req }) => generatePreviewUrl(doc, req),
    livePreview: {
      url: ({ data, req }) => generatePreviewUrl(data, req),
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
      ],
    },
  ],
}

export default Pages
