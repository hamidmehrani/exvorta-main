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

### 2. Unit Testing Convention
- Every engine must have an accompanying test suite located in `lib/tools/<tool-name>.test.ts` (or `__tests__/tools/<tool-name>.test.ts`).
- Unit tests will run via **Vitest** (see ADR-004 proposal). Tests must achieve full branch coverage for calculation edge cases.

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
