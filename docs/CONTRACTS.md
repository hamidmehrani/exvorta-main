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
| `/partners` | `app/(frontend)/partners/page.tsx` | Channel partner program portal (tax consultants, customs clearing agents, free-zone setup agencies). 20% recurring revenue share, commission ledger, referral workflow, and accreditation application form. | **Static UI** + client application form; dispatches partner inquiries to `submitLeadAction` (`actions/submitLead.ts`) with `source: 'RFQ'`, `tag: 'partner'`. |
| `/tools` | `app/(frontend)/tools/page.tsx` | Institutional trade utilities hub cataloging live export calculators, document generators, and upcoming compliance readiness modules. | **Static layout**; ItemList JSON-LD schema for search engine indexing; client email capture dispatching to `submitWaitlist`. |
| `/tools/docs-generator` | `app/(frontend)/tools/docs-generator/page.tsx` | Commercial export documentation generator for Commercial Invoices, Packing Lists, and CMR Consignment Notes. | **Client-side interactive state**; deterministic document generation with client PDF export and print formatting; lead capture via `submitWaitlist`. |
| `/tools/incoterm-cbm` | `app/(frontend)/tools/incoterm-cbm/page.tsx` | Incoterm 2020 risk transfer matrix and multi-cargo volumetric CBM / container fit calculator. | **Client-side calculation engine** (`lib/tools/incoterm-cbm`); deterministic calculations with zero runtime network overhead. |
| `/tools/incoterm-cbm/ar` | `app/(frontend)/tools/incoterm-cbm/ar/page.tsx` | Arabic localized mirror of the Incoterm & CBM logistics calculator. | **Deterministic static mirror**; Arabic localized calculation engine with RTL layout. |
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

### Social Proof Module (`components/social-proof/`, `lib/social-proof/`)
The Social Proof module provides institutional proof-of-execution infrastructure designed for immediate deployment and graceful transition to live client credentials as agreements are signed.

#### Visual Honesty Invariants
- **Zero Fabrication:** Never display counterfeit corporate logos, trademark infringements, or fabricated executive quotes pretending to be real clients.
- **Specimen Flagging:** Default configuration (`defaultSocialProofConfig`) flags all entries with `placeholder: true`. Components render visible, unambiguous institutional specimen notices (e.g., `[SLOT RESERVED: ...]`, `[SAMPLE SPECIMEN // PENDING CLIENT SIGN-OFF]`, `[BENCHMARK / TARGET]`).
- **Progressive Disclosure:** Once verified partner agreements are executed, setting `placeholder: false` and providing `logoUrl` or client credentials automatically switches cards to verified client styling.

#### Data Structures & Configuration (`lib/social-proof/social-proof-data.ts`)
- `ClientLogoItem`: Represents an institutional partner or client slot (`id`, `name`, `industry`, `tier`, `placeholder`, `placeholderLabel`, `logoUrl`, `websiteUrl`).
- `MetricCounterItem`: Quantitative operational metrics (`id`, `value`, `prefix`, `suffix`, `label`, `description`, `placeholder`, `placeholderLabel`).
- `TestimonialItem`: Executive review or specimen endorsement (`id`, `quote`, `authorName`, `authorRole`, `companyName`, `companySector`, `countryOrRegion`, `ratingValue`, `bestRating`, `verifiedTradeVolume`, `placeholder`, `placeholderLabel`).
- `SocialProofConfig`: Encapsulates `logos`, `counters`, and `testimonials`.

#### Component Architecture
- **`ClientLogoStrip`** (`components/social-proof/ClientLogoStrip.tsx`): Continuous horizontal marquee using `components/ui/motion/Marquee`. Renders dashed hairline technical cards for reserved slots and grayscale-to-contrast logos for verified partners. Honors `prefers-reduced-motion` and pauses on hover.
- **`MetricCounters`** (`components/social-proof/MetricCounters.tsx`): Monospace tabular numeral counters animated via `CountUp`, with benchmark target indicators and descriptive subtexts.
- **`TestimonialCard`** (`components/social-proof/TestimonialCard.tsx`): Institutional quote card featuring author credentials, trade sector, geographical badge, verified trade volume tag, rating indicator, and embedded Schema.org Review structured data.
- **`SocialProofSection`** (`components/social-proof/SocialProofSection.tsx`): Composite section assembling `SectionHeading`, `MetricCounters`, `TestimonialCard` grid, and `ClientLogoStrip` with embedded Schema.org `AggregateRating` JSON-LD.
- **Barrel Export** (`components/social-proof/index.ts`): Re-exports all components, config presets, and data helpers.

