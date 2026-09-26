# Exvorta — Agency Engine

> **B2B web design & digital infrastructure platform for UAE/GCC importers, exporters, and high-ticket B2B operators.**

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)](https://nextjs.org/)
[![Payload CMS](https://img.shields.io/badge/Payload_CMS-3.x-blueviolet)](https://payloadcms.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **Next.js 15** (App Router) | Server Components + Suspense |
| CMS | **Payload CMS 3.0** | Embedded in Next.js — no separate API server |
| Language | **TypeScript 5** (strict mode) | Full end-to-end type safety |
| Styling | **Tailwind CSS v4** | Logical properties for RTL support |
| Animations | **GSAP 3** + **Framer Motion 12** + **Lenis** | Scroll + micro-interactions |
| Database | **Neon PostgreSQL** | Serverless, branch-per-env |
| Media | **Cloudinary** | Optimised CDN delivery |
| Email | **Resend** | Transactional + lead notifications |
| Bot Protection | **Cloudflare Turnstile** | Invisible CAPTCHA on all forms |
| Analytics | **Umami** (self-hostable) + **Google Analytics** | Privacy-first, consent-gated |
| Hosting | **Vercel** | Edge-optimised, preview branches |
| Internationalisation | **next-intl** | en / ar / fa, RTL-aware |

---

## Quick Start (Local Development)

### 🚀 Quick Start

### Prerequisites
- Node.js v20.x or later
- pnpm v12.x or later
- Access to Neon PostgreSQL
- Cloudinary account
- Resend account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. Run database migrations:
   ```bash
   pnpm db:migrate
   ```

5. Start development server:
   ```bash
   pnpm dev
   ```

## 🔐 Security Checklist

- [ ] Set RESEND_API_KEY
- [ ] Configure TURNSTILE_SECRET_KEY
- [ ] Verify EMAIL_FROM_DOMAIN in Resend
- [ ] Rotate CLOUDINARY credentials
- [ ] Enable Rate Limiting
- [ ] Review CORS policies
- [ ] Enable Content Security Policy

## 📊 Environment Variables

See [.env.example](.env.example) for complete list.

---


### 1. Clone & Install
```bash
git clone <repo-url>
cd exvorta
pnpm install
```

> pnpm automatically runs build scripts for the approved packages (`sharp`, `esbuild`, etc. — see `allowBuilds` in `pnpm-workspace.yaml`). No manual `approve-builds` step needed.
>
> A postinstall script (`scripts/fix-payload-loadenv.mjs`) patches a known payload@3.x CLI bug that crashes `payload migrate` under tsx. It is idempotent; if payload updates upstream, it refuses to patch and tells you.

### 2. Environment Variables
```bash
cp .env.example .env
# Fill in all required values — see Required Variables below
```

### 3. Database
**Option A — Neon (recommended):**
1. Create a project at [neon.tech](https://neon.tech)
2. Copy the **pooled** connection string → `DATABASE_URI`
3. Copy the **direct** (unpooled) connection string → `DATABASE_URI_UNPOOLED`

Migrations automatically use `DATABASE_URI_UNPOOLED`; the app uses `DATABASE_URI`. Never swap them manually.

**Option B — Local Docker:**
```bash
npm run db:up
# Set DATABASE_URI=postgresql://postgres:postgres@localhost:5432/exvorta
```

### 4. Run Migrations
```bash
pnpm migrate
```

This applies everything in `migrations/` (site_settings, navigation, footer, pages, posts, media, users, etc.) and records them in `payload_migrations`.

Useful variants:
- `pnpm migrate:create <name>` — generate a new migration from schema changes
- `pnpm payload migrate:status` — show applied/pending
- `pnpm payload migrate:fresh` — drop everything and re-run (destructive)

### 5. Create First Admin User
```bash
pnpm dev
```
Open http://localhost:3000/admin — Payload shows the create-first-user screen.

### 6. Start Dev Server
```bash
pnpm dev
# App:   http://localhost:3000
# Admin: http://localhost:3000/admin
```

---

## Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URI` | ✅ | Neon **pooled** PostgreSQL connection string |
| `DATABASE_URI_UNPOOLED` | ✅ | Neon **direct** connection (migrations only) |
| `PAYLOAD_SECRET` | ✅ | 32+ char random secret for Payload encryption |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `RESEND_API_KEY` | ✅ | Resend API key for email notifications |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✅ | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | ✅ | Cloudflare Turnstile secret key |
| `NEXT_PUBLIC_SERVER_URL` | ✅ | Full public URL (e.g. `https://exvorta.com`) |
| `ADMIN_EMAIL` | ✅ | Email for lead notifications |
| `ENABLE_LEAD_EMAILS` | ✅ | `true` to send email on lead submission |
| `SKIP_TURNSTILE_IN_DEV` | Dev only | `true` to skip CAPTCHA locally |

---

## Project Structure

```
exvorta/
├── app/
│   ├── (frontend)/           # Public-facing pages (Server Components)
│   │   ├── page.tsx          # Homepage (renders CMS blocks)
│   │   ├── portfolio/        # Portfolio archive + case studies
│   │   ├── rfq/              # Request for Quotation form page
│   │   ├── waitlist/         # Waitlist landing page
│   │   ├── ecosystem/        # Ecosystem showcase
│   │   ├── insights/         # Blog/insights archive + articles
│   │   └── layout.tsx        # Shared header/footer, analytics, GDPR
│   ├── (payload)/            # Payload admin panel routes (auto-managed)
│   ├── api/
│   │   ├── health/           # GET /api/health — uptime check
│   │   ├── revalidate/       # POST /api/revalidate — ISR revalidation
│   │   └── dev/              # Dev-only seeding endpoints (blocked in prod)
│   ├── globals.css           # Design system tokens (Tailwind v4 variables)
│   ├── sitemap.ts            # Dynamic sitemap generation
│   └── robots.ts             # robots.txt
├── components/
│   ├── blocks/               # CMS block renderers (one per Payload block type)
│   ├── ui/                   # Reusable primitives (Button, Reveal, etc.)
│   ├── forms/                # Form components with validation + Turnstile
│   ├── layout/               # Header, Footer, PageWrapper, DeferredWidgets
│   ├── providers/            # GSAP, Framer Motion, Lenis context providers
│   ├── seo/                  # JSON-LD structured data components
│   ├── admin/                # Payload admin custom components (logo, widget)
│   └── live-preview/         # Payload live preview listener
├── lib/
│   ├── payload.ts            # getPayloadClient singleton
│   ├── payload-cache.ts      # Cached data fetchers (ISR-aware)
│   ├── analytics.ts          # Umami event tracking utility
│   ├── animations.ts         # GSAP animation presets
│   └── error-reporting.ts    # Error logging abstraction
├── payload/
│   ├── collections/          # Payload collection definitions
│   ├── globals/              # Payload global definitions
│   ├── blocks/               # Block field definitions (schema)
│   ├── fields/               # Reusable field groups
│   ├── access/               # Access control helpers (isAdmin, etc.)
│   └── storage-cloudinary/   # Custom Cloudinary storage plugin
├── utils/                    # Pure utility functions (generateMeta, etc.)
├── i18n/                     # next-intl config
├── scripts/                  # Dev/ops scripts (seed, migrate, backup, verify)
├── public/                   # Static assets
├── payload.config.ts         # Payload CMS configuration
├── next.config.ts            # Next.js configuration + security headers
├── vercel.json               # Vercel deployment configuration
└── tailwind.config.ts        # Tailwind CSS v4 configuration
```

---

## Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run db:up` | Start local Docker Postgres |
| `npm run db:down` | Stop local Docker Postgres |
| `npm run db:reset` | Wipe and restart local Postgres |
| `scripts/verify-deployment.sh` | Post-deploy smoke tests |
| `scripts/backup-db.sh` | Backup Neon database to SQL file |
| `scripts/take-screenshots.js` | Playwright screenshot capture |

---

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for full step-by-step Vercel deployment guide.

---

## Architecture

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for deep technical documentation.

---

## Content Management

See **[CMS_ADMIN_GUIDE.md](./CMS_ADMIN_GUIDE.md)** for editor documentation.

---

## Contributing

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for developer guidelines.

---

## Known Issues & Security Notes

> See inline Known Issues in this README and the full audit in [DEPLOYMENT.md](./DEPLOYMENT.md).

- **Next.js 15.4.x vulnerability:** Payload CMS restricts `next < 15.5.0`. The High-severity audit finding cannot be resolved until Payload updates its peer dep. Do not force-upgrade.
- **esbuild moderate:** Dev-only transitive dep via `drizzle-kit`. Not in production bundle.
- **dompurify/monaco-editor:** Admin-only exposure, behind authentication. Mitigation in place.

---

## License

Proprietary — Exvorta Agency Engine. All rights reserved.
