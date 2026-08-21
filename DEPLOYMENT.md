# Exvorta — Deployment Guide

## Overview

Exvorta is deployed on **Vercel** with **Neon PostgreSQL** as the serverless database and **Cloudinary** for media. This guide covers the complete production deployment workflow.

---

## Pre-Deployment Checklist

Run through `PRE_DEPLOY_CHECKLIST.md` before every production release.

**Quick check:**
```bash
# TypeScript
npx tsc --noEmit

# ESLint
npm run lint

# Build
npm run build
```

---

## Environment Variables

Set all of these in the Vercel Dashboard → Project → Settings → Environment Variables.

### Production Environment

| Variable | Value / Source | Notes |
|----------|---------------|-------|
| `DATABASE_URI` | Neon Dashboard → Connect → Pooled | Use `-pooler` hostname |
| `DATABASE_URI_UNPOOLED` | Neon Dashboard → Connect → Direct | No `-pooler`, for migrations only |
| `PAYLOAD_SECRET` | `openssl rand -base64 32` | Min 32 chars. Rotate carefully — invalidates all sessions |
| `NEXT_PUBLIC_SERVER_URL` | `https://exvorta.com` | No trailing slash |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard | Your cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard → API Keys | |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard → API Keys | Mark as Secret in Vercel |
| `RESEND_API_KEY` | Resend Dashboard → API Keys | |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Dashboard → Turnstile | Site-specific |
| `TURNSTILE_SECRET_KEY` | Cloudflare Dashboard → Turnstile | Mark as Secret in Vercel |
| `ADMIN_EMAIL` | Your admin inbox | For lead notification emails |
| `ENABLE_LEAD_EMAILS` | `true` | Set `false` to silence email on submit |
| `NEXT_PUBLIC_ADMIN_TITLE_SUFFIX` | `- Exvorta Agency Engine` | Admin panel branding |

### Preview Environment (same as Prod except:)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SERVER_URL` | The Vercel preview URL or custom preview domain |
| `DATABASE_URI` | A separate Neon **branch** for preview isolation |

### Development Environment

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SERVER_URL` | `http://localhost:3000` |
| `SKIP_TURNSTILE_IN_DEV` | `true` |
| `DATABASE_URI` | Local Docker or Neon dev branch |

---

## Vercel Project Setup

### First-Time Setup

1. **Import repository** in the Vercel Dashboard
2. Set **Framework Preset** to `Next.js`
3. Set **Build Command**: `npm run build`
4. Set **Install Command**: `npm install --legacy-peer-deps`
5. Set **Output Directory**: `.next` (default)
6. Add all environment variables from the table above

### `vercel.json` Configuration

The project ships with a `vercel.json` that configures:
- **Region**: `iad1` (US East — optimal for Neon)
- **Security headers** on all routes
- **Cache-Control** headers: immutable for static assets, no-store for API
- **Build and install commands**

---

## Database Migrations in Production

> ⚠️ **Never run `push: true`** in `payload.config.ts` in production. Always use explicit migrations.

### Running a Migration on Vercel

Migrations must be run **before** the new code that depends on them is deployed.

**Option A — Vercel Build Step (recommended):**

Add a `migrate` script to `package.json`:
```json
{
  "scripts": {
    "migrate": "NODE_OPTIONS='--require ./scripts/next-env-shim.cjs' npx tsx scripts/run-migration.ts run"
  }
}
```

Then in Vercel Dashboard, change Build Command to:
```bash
npm run migrate && npm run build
```

**Option B — Manual via Neon Console:**

Run raw SQL from the `migrations/` directory directly in the Neon SQL editor.

---

## Deployment Workflow

### Standard Deployment

```bash
# 1. Backup database first
./scripts/backup-db.sh

# 2. Push to main branch (Vercel auto-deploys)
git push origin main

# 3. Monitor build in Vercel Dashboard

# 4. Verify after deployment
./scripts/verify-deployment.sh https://exvorta.com
```

### Deploying via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Link project (first time)
vercel link

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

