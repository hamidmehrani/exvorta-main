import { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidateGlobal'

export const Analytics: GlobalConfig = {
  slug: 'analytics',
  admin: {
    group: 'Global Settings',
  },
  hooks: { afterChange: [revalidateGlobal('analytics')] },
  fields: [
    {
      name: 'gtmId',
      type: 'text',
      admin: {
        description: 'Google Tag Manager ID, e.g., GTM-XXXXXX',
      },
    },
    {
      name: 'gaId',
      type: 'text',
      admin: {
        description: 'Google Analytics ID, e.g., G-XXXXXX',
      },
    },
  ],
}

export default Analytics
