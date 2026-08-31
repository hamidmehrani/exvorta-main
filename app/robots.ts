import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://exvorta.com'

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
      disallow: ['/admin', '/api/', '/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
