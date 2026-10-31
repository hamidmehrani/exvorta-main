import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'
import { getCachedSitemapCollection, getCachedRedirects } from '@/lib/payload-cache'

// Disallowed in robots.txt — must never appear in the sitemap (crawl-directive consistency)
export const ROBOTS_DISALLOWED = new Set(['/admin', '/login', '/api'])

export interface StaticRouteConfig {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}

export const STATIC_ROUTES: readonly StaticRouteConfig[] = [
  { path: '', priority: 1.0, changeFrequency: 'daily' },
  { path: '/web', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/launchpad', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/portfolio', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/ecosystem', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/insights', priority: 0.8, changeFrequency: 'daily' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/rfq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/partners', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/docs-generator', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/tools/incoterm-cbm', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/tools/incoterm-cbm/ar', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/tools/uae-einvoicing', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/tools/uae-einvoicing/ar', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/waitlist', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/legal', priority: 0.5, changeFrequency: 'monthly' },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl().replace(/\/+$/, '')

  const seenUrls = new Set<string>()
  const sitemapEntries: MetadataRoute.Sitemap = []

  // 1. Static marketing routes
  for (const route of STATIC_ROUTES) {
    const url = `${baseUrl}${route.path}`
    seenUrls.add(url)
    sitemapEntries.push({
      url,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  }

  // 2. Dynamic CMS collections via cached queries
  const fetchAndMapCollection = async (
    collection: 'pages' | 'projects' | 'posts',
    pathPrefix: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  ) => {
    const docs = await getCachedSitemapCollection(collection)

    for (const doc of docs) {
      if (doc._status && doc._status !== 'published') continue

      const rawSlug = (doc.slug === 'home' ? '' : (doc.slug ?? '')).replace(/^\/+|\/+$/g, '')
      if (!rawSlug && pathPrefix !== '/') continue

      const fullPath = rawSlug
        ? `${pathPrefix}/${rawSlug}`.replace(/\/{2,}/g, '/')
        : pathPrefix

      const url = `${baseUrl}${fullPath === '/' ? '' : fullPath}`
      if (seenUrls.has(url)) continue
      seenUrls.add(url)

      sitemapEntries.push({
        url,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
        changeFrequency,
        priority: rawSlug === '' ? 1.0 : priority,
      })
    }
  }

  const [redirects] = await Promise.all([
    getCachedRedirects(),
    fetchAndMapCollection('pages', '/', 0.8, 'monthly'),
    fetchAndMapCollection('projects', '/portfolio', 0.7, 'monthly'),
    fetchAndMapCollection('posts', '/insights', 0.8, 'weekly'),
  ])

  const redirectFromPaths = new Set(redirects)

  return sitemapEntries.filter((entry) => {
    try {
      const pathname = new URL(entry.url).pathname
      for (const disallowed of ROBOTS_DISALLOWED) {
        if (pathname === disallowed || pathname.startsWith(`${disallowed}/`)) return false
      }
      return !redirectFromPaths.has(pathname)
    } catch {
      return true
    }
  })
}