#### Structured Data (Schema.org Review & AggregateRating)
- `buildTestimonialJsonLd(item, siteUrl)`: Generates valid Schema.org `Review` object with `itemReviewed: { '@type': 'Organization', name: 'Exvorta' }`, `author`, `reviewRating`, and `reviewBody`.
- `buildAggregateRatingJsonLd(testimonials, siteUrl)`: Generates valid Schema.org `AggregateRating` calculating average rating and review counts. Gracefully returns `null` if the input is empty or invalid.

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
  - UAE E-Invoicing (PINT-AE) Readiness Assessment: `/tools/uae-einvoicing` <-> `/tools/uae-einvoicing/ar`
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

## 6. Tools Hub & ItemList JSON-LD Schema Invariants (TOOL-7)

The Trade Tools Hub (`/tools`) catalogs live and upcoming export utilities for international trade operators.

### 1. ItemList Structured Data Contract
To maximize indexing coverage across search engines and AI answer engines, the `/tools` index page MUST output a valid schema.org `ItemList` inside a `<script type="application/ld+json">` tag:
- **Root Object:**
  - `@context`: `"https://schema.org"`
  - `@type`: `"ItemList"`
  - `name`: `"Exvorta Trade Utilities & Export Engineering Tools"`
- **`itemListElement` Items:**
  - Array containing an entry for every cataloged tool (both live and roadmap).
  - Each item MUST specify:
    - `@type`: `"WebApplication"`
    - `name`: Exact public tool name
    - `description`: Formal summary of operational capability
    - `url`: Canonical or relative tool route (e.g. `/tools/incoterm-cbm`)
    - `applicationCategory`: Applicable category (e.g. `LogisticsApplication`, `BusinessApplication`)
    - `operatingSystem`: `"All"`
    - `offers`: Free public evaluation declaration (`@type: "Offer"`, `price: "0"`, `priceCurrency: "USD"`)

### 2. Catalog Invariants
- **Live Tools:** Must provide immediate, direct links to active browser utility routes (`/tools/incoterm-cbm`, `/tools/docs-generator`, `/rfq`).
- **Roadmap Tools:** Must route to notification / waitlist capture with query parameters (`/waitlist?tool=<slug>`).
- **Zero Paywalls:** All public trade utilities are deterministic, client-side or static, and free of billing gates.
- **Lead Capture:** The page email capture band integrates via `submitWaitlist` with `{ source: 'Tools Hub', collection: 'waitlist' }`.

---

## 7. Telemetry & Analytics Contract (Umami Event Taxonomy)

All client-side user interactions tracked via `trackEvent` (`lib/analytics.ts`) conform to a strict zero-PII privacy guarantee under UAE PDPL Article 6 and cookieless telemetry standards. Payloads never include personal names, email addresses, phone numbers, IP addresses, or sensitive client commercial terms.

### Event Taxonomy

| Event Name | Constant (`ANALYTICS_EVENTS`) | Payload Schema | Description |
| :--- | :--- | :--- | :--- |
| `tool_share` | `TOOL_SHARE` | `{ tool: string, method: 'whatsapp' \| 'copy_link' }` | Dispatched when a trade tool result or document is shared via WhatsApp deep-link or copied to clipboard permalink (zero PII). |
| `rfq_submitted` | `RFQ_SUBMITTED` | `{ industry?: string }` | Dispatched on successful multi-step RFQ submission. |
| `waitlist_joined` | `WAITLIST_JOINED` | `{ source?: string }` | Dispatched on product waitlist registration. |
| `contact_form_submitted` | `CONTACT_FORM_SUBMITTED` | `{ intent?: string }` | Dispatched on enterprise contact submission. |
| `whatsapp_clicked` | `WHATSAPP_CLICKED` | `{ location?: string }` | Dispatched on clicking floating WhatsApp widget or contact anchor. |
| `cta_clicked` | `CTA_CLICKED` | `{ target?: string }` | Dispatched on primary marketing call-to-action interactions. |
