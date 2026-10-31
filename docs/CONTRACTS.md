# Exvorta Codebase Contracts & Architecture Conventions

**Card:** GROUND-0 (`t_fad6cf4e`)  
**Status:** VERIFIED against `main` (commit baseline)  
**Owner:** Exvorta Architecture (`exvorta-architect`)  
**Audience:** All factory profiles (`exvorta-builder`, `exvorta-qa`, `exvorta-researcher`, `exvorta-reviewer`)

---

## 1. Route Inventory (`app/(frontend)`)

Every route under `app/(frontend)` is audited below. All frontend pages are rendered within `app/(frontend)/layout.tsx`, sharing the global institutional `Header` and `Footer`.

| Path | File Location | Purpose | Data Source & Fallback Strategy |
| :--- | :--- | :--- | :--- |
| `/` | `app/(frontend)/page.tsx` | Flagship institutional homepage for Exvorta. Presents hero value proposition, proof-of-execution portfolio archive, product showcase, roadmap, FAQ, and RFQ CTA banner. | **Payload CMS `pages` collection** (`getCachedPage('home')`). If CMS database is unseeded/unavailable, falls back to deterministic hardcoded layout blocks (`hero`, `portfolioArchive`, `productShowcase`, `roadmap`, `faq`, `ctaBanner`). Supports auth gating (`requiresAuth`). |
| `/[...slug]` | `app/(frontend)/[...slug]/page.tsx` | Dynamic catch-all for CMS pages and firm positioning (e.g. `/the-firm`, `/exvorta-web`, `/about`, `/web`). Redirects root case study slugs (`spicevo`, `nutave`, `stonvi`, `aurora`, `vanguard`) to `/portfolio/[slug]`. | **Payload CMS `pages` collection** via `getCachedPage(slug)` (`revalidate = 300`). Provides built-in block fallback layouts for `exvorta-web` and `the-firm`/`about`. Non-existent slugs return 404 with `robots: noindex`. |
| `/portfolio` | `app/(frontend)/portfolio/page.tsx` | Index of completed digital trade infrastructure, web systems, and CMS platforms engineered for global exporters. | **Payload CMS `projects` collection** (`payload.find({ collection: 'projects', limit: 10, depth: 1 })`). If database is unseeded, falls back to static baseline projects (`Spicevo`, `Nutave`, `Stonvi`). Renders `PortfolioArchiveBlock`. |
| `/portfolio/[slug]` | `app/(frontend)/portfolio/[slug]/page.tsx` | Deep-dive case study page detailing client trade profile, volume, export scope, and technical deliverables. | **Payload CMS `projects` collection** queried by `slug`. Falls back to static case study specifications in `components/blocks/case-study-data.ts`. |
| `/insights` | `app/(frontend)/insights/page.tsx` | Global trade intelligence, regulatory updates, export compliance guides, and editorial archive. | **Payload CMS `posts` collection** (`payload.find({ collection: 'posts', limit: 50, sort: '-publishedDate' })`). Falls back to baseline archive mode when CMS is empty. Renders `InsightsArchive`. |
| `/insights/[slug]` | `app/(frontend)/insights/[slug]/page.tsx` | Long-form trade intelligence article with rich-text content, author metadata, category badges, and reading time. | **Payload CMS `posts` collection** queried by `slug`. Lexical rich text content rendering with fallback error handling. |
| `/rfq` | `app/(frontend)/rfq/page.tsx` | Multi-step interactive Request for Proposal (RFQ) wizard allowing global traders to configure trade scope, volume, and service requirements. | **Client-side wizard state**; submits lead and scope parameters via the `submitRFQ` server action (`app/(frontend)/actions/submitRFQ.ts`) via Resend. |
| `/contact` | `app/(frontend)/contact/page.tsx` | Direct commercial and partnership inquiry portal. | **Static UI** + client contact form; dispatches inquiries to `submitLead` server action (`actions/submitLead.ts`). |
| `/waitlist` | `app/(frontend)/waitlist/page.tsx` | Early access registration for upcoming Exvorta trade software modules and tools. | **Static UI** + client email submission form; dispatches to `submitWaitlist` server action (`actions/submitWaitlist.ts`). |
| `/ecosystem` | `app/(frontend)/ecosystem/page.tsx` | Partner network, freight forwarder ecosystem, and compliance integrations directory. | **Static layout** composed of modular design system primitives and structured partner cards. |
| `/legal` | `app/(frontend)/legal/page.tsx` | Terms of service, privacy policy, trade data confidentiality terms, and compliance notices. | **Static layout** rendering legal provisions in typography tokens (`font-mono`, `text-muted`, `border-border`). |
| `/login` | `app/(frontend)/login/page.tsx` | Partner VIP portal authentication gate for authorized trade partners to access private client portals and documents. | **Payload CMS Authentication** (`payload.auth`). Authenticates credentials and sets session tokens. Protected infra path under `CARD_RISK=R2`. |

