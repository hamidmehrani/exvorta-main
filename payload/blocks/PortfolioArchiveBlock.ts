import { Block } from 'payload'

export const PortfolioArchiveBlock: Block = {
  slug: 'portfolioArchive',
  interfaceName: 'PortfolioArchiveBlock',
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      localized: true,
      admin: {
        description: 'Small eyebrow label above the headline (e.g. "[ SELECTED WORKS ]")',
      },
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Large H1 headline (e.g. "Latest Web Design Works.")',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Descriptive subheading below the headline',
      },
    },
    {
      name: 'projects',
      type: 'array',
      dbName: 'proj_archive',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'industry', type: 'text' },
        { name: 'volume', type: 'text' },
        { name: 'service', type: 'text' },
        { name: 'linkUrl', type: 'text' },
        { name: 'linkLabel', type: 'text' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Preview Image',
          admin: { description: 'Optional. Desktop capture of the live site. Leave empty to use the built-in branded preview.' },
        },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      admin: { description: 'Bottom button label (e.g. "EXPLORE FULL PORTFOLIO ↗")' }
    },
    {
      name: 'ctaUrl',
      type: 'text'
    }
  ],
}
