/**
 * Boilerplate Configuration
 * -------------------------
 * This project uses a modular architecture.
 * To enable the Export Trade module (Origins, Certifications, and B2B fields for Products),
 * set `exportTrade: true` in `boilerplate.config.ts` located at the project root.
 *
 * Locales:
 * Currently active: 'en', 'ar', 'fa'
 * To enable 'tr' and 'es', uncomment them in the localization.locales array below
 * and ensure their translation files exist in the `/translations` folder.
 */

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudinaryStorage } from './payload/storage-cloudinary'
import path from 'path'
import { fileURLToPath } from 'url'
import { boilerplateConfig } from './boilerplate.config'

// Collections
import Users from './payload/collections/Users'
import Pages from './payload/collections/Pages'
import Posts from './payload/collections/Posts'
import Media from './payload/collections/Media'
import Leads from './payload/collections/Leads'
import Testimonials from './payload/collections/Testimonials'
import Tags from './payload/collections/Tags'
import Redirects from './payload/collections/Redirects'
import Products from './payload/collections/Products'
import Categories from './payload/collections/Categories'
import Origins from './payload/collections/modules/export-trade/Origins'
import Certifications from './payload/collections/modules/export-trade/Certifications'

// Globals
import SiteSettings from './payload/globals/SiteSettings'
import Navigation from './payload/globals/Navigation'
import Footer from './payload/globals/Footer'
import SEODefaults from './payload/globals/SEODefaults'
import SocialLinks from './payload/globals/SocialLinks'
import WhatsAppConfig from './payload/globals/WhatsAppConfig'
import CookieConsent from './payload/globals/CookieConsent'
import GlobalPromos from './payload/globals/GlobalPromos'
import Analytics from './payload/globals/Analytics'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠️ CLOUDINARY ENVS MISSING: Media uploads will fail.');
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: process.env.NEXT_PUBLIC_ADMIN_TITLE_SUFFIX || '- Admin',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/AgencyLogo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
      collections: ['pages', 'posts'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    Users,
    Pages,
    Posts,
    Media,
    Leads,
    Testimonials,
    Tags,
    Redirects,
    Products,
    Categories,
    ...(boilerplateConfig.modules.exportTrade ? [Origins, Certifications] : []),
  ],
  globals: [
    SiteSettings,
    Navigation,
    Footer,
    SEODefaults,
    SocialLinks,
    WhatsAppConfig,
    CookieConsent,
    GlobalPromos,
    Analytics,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || (() => { throw new Error('PAYLOAD_SECRET is required') })(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? (() => { throw new Error('DATABASE_URI is required') })(),
      max: 20,
      idleTimeoutMillis: 10000,
    },
    push: false,
  }),
  plugins: [
    cloudinaryStorage({
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
        api_key: process.env.CLOUDINARY_API_KEY || '',
        api_secret: process.env.CLOUDINARY_API_SECRET || '',
      },
      collections: {
        media: true, // We should map it to our newly created 'media' collection
        pages: false,
      },
    }),
  ],
  localization: {
    locales: [
      'en',
      'ar',
      'fa',
      // 'tr', // Uncomment to enable Turkish
      // 'es', // Uncomment to enable Spanish
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
