import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let bgColor = 'var(--ex-bg)'
  let themeColor = 'var(--ex-accent)'

  try {
    const payload = await getPayloadClient()
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    if (siteSettings?.theme) {
      if (siteSettings.theme.backgroundColor) bgColor = siteSettings.theme.backgroundColor
      if (siteSettings.theme.primaryColor) themeColor = siteSettings.theme.primaryColor
    }
  } catch {
    // Ignore error
  }

  return {
    name: 'Exvorta Agency Engine',
    short_name: 'Exvorta',
    description: 'Enterprise B2B Agency Platform',
    start_url: '/',
    display: 'standalone',
    background_color: bgColor,
    theme_color: themeColor,
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
