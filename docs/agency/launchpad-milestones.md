# Launchpad 2-Milestone Delivery Specifications & Acceptance Gates

- **Document Version:** 1.0.0
- **Card:** `AGY-03.2`
- **Date Verified:** October 28, 2026
- **Status:** Active Commercial & Delivery Specification
- **Target Platform:** Exvorta Next.js / Tailwind CSS / Vercel Edge / Payload CMS 3.88
- **Classification:** Agency Operational Framework (R0 Additive)
- **Governing Architecture:** `docs/CONTRACTS.md`, `docs/blueprint.md` (ADR-000, ADR-001, ADR-003)

---

## Section 1: Executive Overview of Launchpad 2-Milestone Delivery Model

### 1.1 Commercial & Technical Purpose
The Exvorta Launchpad package delivers an institutional, high-conversion digital trade platform for enterprise cross-border exporters, manufacturers, and trade intermediaries. Designed specifically for cross-border trade corridors (e.g., Turkey–GCC, South Asia–GCC, and European export routes), Launchpad replaces generic marketing templates with an enterprise-grade web presence powered by Exvorta's tokenized design system, verified Core Web Vitals performance, and a deterministic Request for Proposal (RFQ) wizard.

This document establishes the binding technical criteria, milestone boundaries, and machine-checkable acceptance gates governing all Launchpad client deliveries.

### 1.2 2-Milestone Gated Billing Architecture
To eliminate delivery disputes, ensure complete capital predictability, and align incentives between Exvorta and the client enterprise, Launchpad engagements follow a strict two-milestone commercial schedule:

```
[ Phase 0: Contract Execution ]
              │
              ▼
┌────────────────────────────────────────────────────────┐
│  Milestone 1: Foundation & Catalog RFQ Engine (Staging) │
│  • Delivery: T+3 to T+5 Business Days                  │
│  • Automated Gates: Lighthouse >= 90/95/90/90, axe 0/0 │
│  • Verification: Staging Smoke Test + RFQ Payload Test │
└───────────────────────────┬────────────────────────────┘
                            │
              Client Approval & 50% Upfront Billing Release
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  Milestone 2: Production Deployment & Handover         │
│  • Delivery: T+5 to T+7 Business Days                  │
│  • Automated Gates: DNS A/CNAME, TLS Handshake, Zero-PII│
│  • Verification: Custom Domain Smoke Test + Clean Tree │
└───────────────────────────┬────────────────────────────┘
                            │
              Client Approval & 50% Final Billing Release
                            │
                            ▼
[ Project Delivery Complete & Handover Archive ]
```

1. **Milestone 1 (Foundation & Catalog RFQ Engine):**
   - **Billing Trigger:** Approval of Milestone 1 triggers release of the initial 50% billing tranche ($750 USD on the baseline $1,500 USD Launchpad package or 50% of the agreed fixed-fee contract value).
   - **Environment:** Dedicated staging deployment (`https://<client-slug>.staging.exvorta.com`).
2. **Milestone 2 (Production Deployment, Domain Customization & Handover):**
   - **Billing Trigger:** Approval of Milestone 2 triggers release of the final 50% billing tranche ($750 USD remaining balance on baseline $1,500 USD Launchpad package or remaining contract balance).
   - **Environment:** Live custom client apex domain and `www` edge routing (`https://<custom-domain>`).

### 1.3 Commercial Alignment with `docs/CONTRACTS.md`
All Launchpad deliveries are contractually bound by the governance rules set forth in `docs/CONTRACTS.md` and repository standards:
- **Fixed-Fee Engagements:** Every Launchpad engagement is fixed-scope and fixed-fee. No billing occurs on open-ended time-and-materials terms.
- **Zero Unpriced Scope Creep:** Work outside the explicit baseline parameters is strictly prohibited. Additional client features require a formal, countersigned Change Order (CO) prior to any engineering activity.
- **Milestone-Gated Billing:** Invoices are issued exclusively upon deterministic gate satisfaction. Escrow or milestone release requests are tied directly to cryptographic verification artifacts (git commit SHAs and automated test logs).
- **Public Repository & Zero-Secrets Hygiene (ADR-003 / PLAT-11):** The delivery codebase is maintained in a clean, auditable repository. Zero client credentials, private contact lists, or internal commercial margins are stored in git.

