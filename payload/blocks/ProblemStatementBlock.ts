import { Block } from 'payload'

export const ProblemStatementBlock: Block = {
  slug: 'problemStatement',
  interfaceName: 'ProblemStatementBlock',
  fields: [
    {
      name: 'theme',
      type: 'text',
      
      defaultValue: 'dark',
    },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      localized: true,
    },
    {
      name: 'statements',
      dbName: 'prob_stmts',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}
