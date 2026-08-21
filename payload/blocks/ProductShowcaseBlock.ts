import { Block } from 'payload'

export const ProductShowcaseBlock: Block = {
  slug: 'productShowcase',
  interfaceName: 'ProductShowcaseBlock',
  fields: [
    {
      name: 'moduleNumber',
      type: 'text',
      admin: { description: 'e.g. "01", "02" — used for the [ MODULE XX ] label' },
    },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: { description: 'e.g. "Document Automation"' },
    },
    {
      name: 'status',
      type: 'text',
      defaultValue: 'coming_soon',
    },
    {
      name: 'statusLabel',
      type: 'text',
      localized: true,
      admin: { description: 'Override label for the status badge (e.g. "CLOSED BETA", "Global Logistics Alpha")' },
    },
    {
      name: 'productName',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'e.g. "Exvorta Web."' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'secondaryDescription',
      type: 'textarea',
      localized: true,
      admin: { description: 'Optional italic sub-copy (e.g. availability note)' },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      admin: { description: 'e.g. "[ VIEW ARCHITECTURE ]"' },
    },
    {
      name: 'ctaUrl',
      type: 'text',
    },
    {
      name: 'mockupType',
      type: 'text',
      defaultValue: 'web',
    },
    {
      name: 'theme',
      type: 'text',
      defaultValue: 'dark',
      admin: { description: 'Section background color — alternates between modules' },
    },
    {
      name: 'features',
      type: 'array',
      dbName: 'ps_feats',
      fields: [
        { name: 'text', type: 'text', localized: true },
      ],
    },
  ],
}