### API Endpoints (`app/api`)
- `app/api/health/route.ts` — Automated liveness probe returning JSON status 200 (`{ status: 'ok' }`).
- `app/api/revalidate/route.ts` — Webhook/admin endpoint to invalidate and revalidate Next.js cache tags upon CMS publication.
- `app/api/dev/seed-page/route.ts` — Development route used to seed default database pages.

---

## 2. Shared Primitives & Components

### Global Layout (`components/layout/`)
- **`Header` / `HeaderClient`** (`components/layout/Header.tsx`, `HeaderClient.tsx`): Persistent institutional navigation bar with animated logo, status indicator, navigation menu, and proposal CTA (`/rfq`). **Shared globally — never recreate or duplicate per page.**
- **`Footer` / `FooterContent`** (`components/layout/Footer.tsx`, `FooterContent.tsx`): Institutional four-column footer with company thesis, route indexes, regulatory disclaimers, and system status indicator. **Shared globally — never recreate or duplicate per page.**
- **`PageWrapper`** (`components/layout/PageWrapper.tsx`): Global container standardizing top padding against the fixed navigation bar.

### Core Design Primitives (`components/ui/`)
- **`Reveal`** (`components/ui/Reveal.tsx`): IntersectionObserver-driven scroll reveal utility. Controls entrance animations for headings and blocks. Standard: **all entrance motion must go through `Reveal` or designated animation components (`AnimatedButton`, `MagneticButton`) — no ad-hoc CSS animation or regex patch scripts.**
- **`Button` & `MagneticButton`** (`components/ui/Button.tsx`, `MagneticButton.tsx`): Institutional buttons adhering to `design-system.md` tokens (monospaced uppercase labels, brackets `[ LABEL ]`, border styles).
- **`SectionHeading`** (`components/ui/SectionHeading.tsx`): Section titles formatted with mono eyebrow `[ SECTION_LABEL ]`, high-contrast serif title, and optional subline.
- **`Container`** (`components/ui/Container.tsx`): Consistent max-width container (`max-w-7xl`, responsive padding `px-4 sm:px-6 lg:px-8`).
- **`AppLink`** (`components/ui/AppLink.tsx`): Internal route navigation wrapper ensuring consistent routing and prefetching.
- **`MonoLabel` & `Hairline`** (`components/ui/MonoLabel.tsx`, `Hairline.tsx`): Monospace metadata badges and 1px tokenized boundary dividers (`border-border`).

---

## 3. Architecture Conventions for Future Cards

Every builder and orchestrator card must adhere strictly to these conventions:

### 1. Pure Calculation Engines (`lib/tools/`)
- All business logic for trade tools (e.g. Incoterm matrix, CBM math, container fit, customs duty estimates) must live in **`lib/tools/<tool-name>.ts`**.
- **Purity Guarantee:** Pure engines must be 100% pure TypeScript. They must have **ZERO React imports**, **ZERO DOM references**, **ZERO network calls**, and **ZERO side effects**.
- Engines must be deterministic functions accepting typed input parameters and returning typed output objects.

### 2. Testing Conventions

#### Unit Testing (Vitest)
- **Harness & Runner:** Unit tests run via **Vitest** (`pnpm test` or `pnpm exec vitest run`, blueprint ADR-004).
- **Test Location & Colocation:** Tests may live alongside source modules (e.g. `lib/tools/<tool-name>.test.ts`, `utils/<util-name>.test.ts`) or within `__tests__/` (e.g. `__tests__/smoke.test.ts`, `__tests__/tools/<tool-name>.test.ts`).
- **Naming Convention:** Test files must use the pattern `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx`.
- **One-File-Per-Run Rule:** In resource-constrained environments (shared host / RAM gate), test runners during local development should target the active file under test (e.g. `pnpm exec vitest run <path/to/file.test.ts>`) rather than running the full suite continuously. Full test suites run at pre-commit and gate verification (`scripts/agent/gate.sh`).
- **Purity & Dependencies:** Tests for calculation engines and utilities must be pure and fast. Keep tests decoupled from DOM / jsdom dependencies unless UI component rendering is explicitly under test.

