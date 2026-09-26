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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.google-analytics.com https://static.hotjar.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https: blob: res.cloudinary.com images.unsplash.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.resend.com https://challenges.cloudflare.com wss:// ws://; frame-src https://challenges.cloudflare.com www.youtube.com player.vimeo.com; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; block-all-mixed-content; upgrade-insecure-requests;",
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
            value: 'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()'
          },
        ],
      },
}

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withPayload(analyzer(nextConfig))