### 1.4 Deterministic Gate Philosophy
Traditional agency delivery models suffer from subjective client review cycles ("I don't like this shade", "Let's try a different font", "Can you move this 3 pixels?"). Exvorta eliminates review ambiguity by replacing subjective opinions with **strictly deterministic, machine-checkable verification**:
- **Automated CLI Audits:** Core Web Vitals, accessibility, and SEO metrics are evaluated via headless Lighthouse and axe-core CLI suites.
- **HTTP Smoke Tests:** API routes, static assets, and dynamic page routes must return explicit HTTP 200 responses with zero broken dependencies.
- **DNS & TLS Handshake Checks:** Production DNS records and cryptographic SSL certificates are verified via `dig` and `curl` assertions.
- **Clean Git State:** The target branch must pass automated repository gates (`scripts/agent/gate.sh`) with zero uncommitted modifications and zero lint or type errors.

Subjective sign-off is only requested *after* all automated machine gates have passed and their log artifacts are generated.

---

## Section 2: Milestone 1 -- Foundation & Catalog RFQ Engine

### 2.1 Scope & Required Deliverables
Milestone 1 establishes the client's functional foundation on an isolated staging sub-environment. All baseline layouts, design tokens, and lead intake engines are verified in a staging environment mirroring production.

Required deliverables:
1. **Parameterized Staging Deployment:**
   - Isolated staging URL: `https://<client-slug>.staging.exvorta.com` (deployed via Vercel preview/staging pipeline).
   - Edge security headers and staging access guards active.
2. **Client Brand Tokens Applied:**
   - Incorporation of client palette into Tailwind token system (`bg-bg`, `text-text`, `bg-surface`, `border-border`, `text-muted`).
   - Institutional typography configured (Vazirmatn for Persian-first RTL or approved latin serif/sans pairing per token specification).
   - High-resolution SVG client logo and favicon assets rendered across header, footer, and open-graph metadata.
3. **Core Institutional Routes Rendered:**
   - `/`: Flagship landing page rendering the exporter value proposition, institutional hero, proof-of-execution metrics, trade lane coverage, and RFQ CTA banner.
   - `/rfq`: Interactive multi-step customs and trade RFQ engine configured with client-specific trade commodities, incoterms (FOB, CIF, CFR, DDP), packaging options, and target destinations.
   - `/contact`: Enterprise trade inquiry and partnership portal capturing lead details via validated server actions.
4. **Initial Catalog & Commodity Ingestion:**
   - Ingestion of client's primary export commodity catalog (up to 25 baseline product entries / SKU profiles).
   - HS (Harmonized System) 2-digit to 6-digit chapter classifications applied to catalog items.
   - Trade lane parameters mapped (origin ports, typical transit times, documentation requirements).
5. **RFQ Submission Workflow Verified End-to-End:**
   - Form input validation preventing incomplete submissions.
   - Client-side wizard state management preserving user selections across steps.
   - Verified dispatch to the backend action (`app/(frontend)/actions/submitRFQ.ts`) with sanitized structured notification payload (verified via webhook or mock collector).

### 2.2 Machine-Checkable Acceptance Gates
Milestone 1 completion requires 100% pass rates across four deterministic automated gates.

#### Gate 1.1: Automated Lighthouse Audit (Baseline Thresholds)
Run headless Lighthouse against the staging URL. All four core categories must meet or exceed baseline thresholds on mobile and desktop profiles:

```bash
# Execute automated Lighthouse audit
npx lhci collect --url="https://<client-slug>.staging.exvorta.com"
npx lhci assert --assertions.categories:performance="minScore:0.90" \
                --assertions.categories:accessibility="minScore:0.95" \
                --assertions.categories:best-practices="minScore:0.90" \
                --assertions.categories:seo="minScore:0.90"
```

