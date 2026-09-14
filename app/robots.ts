import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { getSiteUrl } from '@/lib/site-url'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = getSiteUrl()

  const payload = await getPayloadClient()
  let maintenanceMode = false

  try {
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })
    maintenanceMode = siteSettings?.maintenanceMode || false
  } catch (error) {
    console.warn('[robots] site-settings unavailable, assuming live', error)
  }

  if (maintenanceMode) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/login', '/insights'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
