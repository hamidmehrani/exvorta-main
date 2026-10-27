# Exvorta — Performance Budgets

## Rendering architecture — invariants

These are what keep the public site fast. Break one and the numbers below regress silently.

1. **Public routes are static (ISR, 5 min).** Never call `cookies()`, `headers()` or read `searchParams` in the root layout or in a page that should be cached. Cookie consent therefore lives in a plain client cookie (`exv_consent`, see `lib/consent.ts`) and `components/legal/ConsentAnalytics.tsx` loads GA/GTM after the visitor accepts.
2. **Read CMS globals with `getCachedGlobal(slug)`** (`lib/payload-cache.ts`, tag `global-<slug>`). Every global the shell reads needs a `revalidateGlobal(slug)` `afterChange` hook (`payload/hooks/revalidateGlobal.ts`); collections that feed static pages (Pages, Projects) revalidate in their own hooks.
3. **Keep the Payload admin out of public chunks.** Server components import `Link` from `@/components/ui/AppLink`, never `next/link`, and nothing under `components/admin/*` may import a module the public site also uses (the admin has its own `AdminBrandMark`). Otherwise webpack attaches the admin's ~1.5 MB chunk group to every public page. Check after a build: `grep -c "payload)/layout" .next/server/app/index.html` must print `0`.
4. **Motion never gates content on hydration.** Above the fold use CSS (`.rise`, `<StaggerText>`, `ExvortaLogo`); below the fold use `Reveal` / `AnimatedSection` / `StaggerContainer` (CSS transitions + the inline observer in `RevealScript`). Do not put framer `initial={{ opacity: 0 }}` on anything that can be the LCP element, and keep the hero paragraph un-animated.
5. **No `loading.tsx` on statically generated routes** — it wraps the page in a Suspense boundary whose skeleton paints before the content is swapped in (measurable CLS on the footer).
6. **Blocks are statically imported in `BlockRenderer`.** `dynamic(..., { ssr: false })` removes a block from the HTML; `dynamic()` with SSR streams it in after first paint.
7. **No paint-heavy decoration:** no `blur-[…]` filters, no page-sized SVG filters. Use gradients (`bg-[radial-gradient(...)]`) and the tiled `.noise-overlay`.
8. **New route folders go into `RESERVED_SLUGS`** in `app/(frontend)/[...slug]/page.tsx`, otherwise the CMS catch-all can pre-render a second HTML file at the same path.
9. **Images:** portfolio captures are produced with `scripts/capture-portfolio-screenshots.mjs` → `scripts/optimize-portfolio-captures.mjs` (1440 px WebP, ≤ 6400 px tall). Never commit multi-megabyte PNGs to `public/`.
10. **`next.config.ts` strips withPayload's `Critical-CH` / `Vary` hints from public routes** (they force a second document request in Chrome and fragment the CDN cache). Keep that wrapper when upgrading Payload.
11. **WebGL is lazy and optional.** `three` / `@react-three/fiber` are imported only from `components/three/*`, which is loaded
    via `next/dynamic(..., { ssr: false })` after idle (see `HomeHeroStage`, `ProcessStage`; every scene goes through `StageCanvas`). Check after a build that no chunk containing
    `WebGLRenderer` is referenced from `.next/server/app/index.html`. Measured when added: `/` first-load JS 191 → 197 kB (hero 4, process section 1, footer islands 1);
    the ~130 kB (gzip) three payload is on-demand only.

---

## Core Web Vitals Targets (Production)

| Metric | Full Name | Target | Max Threshold | Priority |
|--------|-----------|--------|---------------|---------|
| **LCP** | Largest Contentful Paint | < 2.5s | 4.0s | 🔴 Critical |
| **INP** | Interaction to Next Paint | < 200ms | 500ms | 🔴 Critical |
| **CLS** | Cumulative Layout Shift | < 0.1 | 0.25 | 🔴 Critical |
| **TTFB** | Time to First Byte | < 600ms | 1.5s | 🟡 Important |
| **FCP** | First Contentful Paint | < 1.8s | 3.0s | 🟡 Important |
| **TBT** | Total Blocking Time | < 200ms | 600ms | 🟡 Important |

---

## Lighthouse Score Targets

