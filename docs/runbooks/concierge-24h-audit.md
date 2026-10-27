# Exvorta Concierge Internal Runbook: The 24-Hour Export Audit Playbook

**Card:** CONV-05 (`t_09dd37ec`)  
**Risk Class:** R0 (Additive operational documentation)  
**Status:** VERIFIED (Local worktree & schema alignment)  
**Owner:** Exvorta Architecture (`exvorta-architect`) / Concierge Operations (`exvorta-concierge`)  
**Audience:** Exvorta Concierge, Sales Operations, Technical Architecture, and Reviewers  

---

## 1. Executive Mission & Phase-0 Alignment

### 1.1 Commercial Objective
The primary commercial milestone for Phase 0 is acquiring **1–2 paying Exvorta Web clients** and collecting **$1,500–$3,000** in digital trade infrastructure revenue. The **24-Hour Concierge Audit** is Exvorta's high-leverage wedge: an uncompromising, institutional diagnostic delivered to prospective emerging-market exporters within 24 hours of inquiry.

### 1.2 Core Value Proposition
Emerging-market exporters (e.g. ceramics in Turkey, spices in India, agro-commodities in Vietnam, building materials in UAE) routinely lose lucrative export contracts in GCC, European, and North American markets due to three digital deficiencies:
1. **Institutional Illegitimacy:** Generic consumer templates lacking regulatory rigor, clear factory origin verification, and trade compliance markers.
2. **Commercial Friction:** Absence of Incoterms 2020 explicitness, missing HS code references, vague packaging/palletization specs, and dead `mailto:` contact channels.
3. **Network Latency & Mobile Failure:** Slow asset delivery over GCC mobile networks (STC, e&, du) where international commercial procurement heads browse via WhatsApp.

Exvorta's 24-hour audit pinpoints these exact vulnerabilities and presents a concrete, pre-scoped remediation proposal built on the Exvorta Web stack.

---

## 2. Ingestion & Triage Protocol

### 2.1 Lead Ingestion Channels
Leads arrive through three authorized entry points into the shared Payload CMS `form-submissions` collection:
1. **Interactive RFQ Flow (`/rfq`):** Dispatched via `app/(frontend)/actions/submitRFQ.ts`.
2. **Direct Contact Form (`/contact`):** Dispatched via `app/(frontend)/actions/submitLead.ts`.
3. **WhatsApp Direct Inquiry:** Inbound messages received via the commercial WhatsApp channel.

### 2.2 Lead Data Contract
Every incoming inquiry captured in `form-submissions` provides:
- `name`: Contact person (commercial director, founder, export manager).
- `email`: Verified corporate email.
- `companyName`: Registered operating name of the exporter.
- `businessType`: Categorized as `exporter`, `importer`, or `trading_company`.
- `mainMarkets`: Declared export destination corridors (e.g. GCC, EU, North America, MENA).
- `budget`: Pre-qualified investment range (`$800–1.5k`, `$1.5–3k`, or `$3k+`).
- `message`: Specific operational requirements, trade lanes, or product categories.
- `status`: Default initialized to `pending`.

### 2.3 Concierge Lifecycle State Machine
Within Payload CMS, the concierge operator advances the lead through explicit states:
```
[ pending ] (T+0h)
     │
     ▼
[ in_audit ] (T+2h: Triaged & assigned to Concierge Lead)
     │
     ▼
[ delivered ] (T+18h: Executive teardown + video proposal dispatched)
     │
     ├──────────────────────────┐
     ▼                          ▼
[ converted ] (T+24h–48h)   [ closed_lost ] (Unresponsive after 7 days)
(Deposit collected: $1.5k–$3k)
```

---

## 3. The 4-Pillar 100-Point Export Readiness Audit Framework

Every prospect is evaluated against the standardized 100-Point Exvorta Index across four distinct pillars (25 points each):

### Pillar I: Technical Infrastructure & Core Web Vitals (25 Points)
- **GCC & Global Edge Latency (8 pts):** Time to First Byte (TTFB) and Largest Contentful Paint (LCP) from Riyadh, Dubai, and Frankfurt nodes. Benchmark: LCP < 2.5s on mobile.
- **Mobile Optimization & Layout Stability (7 pts):** Responsive layout performance on modern mobile viewports (iOS Safari / Chromium Android). CLS < 0.05.
- **Security & Transport Layer (5 pts):** Valid TLS 1.3 certificate, strict HSTS, SPF/DKIM/DMARC domain email records.
- **Asset Delivery & Media Optimization (5 pts):** AVIF/WebP image compression, modern CDN delivery, no uncompressed multi-megabyte hero banners.