| Metric Category | Minimum Acceptance Threshold | Failure Consequence |
| :--- | :--- | :--- |
| **Performance** | >= 90 (LCP < 2.0s, CLS < 0.05, FID/INP < 100ms) | Milestone 1 Blocked |
| **Accessibility** | >= 95 | Milestone 1 Blocked |
| **Best Practices** | >= 90 | Milestone 1 Blocked |
| **SEO** | >= 90 | Milestone 1 Blocked |

#### Gate 1.2: Automated axe-core Accessibility Audit
Headless automated evaluation across `/`, `/rfq`, and `/contact` using `@axe-core/cli`:

```bash
# Execute automated axe-core audit
npx @axe-core/cli https://<client-slug>.staging.exvorta.com \
                  https://<client-slug>.staging.exvorta.com/rfq \
                  https://<client-slug>.staging.exvorta.com/contact \
                  --exit
```
- **Acceptance Threshold:** **0 critical violations** and **0 serious violations**.
- Any contrast ratio failure, missing form label, or landmark defect fails the gate automatically.

#### Gate 1.3: Automated RFQ Form Submission Test
Execute an automated HTTP verification payload against the staging RFQ submission endpoint:

```bash
# Automated RFQ submission validation
curl -sS -i -X POST "https://<client-slug>.staging.exvorta.com/api/rfq-submit-test" \
  -H "Content-Type: application/json" \
  -d '{
    "commodity": "TEST-COMMODITY-01",
    "hsCode": "0904.11",
    "volume": "25000",
    "unit": "KG",
    "incoterm": "FOB",
    "destination": "Jebel Ali Port (AEJEA)",
    "contactEmail": "verification-smoke@exvorta.staging",
    "contactName": "Automated Smoke Probe"
  }' | head -n 1 | grep -E "HTTP/(1\.1|2) (200|201)"
```
- **Acceptance Threshold:** HTTP 200 or 201 response received; schema validation succeeds; sanitized payload confirmed without data loss.

#### Gate 1.4: Staging Sign-Off Artifact Generation
An auditable JSON artifact is generated and stored in `reports/milestone-1-<client-slug>-<commit-sha>.json` containing:
- `commitSha`: Target git commit SHA deployed to staging.
- `stagingUrl`: Staging deployment URL.
- `timestamp`: UTC ISO 8601 execution timestamp.
- `auditScores`: Extracted Lighthouse scores (Perf, A11y, BP, SEO).
- `axeViolations`: Array of detected violations (must be empty).
- `rfqResponseStatus`: HTTP status code from RFQ submission test.

### 2.3 Commercial Billing Trigger
Upon successful verification of Gates 1.1 through 1.4:
1. The Staging Sign-Off Artifact is submitted to the client.
2. The client reviews the staging deployment and signs the **Milestone 1 Sign-Off Certificate**.
3. **Billing Release:** The client authorizes the initial 50% billing release ($750 USD baseline or contract 50% deposit release).
4. Engineering access to Milestone 2 (production cutover) is formally unlocked.

---

## Section 3: Milestone 2 -- Production Deployment, Domain Customization & Handover

### 3.1 Scope & Required Deliverables
Milestone 2 transitions the verified platform from staging into production under the client's custom brand domain, verifies data governance, and completes the client operational handover.

Required deliverables:
1. **Custom Domain Cutover & SSL Provisioning:**
   - Apex domain (`<custom-domain>`) configured with DNS A-records pointing to Vercel's global edge network (`76.76.21.21`).
   - Subdomain (`www.<custom-domain>`) configured with DNS CNAME pointing to `cname.vercel-dns.com`.
   - Automated Let's Encrypt / Vercel TLS/SSL certificate provisioned with active HTTPS redirection.
2. **Production Vercel Project Configuration:**
   - Vercel production project instantiated under enterprise team isolation.
   - Production environment variables populated securely from password vault (`op://...`) with zero secrets committed to git.
   - Atomic production deployment pipeline linked to the card's landed git branch.
   - Edge routing rules and security headers applied (Content-Security-Policy, Strict-Transport-Security, X-Frame-Options).
