# Exvorta — Architecture Deep Dive

## 1. System Overview

The Exvorta Agency Engine is an enterprise-grade, white-label CMS platform for UAE/GCC B2B operators. Its core principle is **"Content Mapped to UI"** — structured Payload CMS data flows directly into statically typed Next.js Server Components, with zero CORS overhead and full end-to-end type safety.

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Client)                    │
│    React Hydration • Framer Motion • GSAP • Lenis        │
└──────────────────────────┬──────────────────────────────┘
                           │ HTML (SSR/ISR)
┌──────────────────────────▼──────────────────────────────┐
│              Next.js 15 — App Router                     │
│  ┌─────────────────┐   ┌────────────────────────────┐   │
│  │  Server Routes  │   │     Payload CMS Admin       │   │
│  │  (frontend)     │   │     /admin/*               │   │
│  └────────┬────────┘   └────────────────────────────┘   │
│           │ Local API (no HTTP)                          │
│  ┌────────▼────────────────────────────────────────┐    │
│  │           Payload CMS 3.0 Core                   │    │
│  │  Collections • Globals • Hooks • Access Control  │    │
│  └────────────────────┬────────────────────────────┘    │
└───────────────────────┼─────────────────────────────────┘
                        │ SQL (Drizzle ORM)
┌───────────────────────▼─────────────────────────────────┐
│                  Neon PostgreSQL                          │
│         (Serverless, branch-per-environment)             │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & Responsibilities

### `app/(frontend)/` — Public Pages
All public-facing routes rendered as Next.js Server Components.

| File/Dir | Purpose |
|---------|---------|
| `page.tsx` | Homepage — fetches `home` page from CMS and renders `BlockRenderer` |
| `portfolio/` | Archive page + `[slug]/` case study detail |
| `rfq/` | Request for Quotation form page |
| `waitlist/` | Early-access waitlist form page |
| `ecosystem/` | Interactive ecosystem visualisation page |
| `insights/` | Blog archive + `[slug]/` article detail |
| `[...slug]/` | Catch-all dynamic page handler (CMS-driven pages) |
| `layout.tsx` | **Shared layout**: Header, Footer, Lenis scroll, analytics, cookie consent |

**Data flow:**
```
layout.tsx → getPayloadClient() → payload.findGlobal('site-settings')
page.tsx   → getCachedPage('home') → BlockRenderer → [Block Components]
```

### `app/(payload)/` — Admin Panel
Auto-managed by `@payloadcms/next`. Mounts at `/admin`. Do not modify unless customising admin UI.

### `app/api/` — API Routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/health` | GET | None | Uptime check endpoint |
| `/api/revalidate` | POST | `x-revalidate-secret` header | ISR on-demand revalidation |
| `/api/dev/seed-page` | POST | `x-seed-secret` + dev only | Dev seeding (blocked in prod) |

### `components/blocks/` — CMS Block Renderers
Each file corresponds to one Payload block type. `BlockRenderer.tsx` is the dispatcher that reads `blockType` and routes to the correct component.

**Block catalog:**
- `HeroBlock` — Full-bleed hero with animated headline
- `FeatureGridBlock` — Feature cards in grid layout
- `FeatureShowcaseBlock` — Side-by-side feature detail
- `CTABlock` / `CTABannerBlock` — Call-to-action sections
- `StatsBlock` — Animated stat counters
- `ProductShowcaseBlock` — Premium product/service showcase
- `PortfolioShowcaseBlock` / `PortfolioArchiveBlock` / `PortfolioArchiveLayout` — Portfolio views
- `ProjectSingleLayout` — Case study detail layout
- `RoadmapBlock` — Timeline/roadmap visualisation
- `EcosystemBlock` — Interactive ecosystem diagram
- `ThesisBlock` / `VisionBlock` — Statement sections
- `ProblemStatementBlock` — Problem/solution framing
- `RichTextBlock` / `RichTextArticle` — Lexical rich text renderer
- `FAQBlock` / `TestimonialBlock` / `PricingBlock` / `ProcessBlock` — Stub blocks (render TBD)
- `InsightsArchive` — Blog post listing
- `WaitlistFormBlock` / `WaitlistClientForm` — Waitlist form
- `RFQFormBlock` — RFQ form wrapper
- `ContactFormBlock` — Contact form wrapper
- `MarqueeBlock` / `VideoBlock` — Media blocks
- `FounderBlock` / `TeamShowcaseBlock` — People sections
- `GlobalPresenceBlock` — Map/globe presence section

### `components/ui/` — Design System Primitives

| Component | Description |
|-----------|-------------|
| `Reveal` | GSAP ScrollTrigger-powered reveal on scroll |
| `SectionReveal` | Section-level reveal wrapper |
| `AnimatedHeadline` | Text split + stagger animation |
| `AnimatedImage` | Image reveal with clip-path animation |
| `MagneticButton` | Cursor-following magnetic hover effect |
| `CountUp` | Animated number counter |
| `Button` | Typed button/link primitive |
| `CMSImage` | Next.js Image + Cloudinary URL wrapper |
| `Marquee` | Infinite scroll ticker |
| `Container` | Max-width centered layout wrapper |
| `MonoLabel` | Uppercase monospace label pill |
| `Hairline` | 1px decorative rule |
| `ScrollProgress` | Page scroll progress indicator |
| `LoadingBar` | Route loading indicator |
| `Stat` | Stat display with value + label |
| `WhatsAppFloat` | Floating WhatsApp CTA button |

### `components/layout/` — Structural Layout

| Component | Description |
|-----------|-------------|
| `Header` / `HeaderClient` | Server + client split nav (transparent → solid on scroll) |
| `Footer` | CMS-driven footer with links |
| `PageWrapper` | Transition wrapper + page-level padding |
| `PageTransition` | Framer Motion page exit/enter animations |
| `DeferredWidgets` | Lazy-loaded: cookie banner, WhatsApp float, Umami script |

### `components/providers/` — Client Context Providers

| Provider | Library | Mount Point |
|----------|---------|------------|
| `SmoothScrollProvider` | Lenis | `app/(frontend)/layout.tsx` |
| `GSAPProvider` | GSAP | Internal (lazy-mounted via hooks) |
| `FramerMotionProvider` | Framer Motion | Internal (lazy-mounted) |

### `lib/` — Core Utilities

| File | Purpose |
|------|---------|
| `payload.ts` | `getPayloadClient()` singleton — cached across requests |
| `payload-cache.ts` | `unstable_cache` + React `cache` wrappers with ISR tags |
| `analytics.ts` | Umami event tracking + pre-defined event constants |
| `error-reporting.ts` | Error logging abstraction (swap for Sentry) |
| `animations.ts` | Shared GSAP animation config presets |

### `payload/` — CMS Schema

**Collections** (database tables):
- `Users` — Admin authentication
- `Pages` — CMS-driven pages with block layout
- `Posts` — Blog/insights articles
- `Projects` — Portfolio case studies
- `Media` — Cloudinary-backed file uploads
- `Leads` — Immutable form submission log
- `FormSubmissions` — Generic form data
- `Waitlist` — Email waitlist signups
- `Testimonials`, `Tags`, `Categories`, `Redirects` — Supporting data

**Globals** (singleton records):
- `SiteSettings` — Maintenance mode, cookie consent, Umami config
- `Navigation` — Main nav links
- `Footer` — Footer link columns
- `SEODefaults` — Fallback meta tags + Open Graph image
- `SocialLinks` — Social media URLs
- `WhatsAppConfig` — Float widget phone + message
- `Analytics` — GA / GTM IDs
- `Ecosystem` — Ecosystem diagram configuration

---

## 3. Data Flow

### Server Component Data Fetching

```typescript
// 1. Cached fetch via payload-cache.ts
const page = await getCachedPage('home')  // revalidates every 5 min or on webhook

// 2. Block rendering — purely structural
<BlockRenderer blocks={page.layout} />

// 3. BlockRenderer switches on blockType
// → renders the matching component with typed props
```

### ISR Strategy

| Content | Revalidation | Cache Tags |
|---------|-------------|-----------|
| Pages | `revalidate: 300` (5 min) | `pages`, `<slug>` |
| SEO defaults | `revalidate: 300` | `seo-defaults` |
| On-demand | `POST /api/revalidate` | Any tag |

### Form Submission Flow

```
User fills RFQ form
  → Cloudflare Turnstile validation (client-side widget)
  → Server Action fires
    → Verify Turnstile token (server-side API call)
    → Honeypot field check
    → payload.create('leads', { ... })
    → Resend email notification to ADMIN_EMAIL
  → Success state shown to user
```

---

## 4. Animation Architecture

Three libraries are used in complementary roles:

| Library | Role | When |
|---------|------|------|
| **GSAP** | Scroll-based reveals, complex timelines | Heavy scroll interactions |
| **Framer Motion** | Page transitions, hover micro-interactions | Component-level motion |
| **Lenis** | Smooth scroll physics | Always (wraps entire scroll) |

**Convention:** Use `Reveal` or `SectionReveal` components for scroll-triggered animations. Do NOT add raw GSAP code inside block components — use the animation presets from `lib/animations.ts`.

---

## 5. Internationalisation (i18n)

- Supported locales: `en`, `ar`, `fa`
- RTL support via Tailwind CSS v4 **logical properties** (`ms-`, `pe-`, `text-start`) — no directional duplicates
- The `dir` attribute is set on `<div>` in `layout.tsx` based on locale
- Translation strings in `i18n/` directory, managed by `next-intl`
- Font fallbacks in `globals.css` for each script system

---

## 6. Security Architecture

| Layer | Mechanism |
|-------|----------|
| HTTP Headers | `X-Frame-Options`, `HSTS`, `X-Content-Type-Options` (next.config.ts + vercel.json) |
| Forms | Cloudflare Turnstile + honeypot field |
| Admin Panel | Payload RBAC — `isAdmin` access control |
| API Routes | `x-revalidate-secret` header check against `PAYLOAD_SECRET` |
| Dev endpoints | Hard-blocked with `NODE_ENV === 'production'` check |
| Secrets | Vercel Environment Variables (never in code) |
| Console output | Stripped in production via `compiler.removeConsole` |

---

## 7. Key Design Decisions

### Why embed Payload in Next.js?
Single deployment unit, no CORS, direct Local API access from Server Components, zero network latency for CMS data.

### Why Neon PostgreSQL?
Serverless branching: production, preview, and development each get an isolated DB branch. ACID compliance for Payload's relational schema. Free tier for development.

### Why Cloudinary?
Payload's built-in media uploads don't scale well. The custom `storage-cloudinary` plugin replaces the upload target while keeping the admin UI unchanged.

### Why Turnstile over reCAPTCHA?
Invisible — no user friction. GDPR-safer than Google. First-party Cloudflare integration in UAE/GCC region.

### Why `--legacy-peer-deps`?
Payload CMS 3.x declares `next < 15.5.0` as a peer dep. React 19 / Next 15.5+ support is pending upstream. This flag prevents npm from rejecting the install.
