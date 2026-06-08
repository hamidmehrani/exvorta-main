import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Helper to fetch and map documents
  const fetchAndMapCollection = async (
    collection: 'pages' | 'posts' | 'portfolio',
    pathPrefix: string,
    priority: number
  ) => {
    try {
      // For sitemaps, we usually fetch the default locale or all locales. 
      // Next.js App Router alternates handle localized URLs better, 
      // but here we just list the default English routes, and the alternates 
      // in metadata will tell search engines about /ar and /fa.
      const { docs } = await payload.find({
        collection,
        limit: 1000,
        depth: 0,
        // If versions/drafts were fully enabled with a 'status' field, 
        // we'd filter by _status: 'published' here. Assuming all are published.
      })

      docs.forEach((doc: any) => {
        const slug = doc.slug === 'home' ? '' : doc.slug
        const fullPath = slug ? `${pathPrefix}/${slug}` : pathPrefix
        // Fix double slashes
        const url = `${baseUrl}${fullPath}`.replace(/([^:]\/)\/+/g, '$1')

        sitemapEntries.push({
          url,
          lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
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
    fetchAndMapCollection('posts', '/posts', 0.6),
    fetchAndMapCollection('portfolio', '/portfolio', 0.7),
  ])

  return sitemapEntries
}
