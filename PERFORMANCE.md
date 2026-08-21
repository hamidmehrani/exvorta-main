# Exvorta — Performance Budgets

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
- [ ] Add `preload` hints for hero images in layout
- [ ] Evaluate `next/dynamic` lazy-loading for `EcosystemBlock` (37KB component)
- [ ] Add `optimizePackageImports` for `lucide-react` in `next.config.ts`
- [ ] Replace hardcoded `lh3.googleusercontent.com` fallback images with Cloudinary assets
- [ ] Add `aria-label` to all icon-only buttons (Accessibility)
