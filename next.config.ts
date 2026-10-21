import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

// Categorized Environment Validation
const isProduction = process.env.NODE_ENV === 'production' && process.env.CI !== 'true'

// Critical variables required for core system execution in production
const criticalEnvVars = ['DATABASE_URI', 'PAYLOAD_SECRET']
for (const envVar of criticalEnvVars) {
  if (!process.env[envVar]) {
    if (isProduction) {
      throw new Error(`[FATAL] Missing critical environment variable: ${envVar}. Deployment cannot proceed without it.`)
    } else {
      console.warn(`⚠️ Missing critical environment variable in development: ${envVar}`)
    }
  }
}

// Operational variables that degrade gracefully or are optional
const optionalEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'NEXT_PUBLIC_SERVER_URL',
  'ADMIN_EMAIL',
]
for (const envVar of optionalEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️ Missing optional/integration environment variable: ${envVar} (falling back to defaults)`)
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
    const isHttpsProd =
      Boolean(process.env.VERCEL) ||
      (process.env.NODE_ENV === 'production' &&
        process.env.NEXT_PUBLIC_SERVER_URL?.startsWith('https') &&
        !process.env.NEXT_PUBLIC_SERVER_URL?.includes('localhost') &&
        Boolean(process.env.VERCEL_ENV))

    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.google-analytics.com https://static.hotjar.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
      "img-src 'self' data: https: blob: res.cloudinary.com images.unsplash.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.resend.com https://challenges.cloudflare.com wss: ws:",
      "frame-src https://challenges.cloudflare.com www.youtube.com player.vimeo.com",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "block-all-mixed-content",
      isHttpsProd ? 'upgrade-insecure-requests' : '',
    ]
      .filter(Boolean)
      .join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: cspDirectives,
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
            value: 'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()',
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
