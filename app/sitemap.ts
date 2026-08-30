import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://exvorta.com'

  // Static marketing routes always present, even without a CMS connection
  const staticRoutes = ['', '/about', '/portfolio', '/ecosystem', '/insights', '/contact', '/rfq', '/waitlist']
  const seenUrls = new Set<string>()
  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    const url = `${baseUrl}${route}`
    seenUrls.add(url)
    return {
      url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1.0 : 0.8,
    }
  })

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

      docs.forEach((doc: { slug?: string | null; updatedAt?: string | null }) => {
        const slug = (doc.slug === 'home' ? '' : (doc.slug ?? '')).replace(/^\/+|\/+$/g, '')
        if (!slug && pathPrefix !== '/') return // skip unnamed docs
        const fullPath = slug ? `${pathPrefix}/${slug}`.replace(/\/{2,}/g, '/') : pathPrefix
        const url = `${baseUrl}${fullPath === '/' ? '' : fullPath}`
        if (seenUrls.has(url)) return // skip duplicates
        seenUrls.add(url)

        sitemapEntries.push({
          url,
          lastModified: doc.updatedAt ? new Date(doc.updatedAt as string) : new Date(),
          changeFrequency: collection === 'pages' ? 'weekly' : 'monthly',
          priority: slug === '' ? 1.0 : priority,
        })
      })
    } catch (error) {
      console.error(`Failed to fetch ${collection} for sitemap`, error)
    }
  }

  await Promise.all([
    fetchAndMapCollection('pages', '/', 0.8),
    fetchAndMapCollection('posts', '/insights', 0.6),
  ])

  let redirectFromPaths = new Set<string>()
  try {
    const { docs: redirects } = await payload.find({ collection: 'redirects', limit: 1000, depth: 0 })
    redirectFromPaths = new Set(redirects.map((r) => r.from))
  } catch (error) {
    console.error('Failed to fetch redirects for sitemap', error)
  }

  return sitemapEntries.filter((entry) => {
    try {
      const pathname = new URL(entry.url).pathname
      return !redirectFromPaths.has(pathname)
    } catch {
      return true
    }
  })
}