3. **Privacy-Preserving Telemetry & Zero-PII Compliance (PLAT-11):**
   - Telemetry configured strictly for anonymized pageview tracking and aggregate RFQ step conversion rates.
   - **Zero-PII Guarantee:** Verification that no personal identifiable information (client names, phone numbers, email addresses, specific commercial cargo pricing) is dispatched to analytics collectors or third-party loggers.
4. **Client Handover & Training Walkthrough:**
   - 45-minute scheduled interactive walkthrough or high-resolution recorded video session covering:
     - Navigation of the Payload CMS admin portal (`https://<custom-domain>/admin`).
     - Managing product catalog entries, updating HS classification metadata, and editing commodity specifications.
     - Viewing, exporting, and managing inbound RFQ proposals and buyer leads.
5. **Delivery Runbook Handoff:**
   - Final client delivery runbook documented and linked directly to `docs/runbooks/client-onboarding.md`.
   - Includes maintenance schedules, emergency contact channels, and standard disaster recovery documentation.

### 3.2 Machine-Checkable Acceptance Gates
Milestone 2 completion requires passing four deterministic production acceptance gates.

#### Gate 2.1: DNS Resolution & TLS Handshake Verification
Execute automated DNS and SSL cryptographic handshake tests against the live client custom domain:

```bash
# 1. Verify Apex A-record points to Vercel Edge
dig +short A <custom-domain> | grep -E "76\.76\.21\.21"

# 2. Verify WWW CNAME points to Vercel DNS
dig +short CNAME www.<custom-domain> | grep -E "vercel-dns\.com"

# 3. Verify TLS Handshake, HTTPS redirect, and valid certificate
curl -vI "https://<custom-domain>" 2>&1 | grep -E "HTTP/(1\.1|2) 200|SSL certificate verify ok"
```
- **Acceptance Threshold:** `dig` returns expected Vercel edge IP/CNAME; `curl` returns HTTP 200 with valid TLS handshake.

#### Gate 2.2: Live Production Smoke Test
Verify that all core routes return valid responses and zero broken static assets on the live production domain:

```bash
# Production route smoke test
for route in "/" "/rfq" "/contact"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://<custom-domain>${route}")
  echo "Route ${route}: HTTP ${STATUS}"
  [ "$STATUS" -eq 200 ] || exit 1
done
```
- **Acceptance Threshold:** HTTP 200 status returned for `/`, `/rfq`, and `/contact`; 0 4xx/5xx responses; 0 missing CSS/JS asset bundles.

#### Gate 2.3: Client Handover Sign-Off Checklist
Verification that the operational handover checklist in Section 5.2 is 100% completed:
- CMS administrative user accounts provisioned with client email addresses.
- Handover recording or live training session completed.
- Client operational runbook delivered.

#### Gate 2.4: Clean Git Working Tree & Repository Gate
Verification that all changes have been landed cleanly into the version control system without residual local state:

```bash
# 1. Clean git status
git status --porcelain
# Must return 0 lines

# 2. Factory gate script check
CARD_RISK=R0 bash scripts/agent/gate.sh
# Must print: GATE OK
```
- **Acceptance Threshold:** `git status --porcelain` outputs nothing (clean working tree); `scripts/agent/gate.sh` exits 0 with `GATE OK`.

### 3.3 Commercial Billing Trigger
Upon successful verification of Gates 2.1 through 2.4:
1. The Production Sign-Off Artifact is archived.
2. The client executes the **Milestone 2 Sign-Off Certificate**.
3. **Final Billing Release:** The client authorizes the final 50% billing release ($750 USD baseline or contract remaining balance).
4. Project delivery is closed, and ongoing warranty or maintenance support commences per agreement.

---

## Section 4: Change Request & Scope Management Boundary

### 4.1 Scope Management Boundaries & Anti-Creep Doctrine
To deliver high-performance trade platforms in 5 to 7 business days at fixed fees, Exvorta enforces an uncompromising scope boundary. Scope creep—unplanned, unbudgeted feature expansion—degrades code quality, delays delivery timelines, and invalidates machine-checkable verification benchmarks.

