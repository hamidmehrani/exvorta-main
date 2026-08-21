import { Block } from 'payload'

export const WaitlistFormBlock: Block = {
  slug: 'waitlistForm',
  interfaceName: 'WaitlistFormBlock',
  fields: [
    {
      name: 'placeholder',
      type: 'text',
      localized: true,
      defaultValue: 'Enter official corporate email...',
    },
    {
      name: 'buttonText',
      type: 'text',
      localized: true,
      defaultValue: '[ REQUEST EARLY ACCESS ]',
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'waitlist',
      admin: {
        description: 'Source passed to the lead submission (e.g., waitlist, early_access)',
      },
    },
  ],
}
