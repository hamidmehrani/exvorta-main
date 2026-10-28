# Launch Runbook: Go-Live Sequence & Owner-Side Prerequisites

**Card ID:** `LAUNCH-01` (`t_31733169`)  
**Risk Level:** `R0` (Documentation / Runbook)  
**Target Document:** `docs/runbooks/launch.md`  
**Governing ADRs:** ADR-000 (No Product Code by Architects), ADR-001 (Main == Production / Vercel Auto-Deploy), ADR-006 (Dubai Entity), ADR-008 (SaaS Architecture & Zero-Cardholder-Data Surface)  

---

## 1. Purpose & Separation of Boundaries

This runbook defines the end-to-end go-live sequence for Exvorta (`exvorta.com`). It establishes a strict, non-negotiable boundary separating deliverables autonomously built and verified by the Kanban factory from external prerequisites that require owner action, corporate entity authority, external vendor contracts, or banking access.

```
┌────────────────────────────────────────────────────────┐
│                   EXVORTA GO-LIVE MAP                  │
└────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│   BOARD DELIVERABLES (Done) │ │  OWNER PREREQUISITES (Gate) │
├─────────────────────────────┤ ├─────────────────────────────┤
│ • Production codebase       │ │ • Resend / Umami / Sentry   │
│ • Database schema & seeds   │ │ • Domain & DNS (PLAT-14)    │
│ • Zero-secrets gate passed  │ │ • Banking & Stripe (RES-04) │
│ • Automated backup scripts  │ │ • Real Evidence (RES-05)    │
│ • Verified smoke test suite │ │ • Legal Sign-off (CONV-08)  │
└─────────────────────────────┘ └─────────────────────────────┘
                           │                 │
                           └────────┬────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                 GO-LIVE CUTOVER SEQUENCE                    │
│   Phase 1: Verification ➔ Phase 2: DNS ➔ Phase 3: Smoke     │
└─────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                  WEEK-1 OBSERVABILITY & SLA                 │
│        Sentry Zero-Spike · Neon Health · Umami Vitals       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Owner-Side Prerequisites Matrix

Before initiating DNS cutover, every item in this matrix must be provisioned and verified by the platform owner. The automated board cannot create third-party accounts, bind corporate credit cards, or sign legal instruments.

| ID | Domain | Prerequisite Description | Dependency Card | Verification Artifact / Source | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PR-01** | **Email** | **Resend Account & Sender Domain:** Create production Resend account. Add `exvorta.com` sending domain. Export `<your-resend-api-key>` into Vercel production environment variables. Set `WAITLIST_TO_EMAIL`. | `PLAT-14` / `ENV` | Resend Dashboard (`resend.com/domains`) verified status | `UNVERIFIED` (Owner Action) |
| **PR-02** | **Analytics** | **Umami Analytics Setup:** Provision Umami Cloud or self-hosted instance. Register website domain `exvorta.com`. Populate `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_UMAMI_SCRIPT_URL` in Vercel env. | `PLAT-14` / `ENV` | Live script firing with zero cookie violation | `UNVERIFIED` (Owner Action) |
| **PR-03** | **Observability** | **Sentry Account & DSN:** Create Sentry project `exvorta-frontend`. Set `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` per `docs/sentry-setup.md`. | `PLAT-14` / `ENV` | `docs/sentry-setup.md` / Sentry event ingestion | `UNVERIFIED` (Owner Action) |
| **PR-04** | **DNS & Routing** | **Apex & Subdomain Records:** Point Apex (`exvorta.com`) and `www` to Vercel edge network (`A: 76.76.21.21`, `CNAME: cname.vercel-dns.com`). Add SPF, DKIM, DMARC records for Resend. | `PLAT-14` / `DEPLOY` | `dig +short exvorta.com A` returning `76.76.21.21` | `UNVERIFIED` (Owner Action) |
| **PR-05** | **Payments** | **Payment Rails & Banking:** Settle Dubai entity trade license. Open corporate business bank account (Wio Bank Business / Emirates NBD). Verify Stripe UAE account (`2.9% + AED 1.00`). Configure SWIFT wire details for high-ticket Launchpad milestones ($2,000–$10,000). | `RES-04` | `docs/research/res-04-payment-rails.md` | `UNVERIFIED` (Owner Action) |
| **PR-06** | **Portfolio** | **Real Portfolio Case Studies:** Replace placeholder/subdomain demo assets (`stonvi.exvorta.com`, `spicevo.exvorta.com`, `nutave.exvorta.com`) with signed-off client metrics or verified owner evidence pack. | `RES-05` | `docs/research/t_7e14b6bc-portfolio-evidence-pack.md` | `UNVERIFIED` (Owner Action) |
| **PR-07** | **Legal** | **Legal Pack Sign-Off:** Execute formal legal review of Terms of Service, Privacy Policy, Cookies Policy, and Free Tool Disclaimers. Confirm Entity Jurisdiction (DIFC vs ADGM vs UAE Mainland) and liability ceiling ($100 / AED 350). | `CONV-08` | `docs/research/t_b52a6a02-legal-pack.md` | `UNVERIFIED` (Owner Action) |

---

## 3. Go-Live Cutover Sequence

The go-live sequence is executed in four sequential phases. No phase may commence until all preceding phase exit criteria are satisfied.

### Phase 1: Pre-Flight Staging & Environment Verification
1. **Zero Secrets Audit:** Ensure no live API keys, DB passwords, or private keys are committed in git or stored in public client-side bundles. Run `CARD_RISK=R0 bash scripts/agent/gate.sh`.
2. **Database Migration State:**
   - Confirm Neon PostgreSQL connection string `DATABASE_URI` is active.
   - Run pending schema migrations in Neon console or via:
     ```bash
     NODE_OPTIONS='--require ./scripts/next-env-shim.cjs' npx tsx scripts/run-migration.ts run
     ```
3. **Seed Initial Admin User:** Verify Payload CMS admin user exists for operational triage:
   ```bash
   pnpm seed:admin
   ```
4. **Pre-Deployment DB Snapshot:** Take a point-in-time snapshot before traffic cutover:
   ```bash
   ./scripts/backup-db.sh
   ```

### Phase 2: DNS & Edge Domain Cutover
1. **Vercel Project Domain Linkage:**
   - In Vercel Dashboard → Project Settings → Domains:
   - Add `exvorta.com` (redirects to `www.exvorta.com` or canonical apex per owner choice).
   - Add `www.exvorta.com`.
2. **DNS Registrar Records Configuration:**
   Configure the following authoritative DNS records at registrar (Cloudflare / Namecheap / Route53):
   ```dns
   ; Apex Web Traffic
   @               300 IN A      76.76.21.21
   www             300 IN CNAME  cname.vercel-dns.com

   ; Resend Email Authentication (PLAT-14)
   resend._domainkey 300 IN TXT  "k=rsa; p=<your-resend-public-key>"
   bounces         300 IN CNAME  feedback.resend.com
   @               300 IN TXT    "v=spf1 include:amazonses.com ~all"
   _dmarc          300 IN TXT    "v=DMARC1; p=none; rua=mailto:dmarc@exvorta.com"
   ```
3. **Automated SSL Certificate Verification:**
   - Confirm Let's Encrypt / Vercel SSL certificate auto-provisions within 60–120 seconds.
   - Verify `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` header is returned.

### Phase 3: Post-Deployment Smoke Verification
Immediately following DNS propagation, execute the verification suite:
1. **Automated Endpoint Audit:**
   ```bash
   ./scripts/verify-deployment.sh https://exvorta.com
   ```
2. **Core Route HTTP 200 Checks:**
   - Homepage: `https://exvorta.com/`
   - Trade tools: `https://exvorta.com/tools` (HS tariff, ACID check, CBAM calculator)
   - Case studies: `https://exvorta.com/work`
   - Legal hub: `https://exvorta.com/legal`
   - Payload Admin: `https://exvorta.com/admin`
