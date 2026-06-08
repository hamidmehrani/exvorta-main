# EXVORTA: Agency Boilerplate Engine Architecture

## 1. System Overview
The **Exvorta Agency Boilerplate Engine** is an enterprise-grade, B2B white-labeled CMS foundation. It is designed to rapidly deploy premium, highly customized websites for UAE/GCC importers, exporters, and serious B2B operators.

At its core, the architecture enforces a strict **"Content Mapped to UI" philosophy**:
- **Separation of Concerns:** The Payload CMS handles structured data and content blocks, completely decoupled from the frontend presentation logic.
- **Strict Design Constraints:** The frontend relies on a premium, dark-themed design system tailored for high-ticket B2B businesses (think Bloomberg Terminal meets modern SaaS), utilizing Tailwind CSS v4 logic properties and CSS variables for cohesive theming.
- **Universal Block System:** Editors assemble pages via high-fidelity "Blocks" (Hero, Pricing, Stats) natively injected from Payload into Next.js frontend components.

## 2. Tech Stack & Infrastructure

- **Frontend Framework:** Next.js 15 (App Router). Utilized for its advanced server components, native Suspense loading boundaries, and superior SEO rendering capabilities.
- **Styling:** Tailwind CSS v4. Using logical properties (`ms-`, `pe-`, `border-s-`) rather than directional utilities for seamless RTL support out of the box.
- **CMS / Backend:** Payload CMS 3.0. Integrated natively with Next.js, allowing direct server-side fetching without standing up an independent API server. It manages schema generation, database mapping, and the admin panel UI natively within Next.js.
- **Database & Local Dev:** PostgreSQL orchestrated via a local Docker container (`docker-compose.yml`). Chosen for enterprise ACID compliance, scalability, and deep integration with `@payloadcms/db-postgres`.
- **Media Storage:** Cloudinary integration for scalable, optimized image and document distribution.

### Why this stack?
This combination delivers an "invisible architecture." By embedding Payload directly into Next.js 15, we eliminate CORS issues, remove redundant network bottlenecks, and enable end-to-end type safety between the CMS schema and frontend React components. Everything builds and deploys as a singular unit.

## 3. Core Engines & Features

### i18n & RTL Engine
- **Localization:** Managed by `next-intl`. The `[locale]` dynamic route boundary encapsulates the entire frontend (`app/(frontend)/[locale]/layout.tsx`), serving structured dictionaries from `/messages`.
- **RTL Layout Shifts:** The HTML `dir` attribute is dynamically injected based on the locale parameter (`ltr` for `en`, `rtl` for `ar` and `fa`). 
- **Font Swapping & Logical Styles:** `app/globals.css` dynamically applies the optimal font stack (system-ui / sans-serif optimized for English, Arabic, and Persian) based on `html[dir]`. We enforce strict Tailwind logical properties (e.g., `text-start` instead of `text-left`) to mirror layouts automatically without duplicating UI code or triggering Flash of Unstyled Content (FOUC).

### Automated Technical SEO
- **Dynamic Meta:** `generateMetadata` dynamically fetches base configurations from Payload's `SEODefaults` global, appending localized fallbacks. Individual page records then seamlessly override these defaults.
- **Sitemap Generation:** Next.js `sitemap.ts` programmatically queries the `Pages`, `Posts`, and `Portfolio` collections from the database, generating deeply nested, localized URL maps for superior search indexing.
- **Structured Data:** The `OrganizationSchema` component injects clean JSON-LD natively into the `<head>` to enhance rich snippets and B2B search visibility based on the global CMS settings.

### Security & Lead Automation
- **The Invisible Shield:** The contact pipeline uses Next.js Server Actions backed by Cloudflare Turnstile (`@marsidev/react-turnstile`) and a hidden honeypot field, blocking automated bots without impacting the premium UX.
- **Resend Email Hooks:** Through `resend`, Payload's `Leads` collection triggers server-side hooks upon submission. This architecture securely dispatches automated enterprise notifications and prepares the payload for external CRM syncing, completely isolating the logic from the client.

### RBAC & White-labeling
- **Role-Based Access Control:** Critical globals and core settings are strictly protected by the `isAdmin.ts` utility. This ensures only super-admins can modify structural configurations, while editors are scoped exclusively to content curation.
- **White-labeling:** Payload's configuration is meticulously stripped of default branding. It injects a generic `WhiteLabelLogo` into `admin.components.graphics`, maintaining the boilerplate's status as a pure structural tool for agency deployment.

## 4. Data Schema & The Block Library

### The Collections
- **`Pages` & `Posts`**: Core content delivery. `Pages` leverage the Universal Block Engine for dynamic composition.
- **`Portfolio`, `Services`, `Team`, `Testimonials`**: Structured B2B entities mapping to dedicated list and detail views.
- **`Certificates`**: The B2B Document Vault for tracking ISOs, licenses, and corporate verifications.
- **`Leads`**: Immutable repository capturing all authenticated form submissions.
- **`Users` & `Media`**: System authentication and asset orchestration.

### The Globals
- **`SiteSettings`**: The central nervous system for theming (CSS hex injection), GDPR consent rules, and Analytics (Umami tracking identifiers).
- **`Navigation` & `Footer`**: Multi-column layout controllers for global navigation.
- **`SEODefaults`**: Baseline meta tags and open graph images.
- **`WhatsAppConfig` & `SocialLinks`**: Global lead magnets and social signals.

### The Universal Block Library
A dynamic mapping layer translates Payload JSON nodes into native React components.
- **Available Blocks:** Hero, FeatureGrid, CTA, ContactForm, FAQ, Pricing, Process, Stats, Testimonial, Video, Marquee, and RichText.
- **Block-to-Component Mapping:** The rendering engine iterates through an array of block objects delivered from Payload. It reads the `blockType` and dynamically loads the corresponding Next.js Server Component from `components/blocks/`, directly passing the typed properties. This strict "content dictates UI" rule enforces design consistency while offering editors limitless structural creativity.

## 5. Developer Workflow

### Command Lifecycle
The development engine is streamlined to start in seconds:
1. **`npm run db:up`**: Spins up the localized PostgreSQL instance in the background via Docker Compose.
2. **`npm run dev`**: Boots the Next.js server, initializes the Payload integration, and dynamically generates TypeScript interfaces (`payload-types.ts`) based on the collections.
3. Access the application at `http://localhost:3000` and the Admin CMS at `http://localhost:3000/admin`.
4. **`npm run db:down`** / **`npm run db:reset`**: Safely spin down or completely reset the database volumes for fresh development cycles.

### Future "Stitch to Production" AI Pipeline
For future deployment operations, the engine is designed for automated generation:
1. **Clone & Scaffold:** The boilerplate repository is duplicated.
2. **Theme Injection:** AI reads the specific client's brand guidelines, modifies `globals.css` base colors, and populates the Payload `SiteSettings` seed script.
3. **Deploy:** The unified codebase is pushed to production (e.g., Vercel), attaching the remote Postgres URL. The entire infrastructure is "stitched" and goes live in minutes, transforming this boilerplate into a bespoke $10M B2B platform.
