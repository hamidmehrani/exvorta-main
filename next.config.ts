import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

// Warn (don't crash) on missing env vars so CI builds succeed;
// runtime still fails safely where secrets are actually used.
const requiredEnvVars = [
  'DATABASE_URI',
  'PAYLOAD_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️ Missing environment variable: ${envVar} — configure it before deploying`)
  }
}

const nextConfig: NextConfig = {
  transpilePackages: ['lenis', 'gsap', 'framer-motion'],
  images: {
    formats: ['image/avif', 'image/webp'],
    // Cloudinary assets and bundled captures never change under the same URL.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    // Barrel-heavy packages: pull in only the symbols a page uses.
    optimizePackageImports: ['framer-motion', 'gsap'],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  async redirects() {
    return [
      // Canonical host: www → apex (301, permanent). Vercel handles http→https.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.exvorta.com' }],
        destination: 'https://exvorta.com/:path*',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=(), interest-cohort=()'
          },
        ],
      },
      {
        // Static assets — immutable cache for 1 year
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Self-hosted fonts never change in place (new weights ship under new names).
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Other public assets — long cache, revalidated via ETag so content
        // changes propagate without busting.
        source: '/:file.(png|webp|avif|woff2|jpg|jpeg|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
}

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const config = withPayload(analyzer(nextConfig))

// withPayload appends `Accept-CH` / `Vary` / `Critical-CH: Sec-CH-Prefers-Color-Scheme`
// to EVERY route. Those hints only matter to the admin UI's theme detection, but
// on the public site `Critical-CH` makes Chrome re-issue the document request on
// a first visit and `Vary` fragments the CDN cache. Scope the rule to /admin.
const payloadHeaders = config.headers
config.headers = async () => {
  const rules = (await payloadHeaders?.()) ?? []
  return rules.map((rule) =>
    rule.source === '/:path*' && rule.headers.some((h) => h.key === 'Critical-CH')
      ? { ...rule, source: '/admin/:path*' }
      : rule,
  )
}

export default config