#### E2E Smoke Testing (Playwright)
- **Harness & Runner:** End-to-end smoke tests run via **Playwright** (`pnpm test:e2e` or `pnpm exec playwright test`).
- **Target & PREVIEW_URL Contract:** Tests evaluate against live remote preview deployments configured via `PREVIEW_URL` (e.g. `PREVIEW_URL=https://exvorta-preview.vercel.app pnpm test:e2e`).
- **Zero Local Dev Server (ADR-001):** Strictly no `webServer` configuration in `playwright.config.ts`. Tests never start local dev servers or background watchers.
- **Graceful Skip Behavior:** When `PREVIEW_URL` is unset, tests must cleanly skip with status `UNVERIFIED` without failing local gate or CI steps.
- **Shared Host Constraints (~16 GB RAM):** Strictly single browser instance (`chromium` / `Desktop Chrome`) and `workers: 1` to prevent memory exhaustion on shared host infrastructure.
- **Reviewer Verification:** Reviewers verify deployed preview branches by running `PREVIEW_URL=<vercel-preview-url> pnpm test:e2e`.

### 3. Email & Lead Capture Convention
- **Single Path Rule:** All lead capture, waitlist subscriptions, and contact submissions MUST route through the existing server actions:
  - General inquiries / enterprise contact: `actions/submitLead.ts`
  - Early access / product waitlist: `actions/submitWaitlist.ts`
  - Interactive proposal submissions: `app/(frontend)/actions/submitRFQ.ts`
- **NEVER** introduce a secondary email service, ad-hoc API route, or alternative Resend client. All lead interactions must consolidate through these sanctioned actions.

### 4. Design System Compliance
- Follow `design-system.md` and page-specific specifications in `Exvorta designs/<page>/`.
- **`code.html` is the visual specification:** port 1:1, never redesign or invent unapproved layouts.
- **`screen.png` is the acceptance test:** visual output must match screenshot references.
- **Token Discipline:** Never use raw hex colors or arbitrary font classes. Use design system variables and tokens (`bg-bg`, `text-text`, `bg-surface`, `border-border`, `text-muted`, `font-serif`, `font-mono`).

### 5. Risk Classes & Factory Gates
- **R0 (Additive):** New tools in `lib/tools/`, new standalone routes, new pure components, documentation. Verified by standard `scripts/agent/gate.sh`.
- **R1 (Modifications):** Edits to existing routes, shared components, or SEO metadata.
- **R2 (Infra / Schema):** Edits to `next.config.ts`, `payload.config.ts`, collections, `vercel.json`, `middleware.ts`, `app/(payload)`, `app/api`, or `app/(frontend)/login`. Requires explicit owner sign-off.
- **Docs Guard:** `docs/blueprint.md` is strictly manager-owned. Workers never edit `docs/blueprint.md` on `card/*` branches. All architecture recommendations must be proposed via card comments.

---

## 4. Arabic Locale Architecture & Internationalization Contract

### 1. Static Mirror Routing Strategy
- **Zero Heavy Runtime i18n:** Exvorta strictly avoids heavy runtime internationalization frameworks (such as `next-intl`, `react-i18next`, or middleware-based locale negotiation). All Arabic pages are served as deterministic, pre-rendered static mirror routes directly from the CDN with zero runtime execution overhead.
- **Path Mirror Pattern:** Arabic routes strictly mirror their English counterparts with an `/ar` path segment:
  - Institutional Homepage: `/` <-> `/ar`
  - Trade Tools Index: `/tools` <-> `/tools/ar`
  - Pricing & Engagement: `/pricing` <-> `/pricing/ar`
  - Incoterm & CBM Calculator: `/tools/incoterm-cbm` <-> `/tools/incoterm-cbm/ar`
- **Sitemap Registration:** All deployed static Arabic mirror routes must be registered in `STATIC_ROUTES` within `app/sitemap.ts` alongside their English counterparts, maintaining crawl-directive consistency with `robots.txt` (never indexing disallowed paths like `/admin`, `/login`, or `/api`).

### 2. Bidirectional Alternates Contract (hreflang)
Every page—whether English canonical or Arabic mirror—must declare explicit `alternates` metadata conforming to the following structure:
```ts
alternates: {
  canonical: '<canonical-url>',
  languages: {
    en: '<en-url>',
    ar: '<ar-url>',
    'x-default': '<en-url>',
  },
}
```

