# Client Onboarding Runbook (Exvorta Launchpad)

- **Document Version:** 1.0.0
- **Card:** `AGY-03.1` (Task `t_34521c20`)
- **Date Verified:** October 28, 2026
- **Status:** Sourced & Verified Operational Runbook
- **Target Architecture:** Exvorta Launchpad Multi-Tenant Engine + Next.js 15 App Router + Vercel Deployment

---

## 1. Overview & Architecture Summary

This runbook establishes verified operational procedures for onboarding trade enterprise clients to Exvorta's Launchpad agency engine. Exvorta Launchpad parameterizes client-branded digital trade portals, RFQ engines, and regulatory compliance tools (covering GCC 12-digit HS tariffs, Egypt ACI, KSA SABER, UAE E-Invoicing, and EU CBAM).

### 1.1 Agency Model & Client Ingestion Flow

The agency ingestion lifecycle operates across a decoupled, five-stage pipeline:

| Pipeline Stage | Action Description | Primary Artifact / System | Secret & Data Boundary |
| :--- | :--- | :--- | :--- |
| **1. Intake & Manifest** | Client provides institutional metadata, trade lanes, branding, and commodities | `docs/agency/templates/client-intake-manifest.json` | Public manifest; non-sensitive metadata only |
| **2. Brand & Asset Verification** | Visual assets (SVGs, favicons, OG preview), color tokens, typography validation | `public/clients/[slug]/` or CDN bucket | Static assets only; no PII |
| **3. Catalog & Commodity Ingestion** | Mapping HS chapters (72, 76, 31) and trade lanes to RFQ engine routing | Client CMS collections / JSON catalog definitions | Commodity data only |
| **4. Staging Deployment & Parameterization** | Worktree parameterization, environment provisioning via secure vault, staging deploy | Vercel preview deployment on `[slug].exvorta.trade` | Secure vault integration (`op://...`); zero repo secrets |
| **5. Pre-Flight Verification** | Automated smoke tests, RFQ submission end-to-end check, visual regression gate | Playwright smoke suite / `scripts/agent/gate.sh` | Ephemeral test credentials |

### 1.2 Onboarding Cadence & Service Level Targets

1. **Standard Client Turnaround:** Target onboarding duration is `< 48 hours` from completed intake submission to staging sign-off.
2. **30-Minute Operator Drill:** Every agency operator must be capable of executing the staging deployment drill within `30 minutes` using a validated intake manifest.
3. **Delivery Framework:** Operates within the contractual 2-milestone framework established in AGY-03 (`Milestone 1: Foundation & RFQ Engine`, `Milestone 2: Production Deploy & Handover`).

---

## 2. Roles, Permissions & Secret Boundaries

Strict separation of concerns applies between automated worker profiles, agency operators, and the project owner under the PLAT-11 zero-secrets policy.

### 2.1 Owner & Operator Privileges

1. **1Password / Secure Vault Administration:** Agency operators and the owner manage all sensitive client credentials (API tokens, Resend keys, Neon connection strings) exclusively inside the secure vault (`op://Launchpad-Clients/[slug]/`).
2. **DNS & Domain Authorities:** Access to Cloudflare / Vercel DNS for configuring CNAME records and domain verification (`trade.clientdomain.com`).
3. **Vercel Team Access:** Ability to link client project scopes and set encrypted environment variables via Vercel CLI or console.

### 2.2 Worker & Git Repository Boundary (PLAT-11 Zero-Secrets Policy)

- **Zero Secrets in Repository:** The Git repository and factory worktrees are strictly public or semi-public workspaces. No client secrets, API tokens, passwords, private certificates, or customer PII are ever committed or held on disk.
- **Worker Isolation:** Automated builder workers (`exvorta-builder`) operate exclusively on sanitized templates and mock configurations. Worktree setups (`scripts/agent/worktree-setup.sh`) refuse execution if any live `.env` or credential-like files are detected.
- **Reference-Only Manifests:** All client intake manifests reference vault paths (`"op://Launchpad-Clients/..."`) rather than inline values.

---

## 3. Step-by-Step Client Onboarding Procedure

Follow these exact steps to onboard a new client onto the Launchpad engine.

### Step 1: Intake & Manifest Generation (Est. 5 min)

1. Instantiate a new client manifest from the standard template:
   ```bash
   cp docs/agency/templates/client-intake-manifest.json docs/agency/manifests/${CLIENT_SLUG}.json
   ```
2. Populate the client metadata, branding tokens, catalog parameters, and deployment targets:
   - Verify `slug` matches regex `^[a-z0-9-]+$`.
   - Verify contact emails and RFQ routing destination addresses.
   - Verify HS chapters and trade lanes against `docs/research/regulatory-facts.md`.
3. Validate JSON syntax and structure:
   ```bash
   node -e "JSON.parse(fs.readFileSync('docs/agency/manifests/${CLIENT_SLUG}.json'))"
   ```

### Step 2: Brand & Asset Verification (Est. 5 min)

1. Verify brand asset dimensions and formats:
   - Light and dark logo variants: SVG format, `< 100 KB`, viewBox configured.
   - Favicon: 32x32 ICO or PNG.
   - OG Social Card: 1200x630 PNG, `< 500 KB`.
2. Inspect color token contrast against WCAG AA standards (minimum 4.5:1 for body copy).
3. Validate typography fallbacks in `branding.typography` (Inter / Newsreader / JetBrains Mono).

### Step 3: Catalog & Commodity Ingestion (Est. 8 min)

