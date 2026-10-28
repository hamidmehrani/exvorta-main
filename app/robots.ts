import { MetadataRoute } from 'next'
import { getCachedGlobal } from '@/lib/payload-cache'
import { getSiteUrl } from '@/lib/site-url'
import type { SiteSetting } from '@/payload-types'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = getSiteUrl().replace(/\/+$/, '')

  let maintenanceMode = false
  try {
    const siteSettings = await getCachedGlobal<SiteSetting>('site-settings')
    maintenanceMode = Boolean(siteSettings?.maintenanceMode)
  } catch (error) {
    console.warn('[robots] site-settings unavailable, assuming live', error)
  }

  if (maintenanceMode) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