#### Invariants & Rules:
1. **Self-Referential Canonical:** The `canonical` field must match the exact canonical URL of the current page (`<en-url>` on the English page, `<ar-url>` on the Arabic page).
2. **Bidirectional Reciprocity:** Both the English and Arabic pages must declare identical `languages` objects referencing each other symmetrically:
   - On `<en-url>`: `languages.en = '<en-url>'`, `languages.ar = '<ar-url>'`.
   - On `<ar-url>`: `languages.en = '<en-url>'`, `languages.ar = '<ar-url>'`.
3. **`x-default` Fallback:** `languages['x-default']` must always resolve to the primary English route (`<en-url>`), ensuring global search crawlers have an unambiguous default for unlocalized regions.
4. **Implementation Helper:** Pages should use `@/lib/locale` helper `buildLocaleAlternates(enPath, locale)` or declare the shape directly in page `generateMetadata()`.

### 3. RTL & Logical Properties Architecture
1. **Root Language & Direction Wrapper:** All Arabic views and mirror layouts must mount a root wrapper declaring `dir="rtl"` and `lang="ar"`:
   ```tsx
   <div dir="rtl" lang="ar" className="...">
     {/* Arabic localized view tree */}
   </div>
   ```
2. **Strict CSS Logical Properties:** Never use physical left/right CSS utilities in bilingual or Arabic components. All spacing, borders, alignment, and positioning must utilize CSS logical properties:
   - **Margins:** Use `ms-*` (margin-inline-start) and `me-*` (margin-inline-end). Never use `ml-*` or `mr-*`.
   - **Paddings:** Use `ps-*` (padding-inline-start) and `pe-*` (padding-inline-end). Never use `pl-*` or `pr-*`.
   - **Text Alignment:** Use `text-start` and `text-end`. Never use `text-left` or `text-right` (except for code snippets, raw numeric IDs, or LTR-locked data tables wrapped in `dir="ltr"`).
   - **Borders:** Use `border-s-*` and `border-e-*`. Never use `border-l-*` or `border-r-*`.
   - **Insets & Positioning:** Use `start-*` and `end-*`. Never use `left-*` or `right-*`.
   - **Float / Clear:** Use `float-start` and `float-end`.

### 4. Font Stack & Typography Fallback Contract
1. **Self-Hosted Font Discipline:** Exvorta operates strictly without third-party CDNs, external Google Fonts, or hotlinked font files (adhering to zero-external-network policy).
2. **Typography Integrity:** Arabic typography renders cleanly using design-system fallbacks without breaking Playfair or Inter variables:
   - **Sans Fallback:** Uses `--font-sans` with high-legibility Arabic system fallbacks (`system-ui, -apple-system, 'Segoe UI', Tahoma, Arial, sans-serif`) and self-hosted Vazirmatn fallbacks, ensuring crisp letterforms for Arabic trade terms while preserving `--font-inter` for Latin scripts.
   - **Serif Accents:** Latin headings retain Playfair Display (`--font-playfair`), while Arabic headings gracefully fall back to clean, high-contrast typography without clipping, unintended line-height inflation, or layout shifts.
   - **Monospace Enclaves:** Code blocks, numeric container IDs, and calculation metrics retain `--font-mono` wrapped in `dir="ltr"` to preserve mathematical and tabular legibility.

---

## 5. Performance Budgets & Core Web Vitals (PLAT-05)

To guarantee high-speed responsiveness across GCC mobile networks and desktop clients, all routes must satisfy these performance contracts:

### 1. Font Loading & Self-Hosting
- **Zero Remote Font Dependencies:** No external font requests to Google Fonts (`fonts.googleapis.com` or `fonts.gstatic.com`).
- **Local Variable Fonts:** The Persian typeface Vazirmatn is self-hosted at `public/fonts/Vazirmatn-Variable.woff2` and configured via `next/font/local` in `app/(frontend)/layout.tsx` with `display: 'swap'` and `--font-vazirmatn` variable binding.
- **FOUT/CLS Prevention:** Font metrics and fallback serif/sans stacks are declared to prevent cumulative layout shift during font swaps.

### 2. Image Optimization & Layout Shift Prevention
- **Mandatory `sizes` Attribute:** Every `<Image>` using the `fill` layout must specify an accurate `sizes` attribute matching its responsive column/container bounds (e.g., `sizes="(min-width: 1024px) 50vw, 100vw"`). Omitting `sizes` triggers Next.js performance warnings and degrades responsive payload delivery.
- **LCP Image Priority:** Above-the-fold hero and featured video poster images must include `priority` to accelerate Largest Contentful Paint.
- **CLS Guarantee:** All image containers must enforce fixed aspect ratios (e.g. `aspect-[16/9]`, `aspect-[4/3]`, `aspect-video`) or explicit `width`/`height` to guarantee zero visual shift upon load.