| Category | Target | Minimum |
|----------|--------|---------|
| Performance | ≥ 90 | 85 |
| Accessibility | ≥ 90 | 90 |
| Best Practices | ≥ 90 | 85 |
| SEO | ≥ 95 | 90 |

Run Lighthouse on all key routes: `/`, `/portfolio`, `/portfolio/[slug]`, `/rfq`, `/ecosystem`

---

## Bundle Size Budgets

| Bundle | Target | Max Allowed |
|--------|--------|-------------|
| Main JS (gzipped) | < 150 KB | 200 KB |
| Main CSS (gzipped) | < 40 KB | 75 KB |
| Per-page JS chunks | < 50 KB | 100 KB |
| Hero image (WebP) | < 150 KB | 300 KB |
| Average image | < 100 KB | 200 KB |

### Monitoring Bundle Sizes
```bash
ANALYZE=true npm run build
# Opens bundle analyzer in browser
```

---

## Animation Performance Targets

| Animation Type | Target FPS | Max Duration |
|----------------|------------|--------------|
| Scroll-triggered reveals | 60 fps | 800ms |
| Page transitions | 60 fps | 400ms |
| Hover micro-interactions | 60 fps | 300ms |
| Hero entrance | 60 fps | 1200ms |
| Lenis smooth scroll | 60 fps | Continuous |

**Rule:** All GSAP and Framer Motion animations must pass the Chrome DevTools Performance panel with no long frames (> 50ms) on a mid-range device.

---

## Image Delivery

All images served via **Cloudinary** with automatic:
- Format negotiation (WebP for modern browsers, JPG fallback)
- Quality auto-optimisation (`q_auto`)
- Responsive sizing (`w_auto`)

### Next.js Image Component
All images in components must use `next/image` (via `CMSImage`) — never raw `<img>` tags. This enforces:
- Lazy loading by default
- `width`/`height` specified (prevents CLS)
- `priority` prop for above-the-fold images (LCP)

---

## Font Performance

- **No external font services** — fonts self-hosted in `public/fonts/`
- Served with `Cache-Control: public, max-age=31536000, immutable`
- Use `font-display: swap` to prevent invisible text during load

---

## Server Performance

| Metric | Target |
|--------|--------|
| API route cold start | < 2s |
| `/api/health` response | < 100ms |
| Payload DB query (cached) | < 50ms |
| Payload DB query (cold) | < 500ms |
| ISR revalidation window | 300s (5 min) |

---

## Monitoring Checklist

### Post-Deployment
- [ ] Run `scripts/verify-deployment.sh <url>` — check all routes
- [ ] Run Lighthouse on `/` and `/portfolio` — scores ≥ 90
- [ ] Check Vercel Analytics dashboard — Web Vitals baselines
- [ ] Check Neon dashboard — query performance, connection pool

### Weekly
- [ ] Review Vercel Analytics for LCP/CLS regressions
- [ ] Check Umami for conversion rate changes
- [ ] Review Cloudinary bandwidth usage

### Monthly
- [ ] Full Lighthouse CI run on all routes
- [ ] Bundle size analysis (`ANALYZE=true npm run build`)
- [ ] Review slow DB queries in Neon Insights

---

## Performance Budget Exceptions

Some pages intentionally exceed typical budgets:

| Page | Exception | Reason |
|------|-----------|--------|
| `/ecosystem` | JS > 150 KB | Complex interactive SVG diagram with GSAP |
| `/portfolio/[slug]` | Larger image payload | High-fidelity case study photography |

These exceptions are accepted and should not trigger alerts.

---

## Optimisation Opportunities (Backlog)

- [ ] Move from `console.error` in layout to `reportError` from `lib/error-reporting.ts`
- [ ] Implement full CSP header with nonces (Next.js middleware)
- [x] ~~Add `preload` hints for hero images in layout~~ (hero has no image; fonts are preloaded by next/font)
- [x] ~~Evaluate `next/dynamic` lazy-loading for `EcosystemBlock`~~ — rejected: dynamic blocks are streamed after first paint (CLS) or missing from the HTML (SEO)
- [x] `optimizePackageImports` configured for framer-motion / gsap (lucide-react is not used)
- [ ] Replace hardcoded `lh3.googleusercontent.com` fallback images with Cloudinary assets
- [ ] Add `aria-label` to all icon-only buttons (Accessibility)
