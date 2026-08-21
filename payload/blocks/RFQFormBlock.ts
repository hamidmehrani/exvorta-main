import { Block } from 'payload'

export const RFQFormBlock: Block = {
  slug: 'rfqForm',
  interfaceName: 'RFQFormBlock',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'subtitle', type: 'textarea', localized: true },
    {
      name: 'phases',
      dbName: 'rfq_phases',
      type: 'array',
      admin: { description: 'What Happens Next steps' },
      fields: [
        { name: 'stepNumber', type: 'text', localized: true },
        { name: 'stepName', type: 'text', localized: true },
      ],
    },
    {
      type: 'group',
      name: 'form_config',
      fields: [
        { name: 'companyNamePlaceholder', type: 'text', localized: true },
        { name: 'websiteUrlPlaceholder', type: 'text', localized: true },
        { name: 'workEmailPlaceholder', type: 'text', localized: true },
        {
          name: 'objectives',
          type: 'array',
          dbName: 'rfq_objectives',
          fields: [{ name: 'option', type: 'text', localized: true }],
        },
        { name: 'challengePlaceholder', type: 'textarea', localized: true },
        {
          name: 'timelines',
          type: 'array',
          dbName: 'rfq_timelines',
          fields: [{ name: 'option', type: 'text', localized: true }],
        },
        {
          name: 'budgets',
          type: 'array',
          dbName: 'rfq_budgets',
          fields: [{ name: 'option', type: 'text', localized: true }],
        },
        { name: 'submitButtonText', type: 'text', localized: true },
        { name: 'disclaimerText', type: 'text', localized: true },
      ],
    },
  ],
}
