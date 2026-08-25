/**
 * Boilerplate Configuration
 * -------------------------
 * This project uses a modular architecture.
 *
 * Locales:
 * Currently active: 'en', 'ar', 'fa'
 */

import { buildConfig } from 'payload'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
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
import Categories from './payload/collections/Categories'
import Projects from './payload/collections/Projects'
import Certifications from './payload/collections/Certifications'
import FormSubmissions from './payload/collections/FormSubmissions'
import Waitlist from './payload/collections/Waitlist'

// Globals
import SiteSettings from './payload/globals/SiteSettings'
import Navigation from './payload/globals/Navigation'
import Footer from './payload/globals/Footer'
import SEODefaults from './payload/globals/SEODefaults'
import SocialLinks from './payload/globals/SocialLinks'
import WhatsAppConfig from './payload/globals/WhatsAppConfig'
import Ecosystem from './payload/globals/Ecosystem'

import Analytics from './payload/globals/Analytics'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Migration commands (payload migrate / migrate:fresh / etc.) must hit Neon's
// DIRECT (unpooled) endpoint: PgBouncer in front of the pooled endpoint breaks
// the long-running advisory-lock transactions migrations use. The app itself
// keeps the pooled URI. PAYLOAD_MIGRATING is set too late to use here (after
// this module evaluates), hence the argv sniff.
const isMigrateCommand = process.argv.some((arg) => arg.includes('migrate'))
const dbConnectionString =
  (isMigrateCommand ? process.env.DATABASE_URI_UNPOOLED : undefined) ||
  process.env.DATABASE_URI ||
  (() => {
    throw new Error(
      isMigrateCommand
        ? 'DATABASE_URI_UNPOOLED is required for migrations'
        : 'DATABASE_URI is required',
    )
  })()

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠️ CLOUDINARY ENVS MISSING: Media uploads will fail.');
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Exvorta OS',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/AgencyLogo',
      },
      beforeDashboard: ['@/components/admin/WelcomeWidget'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: process.env.NEXT_PUBLIC_SERVER_URL || '',
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
    Categories,
    Projects,
    Certifications,
    FormSubmissions,
    Waitlist,
  ],
  globals: [
    SiteSettings,
    Navigation,
    Footer,
    SEODefaults,
    SocialLinks,
    WhatsAppConfig,
    Ecosystem,

    Analytics,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || (() => { throw new Error('PAYLOAD_SECRET is required') })(),
  db: vercelPostgresAdapter({
    // vercelPostgresAdapter ignores its top-level `connectionString` arg — it
    // connects via POSTGRES_URL env or pool.connectionString (see its
    // connect()). Pass pool.connectionString explicitly so the pooled/unpooled
    // selection above actually takes effect.
    pool: {
      connectionString: dbConnectionString,
      // single connection while migrating: migrations take advisory locks and
      // a multi-connection pool can deadlock against itself
      ...(isMigrateCommand ? { max: 1 } : {}),
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

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