### 3. Core Web Vitals Budgets
- **LCP (Largest Contentful Paint):** <= 2.5 seconds on simulated GCC 4G mobile profiles.
- **CLS (Cumulative Layout Shift):** <= 0.1 across all standard viewport widths.
- **Asset Transfer Budgets:** Initial HTML document <= 50 KB compressed; critical font payload <= 150 KB.

---

## 6. Analytics & Event Taxonomy Contract (Umami, PLAT-03)

Exvorta uses self-hosted Umami for privacy-first, zero-cookie-dependent behavioral analytics. All tracking adheres strictly to zero-PII and performance architecture contracts.

### 1. Infrastructure & Cost Model
- **Self-Hosted Umami Host:** `https://analytics.exvorta.com` (with fallback to `https://cloud.umami.is`).
- **Cost:** Zero monthly cost; run independently of third-party advertising ecosystems.
- **Content Security Policy (CSP):** `next.config.ts` explicitly whitelists `https://analytics.exvorta.com` and `https://cloud.umami.is` within both `script-src` and `connect-src` directives.

### 2. Loading Strategy & Performance Discipline
- **DeferredWidgets Integration:** The tracking script is deferred past initial paint via `<DeferredWidgets />` in `app/(frontend)/layout.tsx`.
- **Strategy:** `strategy="lazyOnload"` with a 3-second post-mount delay, ensuring **zero impact on LCP, FCP, and zero CLS** (Cumulative Layout Shift).
- **Configuration Fallback:** Script configuration reads `siteSettings.umamiWebsiteId` or falls back to `process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID`. The script URL defaults to `siteSettings.umamiScriptUrl || process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://analytics.exvorta.com/script.js'`.

### 3. Event Taxonomy (Standard Constants)
All client-side tracking dispatches through `trackEvent(eventName, data)` exported from `@/lib/analytics`. Five standard event constants are defined:
1. **`tool_result_generated`** (`TOOL_RESULT_GENERATED`): Triggered when interactive calculation or document generation states change.
   - Allowed properties: `tool_id`, `transport_mode`, `incoterm`, `doc_type`.
2. **`rfq_submit`** (`RFQ_SUBMIT`): Fired on successful enterprise Request for Proposal submission.
   - Allowed properties: `business_type`, `main_markets`, `budget`.
3. **`contact_submit`** (`CONTACT_SUBMIT`): Fired on successful institutional contact form submission.
   - Allowed properties: `form`.
4. **`waitlist_join`** (`WAITLIST_JOIN`): Fired on successful product waitlist registration.
   - Allowed properties: `source`.
5. **`tool_share`** (`TOOL_SHARE`): Fired on interactive tool result copying or export.
   - Allowed properties: `tool_id`, `method` (e.g. `copy_link`, `copy_report`, `print_pdf`).

### 4. Zero-PII Guarantee & Sanitization Contract
The client tracking utility (`sanitizeAnalyticsPayload`) enforces an uncompromising Zero-PII contract before any payload reaches `window.umami.track`:
- **Strict Key Blocklist:** Discards any key matching (case-insensitive and normalized): `email`, `phone`, `name`, `fullname`, `firstname`, `lastname`, `company`, `companyname`, `message`, `notes`, `token`, `turnstiletoken`, `botfield`, `ip`, `ipaddress`, `address`, `username`, `contactname`, `clientname`, and credentials.
- **Regex Inspection:** Inspects all string values with regex to catch and strip unkeyed email addresses (`EMAIL_REGEX`) and international/local phone numbers (`isPhone`).
- **Maximum String Length Clamping:** Drops string attributes exceeding 100 characters to prevent accidental leakage of freeform messages or payload blobs.
- **Nested Structures Dropped:** Rejects nested objects and arrays; retains only clean primitive strings, finite numbers, and booleans.
- **Empty Payload Elimination:** If sanitization strips all properties, returns `undefined`, preventing empty or contaminated metadata transmission.
- **SSR & Runtime Safety:** Safe in server-side rendering (`typeof window === 'undefined'`) and gracefully handles environments where `window.umami` or ad-blockers are active without throwing errors.