The Launchpad package is a parameterized institutional platform engineered for rapid deployment. It is not an open-ended bespoke software contract.

### 4.2 In-Scope vs. Out-of-Scope Matrix

| Category | In-Scope (Launchpad Baseline) | Out-of-Scope (Requires Change Order) |
| :--- | :--- | :--- |
| **Page Layouts & Routes** | Standard 3-route core architecture: `/` (Landing), `/rfq` (Customs RFQ wizard), `/contact` (Lead capture). | Net-new bespoke page templates, multi-language dynamic internationalization (i18n beyond English/Arabic dual-token layouts), custom interactive calculators. |
| **Design & Branding** | Parameterization of design tokens: primary/accent colors, font tokens, client SVG logo, favicons, open-graph cards. | Complete ground-up UI redesign, custom CSS animations outside design primitives (`Reveal`, `MagneticButton`), bespoke illustration sets. |
| **Catalog & Trade Data** | Ingestion of up to 25 SKU / commodity items; standard HS classification mapping; up to 5 primary trade corridors. | Ingestion of >25 catalog items, automated daily ERP inventory sync, real-time customs duty calculation engines, live spot-rate freight APIs. |
| **Forms & Workflow** | Standard multi-step RFQ wizard; email notifications via verified server actions; lead capture form. | Custom CRM bi-directional integrations (Salesforce, HubSpot, Zoho APIs), bespoke SMS gateways, multi-party electronic document signing workflows. |
| **Infrastructure & Hosting**| Vercel staging deployment; production custom domain cutover; SSL certificate automation; baseline Payload CMS instance. | Multi-region custom cloud infrastructure (AWS/GCP bespoke VPCs), self-hosted Kubernetes clusters, third-party database replication. |
| **Assets & Content** | Incorporation of client-provided copy, commodity photography, and institutional certificates. | Original copywriting, regulatory legal drafting, professional studio photography, video editing or production. |

### 4.3 Formal Change Order (CO) Procedure
When a client requests deliverables outside the In-Scope matrix, the following formal 4-step procedure must be executed before any engineering commences:

```
[ Client Request for Out-of-Scope Feature ]
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│ Step 1: Technical & Schedule Impact Assessment         │
│ • Engineering evaluates architectural complexity       │
│ • Fixed-price estimate calculated ($150 USD/hr basis)  │
│ • Schedule extension estimated (business days)         │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│ Step 2: Formal Change Order (CO) Documentation         │
│ • Specification of new deliverables                    │
│ • Explicit acceptance gate criteria defined            │
│ • Revised commercial total and payment terms           │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│ Step 3: Bilateral Written Execution & Funding          │
│ • Client countersigns formal CO document               │
│ • Client prepays 100% of CO fee or updates escrow      │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│ Step 4: Branch Allocation & Sprint Execution           │
│ • Dedicated worktree branch created (`card/<co-id>`)   │
│ • Implementation commences without impacting baseline  │
└────────────────────────────────────────────────────────┘
```

1. **Impact Assessment:** Within 24 hours of receiving a written change request, Exvorta generates an Impact Assessment stating the required engineering hours (billed at standard fixed add-on rates or $150 USD/hour) and delivery date adjustment.
2. **Documentation:** A formal Change Order document is generated referencing the master contract, describing the additions, and specifying new deterministic acceptance gates.
3. **Countersignature & Payment:** Work is scheduled only upon receipt of the signed CO and 100% advance payment (or escrow allocation) for the change order amount.
4. **Branch Isolation:** Additions are implemented on dedicated feature branches, ensuring that core Launchpad milestone verification remains unblocked.