3. **Lead Capture & Waitlist Server Action:**
   - Submit a test lead on `https://exvorta.com/contact`.
   - Confirm test email arrives in owner inbox via Resend.
   - Verify row created in Payload `leads` collection with `source="contact"`.
4. **Telemetry & Sentry Health Check:**
   - Trigger a controlled error test in `/api/health?test=sentry` (in staging).
   - Verify error capture appears in Sentry dashboard with correct source maps and release tag.

---

## 4. Rollback Plan

If critical defects, data integrity failures, or regulatory compliance breaches occur during or immediately after cutover, execute the appropriate rollback tier.

```
                           CRITICAL INCIDENT DETECTED
                                       │
                     ┌─────────────────┴─────────────────┐
                     ▼                                   ▼
          Code / Frontend Breakage              Database Corruption / Schema
                     │                                   │
                     ▼                                   ▼
         [Tier 1: Instant Rollback]            [Tier 2: Database Restore]
            vercel rollback                      ./scripts/restore-db.sh
         (Restores previous build)             (Points to pre-cutover backup)
```

### Tier 1: Instant Code / Build Rollback (< 5 Minutes)
If a regression occurs in UI rendering, server actions, or Next.js middleware without database schema corruption:
1. **Command Line:**
   ```bash
   vercel rollback
   ```
