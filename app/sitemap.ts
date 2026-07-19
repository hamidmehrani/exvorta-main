import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const locales = routing.locales || ['en', 'ar', 'fa']

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Helper to fetch and map documents
  const fetchAndMapCollection = async (
    collection: 'pages' | 'posts',
    pathPrefix: string,
    priority: number
  ) => {
    try {
      const { docs } = await payload.find({
        collection,
        limit: 1000,
        depth: 0,
      })

      docs.forEach((doc: Record<string, unknown>) => {
        const slug = doc.slug === 'home' ? '' : doc.slug
        const fullPath = slug ? `${pathPrefix}/${slug}` : pathPrefix
        
        const languages: Record<string, string> = {}
        locales.forEach((loc) => {
          languages[loc] = `${baseUrl}/${loc}${fullPath}`.replace(/([^:]\/)\/+/g, '$1')
        })

        const url = languages['en'] || Object.values(languages)[0]

        sitemapEntries.push({
          url,
          lastModified: doc.updatedAt ? new Date(doc.updatedAt as string) : new Date(),
          changeFrequency: collection === 'pages' ? 'weekly' : 'monthly',
          priority: slug === '' ? 1.0 : priority,
          alternates: {
            languages,
          },
        })
      })
    } catch (error) {
      console.error(`Failed to fetch ${collection} for sitemap`, error)
    }
  }

  await Promise.all([
    fetchAndMapCollection('pages', '/', 0.8),
    fetchAndMapCollection('posts', '/posts', 0.6),
  ])

  let redirectFromPaths = new Set<string>()
  try {
    const { docs: redirects } = await payload.find({ collection: 'redirects', limit: 1000, depth: 0 })
    redirectFromPaths = new Set(redirects.map((r: Record<string, unknown>) => r.from as string))
  } catch (error) {
    console.error('Failed to fetch redirects for sitemap', error)
  }

  return sitemapEntries.filter((entry) => {
    try {
      const pathname = new URL(entry.url).pathname
      const pathnameWithoutLocale = pathname.replace(/^\/(en|ar|fa)/, '') || '/'
      return !redirectFromPaths.has(pathname) && !redirectFromPaths.has(pathnameWithoutLocale)
    } catch {
      return true
    }
  })
}
