import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudinaryStorage } from '@payloadcms/storage-cloudinary'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import Users from './payload/collections/Users'
import Pages from './payload/collections/Pages'
import Posts from './payload/collections/Posts'
import Media from './payload/collections/Media'
import Leads from './payload/collections/Leads'
import Portfolio from './payload/collections/Portfolio'
import Services from './payload/collections/Services'
import Testimonials from './payload/collections/Testimonials'
import Team from './payload/collections/Team'
import Certificates from './payload/collections/Certificates'

// Globals
import SiteSettings from './payload/globals/SiteSettings'
import Navigation from './payload/globals/Navigation'
import Footer from './payload/globals/Footer'
import SEODefaults from './payload/globals/SEODefaults'
import SocialLinks from './payload/globals/SocialLinks'
import WhatsAppConfig from './payload/globals/WhatsAppConfig'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Agency Engine CMS',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/WhiteLabelLogo',
        Icon: '@/components/admin/WhiteLabelLogo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
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
    Portfolio,
    Services,
    Testimonials,
    Team,
    Certificates,
  ],
  globals: [
    SiteSettings,
    Navigation,
    Footer,
    SEODefaults,
    SocialLinks,
    WhatsAppConfig,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-for-local-development-1234567890',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
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
    locales: ['en', 'ar', 'fa'],
    defaultLocale: 'en',
    fallback: true,
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
