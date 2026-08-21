# Pre-Deploy Checklist

> Run through this checklist **before every production deployment**.
> Date: ____________  Release: ____________  Author: ____________

---

## Code Quality

- [ ] `npx tsc --noEmit` — **0 TypeScript errors**
- [ ] `npm run lint` — **0 ESLint errors, 0 warnings**
- [ ] `npm run build` — **build succeeds without errors**
- [ ] No `console.log` in production code paths
- [ ] No unresolved `TODO` / `FIXME` / `HACK` comments blocking this release
- [ ] All new components follow Server Component default (no unnecessary `'use client'`)
- [ ] No raw hex colors or hardcoded domain URLs in components

## Security

- [ ] All new environment variables documented in `.env.example` and `DEPLOYMENT.md`
- [ ] No secrets or API keys committed to git
- [ ] Security headers verified in `next.config.ts` (X-Frame-Options, HSTS, etc.)
- [ ] New API routes have authentication checks
- [ ] Dev-only endpoints blocked for `NODE_ENV === 'production'`

## Database

- [ ] Required migrations created and tested on a dev Neon branch
- [ ] `payload.config.ts` has `push: false` (never `true` in production)
- [ ] Database backup taken before migration: `./scripts/backup-db.sh`
- [ ] Migration tested successfully on staging/preview environment

## Content

- [ ] Homepage content complete and reviewed
- [ ] All published pages have SEO meta title and description
- [ ] All published pages have OG image set
- [ ] All portfolio case studies have hero images
- [ ] No placeholder/lorem ipsum text visible in published content
- [ ] All internal links resolve correctly

## Functionality

- [ ] Contact/RFQ forms submit successfully (test end-to-end)
- [ ] Email notifications received at `ADMIN_EMAIL`
- [ ] Cloudflare Turnstile widget loads and validates
- [ ] Admin panel accessible at `/admin`
- [ ] All routes return 200 (no broken links to main pages)
- [ ] Mobile responsive — checked on iOS Safari and Android Chrome
- [ ] Cookie consent banner appears for new visitors

## Performance

- [ ] Lighthouse score ≥ 90 on `/` (run locally or on preview URL)
- [ ] Hero images have `priority` prop (above the fold LCP)
- [ ] All `next/image` usages have `width` and `height` set
- [ ] Large components (`EcosystemBlock`) do not block initial render

## Vercel Configuration

- [ ] All required environment variables set in Vercel Dashboard (Production)
- [ ] Build command: `npm run build`
- [ ] Install command: `npm install --legacy-peer-deps`
- [ ] `vercel.json` is committed and up to date
- [ ] `.vercelignore` is committed

## Analytics & Monitoring

- [ ] Umami script URL and Website ID configured in CMS Site Settings
- [ ] Google Analytics GA ID configured (if applicable)
- [ ] UptimeRobot (or equivalent) monitoring `/api/health`
- [ ] Vercel build failure notifications enabled

---

## Sign-off

| Check | Status |
|-------|--------|
| Code Quality | ☐ Pass / ☐ Fail |
| Security | ☐ Pass / ☐ Fail |
| Database | ☐ Pass / ☐ Fail |
| Content | ☐ Pass / ☐ Fail |
| Functionality | ☐ Pass / ☐ Fail |
| Performance | ☐ Pass / ☐ Fail |
| Vercel Config | ☐ Pass / ☐ Fail |
| Analytics | ☐ Pass / ☐ Fail |

**Approved to deploy:** ☐ YES / ☐ NO

**Approver:** ____________  **Date:** ____________

---

# Post-Deploy Checklist (First 24 Hours)

## Immediate (First Hour)

- [ ] Run `./scripts/verify-deployment.sh https://exvorta.com`
- [ ] All routes return 200 (check verify script output)
- [ ] Security headers present (check verify script output)
- [ ] `https://exvorta.com/api/health` returns `{"status":"healthy"}`
- [ ] Contact form submits and notification email arrives
- [ ] Admin panel login works at `https://exvorta.com/admin`
- [ ] No error spikes in Vercel Function Logs
- [ ] SSL certificate valid (browser shows 🔒)

## Short-term (First Day)

- [ ] Run Lighthouse on production URL — scores ≥ 90
- [ ] Umami analytics tracking pageviews
- [ ] Check Neon dashboard — no slow queries or connection pool exhaustion
- [ ] Test on iPhone Safari (iOS)
- [ ] Test on Android Chrome
- [ ] Check UptimeRobot monitor is green
- [ ] Verify cookie consent appears on first visit (incognito mode)

## Ongoing (First Week)

- [ ] Daily: check UptimeRobot status
- [ ] Day 3: review Vercel Analytics for CLS/LCP regressions
- [ ] Day 7: review Umami for conversion rates vs. pre-deploy baseline
- [ ] Week 1 end: run full Lighthouse CI on all key routes