### 4.4 Mandatory "No Unpriced Work" Policy
- **Zero Work Commenced Without Countersigned CO:** Engineers and project managers are strictly forbidden from writing code, altering CMS schemas, or ingesting additional data for unpriced requests.
- **Oral & Chat Instructions Void:** Verbal requests made during calls, chat messages via Slack/WhatsApp, or casual email requests have zero contractual validity until formally incorporated into an executed Change Order.
- **Factory Gate Enforcement:** The factory gate rejects commits that introduce unauthorized dependencies or unbudgeted routes under card risk guidelines (`scripts/agent/gate.sh`).

---

## Section 5: Verification Checklist & Sign-off Templates

### 5.1 Milestone 1 Staging Verification Checklist

```markdown
### Exvorta Launchpad -- Milestone 1 Verification Checklist
- **Client Name / Slug:** _________________________ / `<client-slug>`
- **Staging URL:** `https://<client-slug>.staging.exvorta.com`
- **Target Commit SHA:** _________________________
- **Verification Date:** _________________________

#### Scope Delivery Verification
- [ ] Staging site deployed and reachable over HTTPS.
- [ ] Brand tokens applied (client colors, typography, logos, favicons).
- [ ] Landing page (`/`) renders institutional hero, proof metrics, and RFQ CTA.
- [ ] Multi-step RFQ wizard (`/rfq`) renders client commodity categories and trade lanes.
- [ ] Contact portal (`/contact`) renders lead capture form.
- [ ] Product catalog ingested (up to 25 items with HS classification codes).

#### Automated Acceptance Gates
- [ ] Gate 1.1: Lighthouse Performance >= 90 (Score: ______)
- [ ] Gate 1.1: Lighthouse Accessibility >= 95 (Score: ______)
- [ ] Gate 1.1: Lighthouse Best Practices >= 90 (Score: ______)
- [ ] Gate 1.1: Lighthouse SEO >= 90 (Score: ______)
- [ ] Gate 1.2: axe-core audit: 0 critical and 0 serious violations (Violations: ______)
- [ ] Gate 1.3: Automated RFQ submission test: HTTP 200/201 response verified.
- [ ] Gate 1.4: Staging Sign-Off Artifact generated (`reports/milestone-1-<client-slug>-<sha>.json`).

#### Lead Engineer Verification
- **Verified By (Engineer Name):** _________________________
- **Date & Signature:** _________________________
```

### 5.2 Milestone 2 Production Verification Checklist

```markdown
### Exvorta Launchpad -- Milestone 2 Verification Checklist
- **Client Name / Slug:** _________________________ / `<client-slug>`
- **Production Domain:** `https://<custom-domain>`
- **Target Commit SHA:** _________________________
- **Verification Date:** _________________________

#### Scope Delivery Verification
- [ ] Production Vercel project configured with secure vault variables (`op://...`).
- [ ] Apex domain A-record verified (`76.76.21.21`).
- [ ] Subdomain `www` CNAME verified (`cname.vercel-dns.com`).
- [ ] TLS/SSL certificate provisioned and valid over HTTPS.
- [ ] Privacy-preserving telemetry verified (Strict zero-PII compliance under PLAT-11).
- [ ] Client 45-minute walkthrough / training video delivered.
- [ ] Client onboarding runbook delivered (`docs/runbooks/client-onboarding.md`).

#### Automated Acceptance Gates
- [ ] Gate 2.1: DNS resolution check passed (`dig +short A` and `CNAME`).
- [ ] Gate 2.1: SSL TLS handshake verification passed (`curl -vI https://<custom-domain>`).
- [ ] Gate 2.2: Live production smoke test passed (`/`, `/rfq`, `/contact` returning HTTP 200).
- [ ] Gate 2.3: Client handover checklist executed and signed off.
- [ ] Gate 2.4: Clean git working tree verified (`git status --porcelain` returns 0).
- [ ] Gate 2.4: Repository gate script passed (`CARD_RISK=R0 bash scripts/agent/gate.sh`).

#### Lead Engineer Verification
- **Verified By (Engineer Name):** _________________________
- **Date & Signature:** _________________________
```

### 5.3 Milestone 1 Formal Sign-Off Certificate

```markdown
================================================================================
                    EXVORTA LAUNCHPAD DELIVERY FRAMEWORK
                    MILESTONE 1 SIGN-OFF CERTIFICATE
