import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let bgColor = 'var(--ex-bg)'
  let themeColor = 'var(--ex-accent)'
  let iconUrl = '/icon.png'
  let siteName = 'Exvorta'

  try {
    const payload = await getPayloadClient()
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    if (siteSettings?.theme) {
      if (siteSettings.theme.backgroundColor) bgColor = siteSettings.theme.backgroundColor
      if (siteSettings.theme.primaryColor) themeColor = siteSettings.theme.primaryColor
    }
    if (siteSettings?.siteName) siteName = siteSettings.siteName
    if (siteSettings?.favicon && typeof siteSettings.favicon === 'object' && siteSettings.favicon.url) {
      iconUrl = siteSettings.favicon.url
    }
  } catch {
    // Ignore error
  }

  return {
    name: siteName,
    short_name: siteName.split(' ')[0],
    description: 'Enterprise B2B Agency Platform',
    start_url: '/',
    display: 'standalone',
    background_color: bgColor,
    theme_color: themeColor,
    icons: [
      {
        src: iconUrl,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: iconUrl,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