### Pillar II: Trade Information Architecture & Catalog Clarity (25 Points)
- **Incoterms 2020 Explicitness (7 pts):** Clear declaration of shipping terms (FOB Izmir, CIF Jebel Ali, CFR Rotterdam). Elimination of ambiguous "contact us for shipping" notices.
- **Harmonized System (HS) Classification (6 pts):** Proper 6-digit HS subheadings provided for primary product lines on product pages.
- **Packaging, Volume & Palletization Specs (6 pts):** Granular data on CBM, container loading capacity (20ft / 40ft HC), gross/net weight, and Minimum Order Quantity (MOQ).
- **Production Capacity & Lead Times (6 pts):** Stated monthly/annual factory throughput and production schedules.

### Pillar III: Institutional Trust & Regulatory Compliance (25 Points)
- **Origin & Facility Proof (7 pts):** Verifiable factory location, industrial registration number, physical address, and high-fidelity facility documentation.
- **Regulatory Certifications (7 pts):** Primary documentation for target markets (ISO 9001/22000, Halal, CE, GSO, FDA registration where applicable).
- **Export Track Record & Verification (6 pts):** Documented export history, trade references, and institutional case evidence.
- **Corporate Governance & Terms (5 pts):** Transparent export terms of sale, arbitration clauses (e.g. DIAC / ICC), and warranty standards.

### Pillar IV: Commercial Conversion & Inquiry Mechanics (25 Points)
- **Direct Digital RFQ Channels (8 pts):** Seamless, structured request-for-quote forms capturing trade volume and specifications without forcing external email navigation.
- **Direct WhatsApp Business Integration (7 pts):** Instant 1-click access to the export sales desk configured with pre-filled trade parameter prompts.
- **Multilingual Localization (5 pts):** Professional localization for target corridors (English primary, Arabic for GCC buyers).
- **Commercial Response Commitment (5 pts):** Explicit turnaround guarantee for RFQ responses (e.g., "Formal quotation delivered within 24 business hours").

---

## 4. The 24-Hour Operational Timeline

| Elapsed Time | Phase | Operational Actions | Deliverables / Artifacts |
| :--- | :--- | :--- | :--- |
| **T+0h to T+2h** | **Intake & Verification** | 1. Ingestion alert received from `form-submissions`.<br>2. Update CMS status to `in_audit`.<br>3. Verify corporate registry, active domain, and trade history.<br>4. Dispatch automated acknowledgment email. | Lead record verified in CMS; automated intake receipt logged. |
| **T+2h to T+6h** | **Diagnostic Audit** | 1. Execute automated Lighthouse & Core Web Vitals checks.<br>2. Audit trade information architecture (Incoterms, HS codes, MOQ).<br>3. Verify compliance certifications against primary registries.<br>4. Calculate 100-Point Export Index score. | Raw diagnostic score sheet populated across Pillars I–IV. |
| **T+6h to T+14h** | **Report Synthesis** | 1. Synthesize top 3 fatal commercial friction points.<br>2. Benchmark client against live deployments (Stonvi, Spicevo, Nutave).<br>3. Generate executive 4-page Exvorta Teardown PDF using tokenized typography. | Polished Executive 24-Hour Audit Teardown Document. |
| **T+14h to T+18h** | **Proposal Packaging** | 1. Scope tailored Exvorta Web package:<br>&nbsp;&nbsp;• **Tier 1 ($1,500):** Launchpad Exporter Platform (port 1:1, mobile-first, RFQ engine).<br>&nbsp;&nbsp;• **Tier 2 ($3,000):** Global Trade Infrastructure (full catalog, multi-market localization, HS integration).<br>2. Record 3-minute personalized Loom walkthrough. | Loom video recording URL; structured commercial proposal. |
| **T+18h to T+22h** | **Executive Delivery** | 1. Dispatch personalized delivery email via Resend.<br>2. Transmit summary brief and proposal link via WhatsApp Business.<br>3. Update CMS submission status to `delivered`. | Outbound transmission logged in Resend and WhatsApp logs. |
| **T+22h to T+24h** | **Follow-up & Close** | 1. Confirm receipt via WhatsApp voice note or message.<br>2. Offer direct calendar reservation for 15-minute scoping call.<br>3. Issue Stripe / bank transfer invoice upon agreement. | Discovery call confirmed; contract/invoice issued. |

---

## 5. Client Communication Templates & Scripts

### 5.1 T+2h Acknowledgment Email
**Subject:** `[Exvorta] 24-Hour Export Digital Audit Initiated — {{companyName}}`

```text
Dear {{name}},

Thank you for requesting an export digital infrastructure evaluation for {{companyName}}.

Our trade systems desk has received your parameters (Target Markets: {{mainMarkets}} | Category: {{businessType}}). We have initiated our 24-Hour Export Audit across your existing digital touchpoints.

Our evaluation analyzes:
1. Core Web Vitals & edge performance across your target buyer corridors (GCC / Global).
2. Trade data clarity: Incoterms 2020 readiness, HS classification visibility, and MOQ specifications.
3. Institutional trust signals and buyer verification credentials.

Your customized Executive Audit and Remediation Roadmap will be delivered to this inbox by {{deliveryDeadlineTimestamp}} (within 24 hours).

Respectfully,

The Exvorta Concierge Team
Exvorta Global Trade Infrastructure
https://exvorta.com
```

