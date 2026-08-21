import { Block } from 'payload'

export const PortfolioShowcaseBlock: Block = {
  slug: 'portfolioShowcase',
  interfaceName: 'PortfolioShowcaseBlock',
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      localized: true,
      admin: {
        description: 'Small uppercase label above the title (e.g. [ OUR INFRASTRUCTURE WORK ])',
      },
    },
    {
      name: 'sectionTitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
    },
    {
      name: 'ctaText',
      type: 'text',
      localized: true,
      admin: {
        description: 'Text for the explore portfolio button at the bottom',
      },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      localized: true,
    },
  ],
}
