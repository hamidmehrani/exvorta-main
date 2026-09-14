/**
 * Authoritative public site URL, safe for SEO surfaces (canonical, OG, sitemap, robots, JSON-LD).
 * Never leaks localhost into production markup even if env vars are misconfigured.
 */
export const getSiteUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_SERVER_URL

  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/$/, '')
  }

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return 'https://exvorta.com'
  }

  return (envUrl || 'http://localhost:3000').replace(/\/$/, '')
}