2. **Vercel Dashboard Alternative:**
   - Navigate to `Deployments` → select the last known healthy deployment commit → click `···` → `Promote to Production`.
3. **Verification:**
   - Run `./scripts/verify-deployment.sh https://exvorta.com` to confirm restoration.

### Tier 2: Database Schema & Data Rollback (< 15 Minutes)
If a failed migration corrupts tenant state or breaks Payload CMS collections:
1. **Roll back frontend deployment first** via Tier 1 to prevent incoming writes to altered schema.
2. **Execute Database Restore** using the documented procedure in `docs/runbooks/db-restore.md`:
   ```bash
   # Retrieve pre-cutover snapshot
   psql "$DATABASE_URI" < backups/exvorta_backup_PRE_LAUNCH.sql
   ```
3. **Validate database schema integrity:**
   ```bash
   pnpm exec tsx scripts/verify-db-integrity.ts
   ```

### Tier 3: DNS Rollback / Maintenance Page Fallback
If downstream services or hosting experience prolonged outage:
- Update DNS `A` record at registrar to point to static fallback maintenance page or Cloudflare Under Maintenance worker.
- Registrar TTL rule: Keep TTL set to 300 seconds (5 minutes) throughout launch week.

---

## 5. Week-1 Observability & Monitoring Checklist

The operational owner and on-call engineer must monitor these metrics daily during the first 7 days following launch:

| Dimension | Daily Check Action | Target Threshold | Escalation Path |
| :--- | :--- | :--- | :--- |
| **Sentry Errors** | Inspect Unhandled Exceptions stream daily at 09:00 UTC+4 | **0 fatal crashes**, < 0.1% transaction error rate | Triage immediate R1 fix branch |
| **Umami Analytics** | Review visitor counts, bounce rate, and core Web Vitals | LCP < 2.5s, CLS < 0.1, FID < 100ms | Performance optimization card |
| **Neon PostgreSQL** | Check Neon Console compute metrics & connection pool limits | Peak connections < 80% pool capacity; query latency p95 < 150ms | Scale compute branch or enable pooling |
| **Resend Deliverability** | Monitor delivery, open, and bounce logs in Resend console | Bounce rate < 1.0%, Spam complaint rate < 0.05% | Check SPF/DKIM or audit lead form anti-bot |
| **Database Backups** | Verify daily automated cron dump execution | Backup `.sql.gz` present in backup storage with size > 0 | Re-trigger `./scripts/backup-db.sh` |
| **Security Headers** | Audit with `securityheaders.com` or curl | A+ Grade (HSTS, X-Frame-Options, No-Sniff, Referrer-Policy) | Review `next.config.ts` headers |

---

## 6. Facts Discipline & Regulatory Verification

In compliance with the architect and researcher facts protocol, all regulatory and external vendor assertions in this runbook are explicitly categorized:

- **VERIFIED:**
  - Vercel DNS A-record (`76.76.21.21`) and CNAME (`cname.vercel-dns.com`) per Vercel official documentation (2026-10-28).
  - Stripe UAE pricing (`2.9% + AED 1.00` domestic, `+1.0%` intl, `+1.0%` FX, T+5 payout) verified against Stripe official UAE pricing schedule (2026-10-28).
  - UAE VAT zero-rating on export of cross-border digital services to non-resident entities per UAE Federal Decree-Law No. 8 of 2017 Art. 45 (2026-10-28).
  - Sentry integration parameters and script environment requirements verified against `docs/sentry-setup.md` (2026-10-28).
- **UNVERIFIED:**
  - Approval duration for physical UAE corporate bank accounts at Tier-1 commercial banks (Emirates NBD / FAB) versus digital banks (Wio), which depends on owner trade license and lease documentation.
- **ASSUMPTION:**
  - Owner will maintain canonical apex domain as `www.exvorta.com` with 301 redirect from apex `exvorta.com`.
  - Initial payment rails will utilize direct Stripe UAE for SaaS subscriptions and direct SWIFT wire for high-ticket Launchpad milestones per RES-04 recommendation.

**Not verified:** Official launch date determined by platform owner; selection of legal seat (DIFC vs ADGM vs Mainland) by owner counsel.
