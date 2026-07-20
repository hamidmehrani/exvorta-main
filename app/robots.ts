import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  
  const payload = await getPayloadClient()
  let maintenanceMode = false
  
  try {
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })
    maintenanceMode = siteSettings?.maintenanceMode || false
  } catch {}

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
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