### 5.2 T+18h Audit Delivery Email
**Subject:** `{{companyName}} // 24-Hour Export Digital Audit & Architecture Roadmap`

```text
Dear {{name}},

Your 24-Hour Export Digital Audit is complete. 

We evaluated {{companyName}} against the Exvorta 100-Point Export Readiness Index across technical infrastructure, trade architecture, compliance signposting, and conversion mechanics.

Your Overall Export Readiness Score: {{overallScore}} / 100

Top 3 Critical Observations Impacting Buyer Conversion in {{mainMarkets}}:
1. {{criticalIssue1}}
2. {{criticalIssue2}}
3. {{criticalIssue3}}

Executive Teardown & Proposed Infrastructure:
• Review your full 4-page diagnostic report: [ Link to Secure PDF ]
• Watch our 3-minute executive video walkthrough: [ Link to Loom ]

Remediation Scope & Next Steps:
We have engineered turnkey production infrastructure specifically for international exporters (as demonstrated on live deployments like stonvi.exvorta.com and spicevo.exvorta.com). We can implement full remediation within 7 business days.

Would Thursday at 11:00 AM Gulf Standard Time (GST) suit you for a brief 15-minute scoping review?

Sincerely,

Head of Client Architecture
Exvorta Global Trade Infrastructure
```

### 5.3 WhatsApp Direct Delivery & Follow-up Script
```text
Hello {{name}}, this is {{conciergeName}} from Exvorta (exvorta.com).

We have completed the 24-Hour Export Digital Audit for {{companyName}} targeting the {{mainMarkets}} corridor. 

Your readiness score came in at {{overallScore}}/100. We identified 3 key technical and trade friction points currently limiting your conversion with institutional procurement desks.

I have sent the complete 4-page report and a 3-minute video walkthrough to {{email}}.

You can also review the executive summary directly here: {{shortLink}}

Let me know if you would like to run through the findings on a brief call tomorrow.
```

---

## 6. Commercial Packages & Phase-0 Pricing Architecture

To secure the Phase-0 milestone ($1,500–$3,000 collected), the concierge offers two distinct, standardized packages:

### Package A: Exvorta Launchpad ($1,500 USD)
- **Turnaround:** 5 business days from deposit.
- **Scope:** Complete rebuild of primary institutional exporter website on the Next.js / Tailwind design token stack.
- **Deliverables:**
  - port 1:1 of verified high-conversion layout with zero template bloat.
  - Core Web Vitals guarantee (LCP < 2.0s, 95+ Mobile Score).
  - Integrated RFQ submission engine with rate-limiting and spam protection.
  - WhatsApp Business integration with pre-configured buyer prompts.
  - Full institutional footer and regulatory compliance badges.

### Package B: Global Trade Infrastructure ($3,000 USD)
- **Turnaround:** 10 business days from deposit.
- **Scope:** Enterprise-grade export portal for high-volume manufacturers and trading houses.
- **Deliverables:**
  - Everything in Package A.
  - Full interactive digital catalog with HS code mapping and downloadable spec sheets.
  - Multilingual architecture (English + Arabic for GCC procurement).
  - Client case-study and facility verification portfolio.
  - Automated Trade Calculator integration (CBM container calculation / Incoterm matrix).

---

## 7. Data Privacy, Governance & ADR Compliance

- **ADR-000 (Factory Model):** Concierge operations document workflows and specifications; product code modifications remain strictly isolated to designated engineering cards.
- **ADR-001 (Main == Production):** No test submissions or mock leads may be injected into production databases without explicit sandbox markers.
- **ADR-003 (Public Repository Hygiene):** This repository is PUBLIC. **NEVER** commit real client credentials, private contact lists, prospective client PII, or internal negotiation margins into git. All lead data resides exclusively in secured Payload CMS database instances.
- **Facts Discipline:** Every trade regulation, tariff quote, or certification reference cited in client teardowns must be verified against primary sources (WCO, GCC Customs Union, national trade ministries) or marked as `ASSUMPTION`.

---

## 8. Verification & Review Sign-Off

- **VERIFIED:** Worktree workspace initialized cleanly with all dependencies installed.
- **VERIFIED:** Payload CMS `submitRFQ` action interface audited and verified in `app/(frontend)/actions/submitRFQ.ts`.
- **VERIFIED:** Standard risk class R0 preserved (additive documentation under `docs/runbooks/`).
- **UNVERIFIED:** End-to-end automated email delivery to third-party inboxes in local sandbox (Resend mocked in test environment).
- **ASSUMPTION:** Primary Phase-0 client targets remain exporters operating in the Turkey-GCC and South Asia-GCC trade lanes.
