import { MetadataRoute } from 'next'
import type { SiteSetting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/payload-cache'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // A web manifest cannot resolve CSS variables — it needs literal colours.
  let bgColor = '#FAFAF8'
  let themeColor = '#0D0D0D'
  let siteName = 'Exvorta'
  let faviconUrl: string | null = null

  const siteSettings = await getCachedGlobal<SiteSetting>('site-settings')
  if (siteSettings?.theme) {
    if (siteSettings.theme.backgroundColor) bgColor = siteSettings.theme.backgroundColor
    if (siteSettings.theme.primaryColor) themeColor = siteSettings.theme.primaryColor
  }
  if (siteSettings?.siteName) siteName = siteSettings.siteName
  if (siteSettings?.favicon && typeof siteSettings.favicon === 'object' && siteSettings.favicon.url) {
    faviconUrl = siteSettings.favicon.url
  }

  return {
    name: siteName,
    short_name: siteName.split(' ')[0],
    description: 'Enterprise B2B Agency Platform',
    start_url: '/',
    display: 'standalone',
    background_color: bgColor,
    theme_color: themeColor,
    icons: faviconUrl
      ? [
          { src: faviconUrl, sizes: '192x192', type: 'image/png' },
          { src: faviconUrl, sizes: '512x512', type: 'image/png' },
        ]
      : [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