1. Ingest target HS code chapters into client configuration:
   - Verify 12-digit GCC integrated tariff compatibility for KSA and UAE routes.
   - Attach mandatory regulatory indicators (e.g. Egypt ACI mandate for sea/air lanes, KSA SABER PCoC/SCoC requirements).
2. Configure RFQ recipient routing:
   - Ensure primary and secondary tender notification emails are valid.
   - Validate form notification dispatch actions (`app/(frontend)/actions/submitRFQ.ts`).

### Step 4: Staging Deployment & Parameterization (Est. 7 min)

1. Fetch deployment credentials from the secure 1Password vault:
   ```bash
   op read "op://Launchpad-Clients/${CLIENT_SLUG}/staging/env_file" > .env.staging.tmp
   ```
2. Link the project to Vercel preview target:
   ```bash
   vercel link --project "exvorta-launchpad-${CLIENT_SLUG}" --yes
   ```
3. Deploy to the staging preview environment:
   ```bash
   vercel deploy --prebuilt --env-file=.env.staging.tmp
   rm -f .env.staging.tmp
   ```
   > [!IMPORTANT]
   > Immediately wipe temporary environment files after deployment dispatch. Never leave unencrypted credential files on the host filesystem.

### Step 5: Pre-Flight Verification & Health Check (Est. 5 min)

1. Verify endpoint health and liveness:
   ```bash
   curl -s -f "https://${CLIENT_SLUG}.exvorta.trade/api/health" | grep '{"status":"ok"}'
   ```
2. Submit a simulated synthetic RFQ inquiry through the client RFQ endpoint to confirm end-to-end routing without error.
3. Validate that client branding tokens and logos render correctly on mobile and desktop viewports.

---

## 4. 30-Minute Onboarding Drill Checklist for Agency Operators

Agency operators must execute this operational drill periodically to guarantee readiness. Target completion time: `< 30 minutes`.

- [ ] **T+00m — Intake Initialization:**
  - [ ] Receive signed client order and intake parameters.
  - [ ] Initialize `docs/agency/manifests/${CLIENT_SLUG}.json` from template.
  - [ ] Validate JSON syntax and field completeness.
- [ ] **T+05m — Asset & Brand Verification:**
  - [ ] Validate light/dark SVG logos, favicon, and 1200x630 OG image.
  - [ ] Confirm color contrast compliance on design system tokens.
- [ ] **T+10m — Catalog & Compliance Configuration:**
  - [ ] Verify HS chapters (72, 76, 31) and regulatory rules (GCC 12-digit, Egypt ACI, KSA SABER).
  - [ ] Verify RFQ recipient email routing.
- [ ] **T+18m — Staging Provisioning:**
  - [ ] Pull staging environment secrets from 1Password vault.
  - [ ] Trigger Vercel staging deployment.
  - [ ] Securely prune local temporary environment files.
- [ ] **T+25m — Pre-Flight Verification & Health Check:**
  - [ ] Execute `curl -f https://${CLIENT_SLUG}.exvorta.trade/api/health`.
  - [ ] Run synthetic RFQ test submission.
  - [ ] Confirm no secret leaks in build logs.
- [ ] **T+30m — Operator Sign-Off:**
  - [ ] Record drill timestamp, operator ID, and staging URL in operational log.

---

## 5. Sourced Findings, Assumptions & Open Questions

### Findings Table

| Fact / Policy | Label | Primary Source | Verified Date |
| :--- | :--- | :--- | :--- |
| **Zero Secrets Policy** | `VERIFIED` | PLAT-11 Specification; `scripts/agent/gate.sh:45-80` | 2026-10-27 |
| **Clean Worktree Guard** | `VERIFIED` | `scripts/agent/worktree-setup.sh:12-25` | 2026-10-28 |
| **GCC 12-Digit HS Tariff Enforcement** | `VERIFIED` | GCC-CUA & ZATCA Resolution (1447-88-5); `docs/research/regulatory-facts.md:38-40` | 2026-10-27 |
| **Egypt ACI Sea/Air Mandate** | `VERIFIED` | Decree 38/2021 & MoF Jan 2026 statement; `docs/research/regulatory-facts.md:41-42` | 2026-10-27 |
| **KSA SABER PCoC/SCoC Distinction** | `VERIFIED` | SASO Conformity System Regulations; `docs/research/regulatory-facts.md:44-45` | 2026-10-27 |
| **Two-Milestone Delivery Framework** | `VERIFIED` | Upstream task `t_37e95a0f` completion metadata | 2026-10-28 |
| **Production DNS Propagation Window** | `ASSUMPTION` | Standard Cloudflare/Vercel CNAME TTL (300s) | 2026-10-28 |

### Open Questions & Needs Input (`needs_input`)

1. **Automated Manifest Validator CLI:** Currently, JSON syntax is validated via Node.js script. A future enhancement could introduce a dedicated Zod schema validator script (`scripts/agency/validate-manifest.ts`).
2. **Client Vault Access Delegation:** Confirmation from owner on whether agency operators have direct 1Password service account tokens or require manual provisioning per client workspace.

---

## 6. Reviewer Summary & Verification Log

- **Author Profile:** `exvorta-builder`
- **Verification Method:** Direct inspection of reference runbook structure (`docs/runbooks/db-restore.md`), regulatory fact repository (`docs/research/regulatory-facts.md`), factory gate constraints (`scripts/agent/gate.sh`), and worktree setup rules (`scripts/agent/worktree-setup.sh`).
- **Not verified:** Live client onboarding execution and production DNS cutover (prevented by design: no live client credentials or production DNS access in factory worktree).
