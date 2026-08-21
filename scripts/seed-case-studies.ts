import { getPayloadClient } from '../lib/payload'

const caseStudies = [
  {
    title: 'Spicevo Case Study',
    slug: 'spicevo',
    _status: 'published',
    blocks: [
      {
        blockType: 'hero',
        eyebrow: '[ PORTFOLIO ]',
        headline: 'Spicevo',
        subheadline: 'Organic Herbs & Spices Exporter. 2014, Istanbul, Turkey.',
      },
      {
        blockType: 'richText',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'heading',
                tag: 'h2',
                format: 'left',
                indent: 0,
                version: 1,
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Brand Positioning',
                    type: 'text',
                    version: 1,
                  },
                ],
              },
              {
                type: 'paragraph',
                format: 'left',
                indent: 0,
                version: 1,
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: '"The organic herbs supplier that European and Gulf buyers trust — because every container ships with documentation as clean as the product itself."',
                    type: 'text',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
      },
      {
        blockType: 'featureShowcase',
        label: '[ THE ENGINE ]',
        title: 'Payload CMS 3.0 Integration.',
        description: 'Total operational control. The export team manages product specifications, EU Organic certifications, and RFQ lead data dynamically—without touching a single line of code.',
        features: [
          { text: 'Global i18n Routing' },
          { text: 'Dynamic RFQ Lead Data' },
        ],
        mediaPosition: 'right',
      }
    ]
  },
  {
    title: 'Nutave Case Study',
    slug: 'nutave',
    _status: 'published',
    blocks: [
      {
        blockType: 'hero',
        eyebrow: '[ PORTFOLIO ]',
        headline: 'Nutave',
        subheadline: 'Premium Nuts & Dried Fruits Supplier. High volume B2B trade.',
      },
      {
        blockType: 'richText',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'heading',
                tag: 'h2',
                format: 'left',
                indent: 0,
                version: 1,
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Global Market Access',
                    type: 'text',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
      },
      {
        blockType: 'featureShowcase',
        label: '[ INFRASTRUCTURE ]',
        title: 'High-Volume RFQ Architecture.',
        description: 'Scalable architecture built for handling thousands of B2B inquiries across global markets simultaneously.',
        features: [
          { text: 'Enterprise Lead Generation' },
          { text: 'Multi-region deployment' },
        ],
        mediaPosition: 'right',
      }
    ]
  },
  {
    title: 'Stonvi Case Study',
    slug: 'stonvi',
    _status: 'published',
    blocks: [
      {
        blockType: 'hero',
        eyebrow: '[ PORTFOLIO ]',
        headline: 'Stonvi',
        subheadline: 'Natural Stone & Marble Exporter. Luxury architectural materials.',
      },
      {
        blockType: 'richText',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'heading',
                tag: 'h2',
                format: 'left',
                indent: 0,
                version: 1,
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Visual Authority',
                    type: 'text',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
      },
      {
        blockType: 'featureShowcase',
        label: '[ AESTHETICS ]',
        title: 'High-Fidelity Visual Commerce.',
        description: 'Optimized image pipelines and CDN integration to showcase luxury marble details at 4K resolution with zero latency.',
        features: [
          { text: 'Advanced Image Optimization' },
          { text: 'Immersive Product Galleries' },
        ],
        mediaPosition: 'right',
      }
    ]
  }
]

async function seedCaseStudies() {
  console.log('Seeding Case Studies via Local API...')
  process.env.DATABASE_URI = process.env.DATABASE_URI_UNPOOLED || process.env.DATABASE_URI
  try {
    const payload = await getPayloadClient()

    for (const data of caseStudies) {
      const { docs } = await payload.find({
        collection: 'pages',
        where: { slug: { equals: data.slug } },
        draft: true,
        depth: 0,
      })

      if (docs && docs.length > 0) {
        const result = await payload.update({
          collection: 'pages',
          id: docs[0].id,
          data: data as any,
        })
        console.log(`Successfully updated Case Study (${data.slug}):`, result.id)
      } else {
        const result = await payload.create({
          collection: 'pages',
          data: data as any,
        })
        console.log(`Successfully seeded Case Study (${data.slug}):`, result.id)
      }
    }
    process.exit(0)
  } catch (error) {
    console.error('Error seeding case studies:', error)
    process.exit(1)
  }
}

seedCaseStudies()
