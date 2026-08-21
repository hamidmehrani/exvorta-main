import { Block } from 'payload'

export const TeamShowcaseBlock: Block = {
  slug: 'teamShowcase',
  interfaceName: 'TeamShowcaseBlock',
  fields: [
    {
      name: 'sectionEyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'members',
      type: 'array',
      dbName: 'team_members',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          localized: true,
        },
        {
          name: 'company',
          type: 'text',
          localized: true,
        },
        {
          name: 'bio',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'quote',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