---

## Domain Configuration

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add `exvorta.com` and `www.exvorta.com`
3. Configure your DNS (see Vercel's instructions per registrar):
   - `A` record: `76.76.21.21`
   - `CNAME` record: `cname.vercel-dns.com` (for `www`)
4. SSL certificate is auto-provisioned via Let's Encrypt (takes ~1 min)
5. HSTS is enforced via the `Strict-Transport-Security` header in `next.config.ts`

---

## Rollback Procedure

If a deployment causes issues:

### Quick Rollback (< 5 minutes)

```bash
# Via Vercel CLI
vercel rollback

# Or via Dashboard: Deployments → ··· → Promote to Production (select previous good deploy)
```

### Full Rollback (with DB schema changes)

1. Identify the failing deployment in Vercel Dashboard
2. Roll back the code via `vercel rollback` or Dashboard
3. If schema changed, restore the database:
   ```bash
   # From a recent backup
   psql "$DATABASE_URI" < backups/exvorta_backup_YYYYMMDD_HHMMSS.sql
   ```
4. Verify rollback:
   ```bash
   ./scripts/verify-deployment.sh https://exvorta.com
   ```
5. Investigate root cause before redeploying

---

## Webhook Configuration

### ISR Revalidation Webhook

Payload CMS can trigger on-demand ISR via the `/api/revalidate` endpoint.

**Endpoint:** `POST /api/revalidate`

**Headers required:**
```
x-revalidate-secret: <your PAYLOAD_SECRET>
Content-Type: application/json
```

**Body:**
```json
{ "collection": "pages", "slug": "home" }
```

To configure in Payload: Add an `afterChange` hook to your collection that POSTs to this endpoint.

---

## Monitoring & Observability

### Vercel Built-in
- **Analytics**: Vercel Dashboard → Analytics tab (Web Vitals)
- **Logs**: Vercel Dashboard → Deployments → Functions tab (real-time logs)
- **Error tracking**: Vercel Dashboard → Observability

### Umami Analytics
- Configure via CMS Admin → Analytics global
- Set `UMAMI_WEBSITE_ID` and `UMAMI_SCRIPT_URL` in site settings (or env vars)
- Fires only after cookie consent

### Recommended External Tools
- **Uptime monitoring**: [UptimeRobot](https://uptimerobot.com) — monitor `/api/health`
- **Error tracking**: [Sentry](https://sentry.io) — integrate with `lib/error-reporting.ts`
- **Performance**: [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## Security Considerations

### Headers
All security headers are configured in `next.config.ts` and `vercel.json`:
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME-type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

### Missing: Content-Security-Policy
A full CSP header is not yet implemented globally (Next.js middleware nonce approach is required for inline scripts from GSAP/Framer Motion). Add this as the next security milestone.

**Suggested CSP policy for reference:**
```
default-src 'self';
script-src 'self' 'nonce-{nonce}' challenges.cloudflare.com cloud.umami.is;
style-src 'self' 'unsafe-inline';
img-src 'self' data: res.cloudinary.com lh3.googleusercontent.com;
connect-src 'self' cloud.umami.is;
font-src 'self';
frame-src challenges.cloudflare.com;
```

### Secrets Management
- All secrets in Vercel Dashboard → never in code
- `PAYLOAD_SECRET` change invalidates ALL admin sessions
- Cloudinary API Secret — rotate quarterly

---

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| TTFB | < 600ms |
| Lighthouse Score | ≥ 90 |
| Main JS Bundle | < 200 KB |

See `PERFORMANCE.md` for full budget details.

---

## Contacts & Access

| Resource | Location |
|----------|---------|
| Vercel Dashboard | https://vercel.com/dashboard |
| Neon Dashboard | https://console.neon.tech |
| Cloudinary Console | https://cloudinary.com/console |
| Resend Dashboard | https://resend.com/dashboard |
| Cloudflare Dashboard | https://dash.cloudflare.com |
| CMS Admin | https://exvorta.com/admin |