================================================================================

PROJECT DETAILS:
- Client Legal Name:       [ ________________________________________________ ]
- Project / Client Slug:   [ <client-slug>                                    ]
- Staging URL:             [ https://<client-slug>.staging.exvorta.com        ]
- Git Commit SHA:          [ ________________________________________________ ]
- Date of Verification:    [ YYYY-MM-DD                                       ]

ACCEPTANCE GATES STATUS:
- Gate 1.1 (Lighthouse Performance >= 90, A11y >= 95, BP >= 90, SEO >= 90): [ PASS ]
- Gate 1.2 (axe-core Accessibility Audit: 0 Critical / 0 Serious):          [ PASS ]
- Gate 1.3 (Automated RFQ Form Submission Test: HTTP 200/201):               [ PASS ]
- Gate 1.4 (Staging Sign-Off Artifact Generated):                           [ PASS ]

CLIENT ACCEPTANCE & BILLING RELEASE AUTHORIZATION:
By signing below, the Client confirms that Milestone 1 (Foundation & Catalog RFQ
Engine) has satisfied all contractual criteria and acceptance gates in staging.
The Client hereby authorizes the immediate release of the initial 50% billing
tranche ($750.00 USD or 50% of the agreed fixed contract sum).

AUTHORIZED CLIENT SIGNATORY:
- Signatory Name:          [ ________________________________________________ ]
- Title / Role:            [ ________________________________________________ ]
- Organization:            [ ________________________________________________ ]
- Date:                    [ YYYY-MM-DD                                       ]
- Signature:               [ ________________________________________________ ]

EXVORTA ENGAGEMENT LEAD:
- Lead Name:               [ ________________________________________________ ]
- Title:                   [ Lead Systems Architect / Exvorta Web             ]
- Date:                    [ YYYY-MM-DD                                       ]
- Signature:               [ ________________________________________________ ]
================================================================================
```

### 5.4 Milestone 2 Formal Sign-Off Certificate

```markdown
================================================================================
                    EXVORTA LAUNCHPAD DELIVERY FRAMEWORK
                    MILESTONE 2 SIGN-OFF CERTIFICATE
================================================================================

PROJECT DETAILS:
- Client Legal Name:       [ ________________________________________________ ]
- Project / Client Slug:   [ <client-slug>                                    ]
- Production Domain:       [ https://<custom-domain>                          ]
- Git Commit SHA:          [ ________________________________________________ ]
- Date of Handover:        [ YYYY-MM-DD                                       ]

ACCEPTANCE GATES STATUS:
- Gate 2.1 (DNS Resolution & TLS Handshake Verification):                   [ PASS ]
- Gate 2.2 (Live Production Smoke Test on Core Routes):                     [ PASS ]
- Gate 2.3 (Client Handover & CMS Training Walkthrough Completed):          [ PASS ]
- Gate 2.4 (Clean Git Working Tree & Repository Gate OK):                   [ PASS ]

CLIENT ACCEPTANCE & FINAL BILLING RELEASE AUTHORIZATION:
By signing below, the Client confirms that Milestone 2 (Production Deployment,
Domain Customization & Handover) has satisfied all contractual criteria, live
production gates, and operational handover training. The Client hereby accepts
the final project delivery and authorizes the immediate release of the final
50% billing tranche ($750.00 USD or the remaining contract balance).

AUTHORIZED CLIENT SIGNATORY:
- Signatory Name:          [ ________________________________________________ ]
- Title / Role:            [ ________________________________________________ ]
- Organization:            [ ________________________________________________ ]
- Date:                    [ YYYY-MM-DD                                       ]
- Signature:               [ ________________________________________________ ]

EXVORTA ENGAGEMENT LEAD:
- Lead Name:               [ ________________________________________________ ]
- Title:                   [ Lead Systems Architect / Exvorta Web             ]
- Date:                    [ YYYY-MM-DD                                       ]
- Signature:               [ ________________________________________________ ]
================================================================================
```
