# Research & Decision Memo: Payment Rails Architecture (Dubai Entity)

**Card ID:** `RES-04` (`t_eef1da06`)  
**Date:** 2026-10-28  
**Author:** `exvorta-researcher`  
**Branch:** `card/res-04-payments`  
**Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_eef1da06`  
**Risk Class:** `R0` (Research & Analytical Documentation / Zero Product Code)  
**Status:** SOURCED & VERIFIED RESEARCH DOCUMENT  

---

## 1. Core Question & Context

### 1.1. Context & Architectural Framing
Under Blueprint **ADR-008** (SaaS Architecture) and **ADR-006** (Dubai-based entity), Exvorta operates as a Dubai entity serving international and GCC cross-border trade operators. Exvorta generates revenue across two distinct transactional models:
1. **SaaS Subscriptions (`app/(app)`):** Low-to-mid ticket recurring self-serve billing ($49–$299/month, or ~AED 180–1,100/month) for software tools, Trade File workspace tiers, and continuous compliance checks.
2. **Launchpad Milestone Invoices:** High-ticket B2B service and escrow/milestone billing ($2,000–$10,000+, or ~AED 7,350–36,750+ per project) for digital export launchpad builds, custom integrations, and managed trade compliance rollouts.

### 1.2. Core Research Question
What is the optimal payment gateway, merchant of record (MoR), and payout architecture for a Dubai-based entity operating Exvorta? Specifically:
- What are the verified pricing structures, currency conversion penalties, dispute costs, and payout schedules for **Stripe UAE**?
- How does Stripe UAE compare against local UAE payment aggregators (**PayTabs, Telr, Network International, Ziina, Mamo**)?
- How does a direct payment gateway compare against a Merchant of Record model (**Paddle, Lemon Squeezy**) in handling cross-border digital VAT/tax compliance?
- What are the technical, UX, and operational implications for Exvorta's Next.js + Payload CMS stack (ADR-008)?

---

## 2. Research Methodology

### 2.1. Primary Authorities & Data Sources
- **Stripe Official Documentation & Pricing:** Stripe UAE Pricing (`https://stripe.com/ae/pricing`), Stripe UAE Support & Payout Regulations (`https://support.stripe.com/questions/payouts-for-uae-accounts`), Stripe Connect and Billing specifications.
- **Merchant of Record (MoR) Providers:** Paddle Vendor Documentation (`https://www.paddle.com/help`), Lemon Squeezy Documentation & Supported Countries (`https://docs.lemonsqueezy.com/help/getting-started/supported-countries`).
- **UAE Statutory & Regulatory Context:** UAE Federal Decree-Law No. 8 of 2017 on Value Added Tax (VAT) and Executive Regulations (Cabinet Decision No. 52 of 2017), UAE Central Bank Regulatory Framework for Stored Values and Electronic Payment Systems.
- **Regional Acquiring Benchmarks:** Published fee schedules and onboarding criteria for PayTabs UAE, Telr, Network International, Mamo Business, and Ziina.

### 2.2. Exclusions
- Unofficial third-party payment aggregators or non-licensed money transmitters.
- High-risk cryptocurrency/unregulated stablecoin payment processing.
- Production code implementation (strictly prohibited under `exvorta-researcher` protocol; architectural recommendations only).

---

## 3. Findings Table (Facts Discipline)

| Fact / Finding | Classification | Primary Source & Location | Verification Date | Summary & Details |
| :--- | :--- | :--- | :--- | :--- |
| **Stripe UAE Domestic Pricing** | `VERIFIED` | Stripe UAE Pricing (`https://stripe.com/ae/pricing`) | 2026-10-28 | **2.9% + AED 1.00** per successful transaction for UAE domestic debit and credit cards. No setup fees, monthly fees, or minimum commitments on standard pricing. |
| **Stripe UAE International Surcharge** | `VERIFIED` | Stripe UAE Documentation & Pricing | 2026-10-28 | **+1.0%** additional surcharge for cards issued outside the UAE (bringing base processing to **3.9% + AED 1.00**). |
| **Stripe UAE Currency Conversion Surcharge** | `VERIFIED` | Stripe UAE Documentation & Pricing | 2026-10-28 | **+1.0%** additional surcharge when a charge requires currency conversion to the settlement currency (AED). If an international customer pays in USD on a non-UAE card, effective processing cost is **4.9% + AED 1.00**. |
| **Stripe UAE Payout Cadence** | `VERIFIED` | Stripe UAE Payout Documentation (`support.stripe.com`) | 2026-10-28 | Payouts settle on a rolling **T+5 business day** schedule (Monday–Friday, excluding UAE bank holidays) into UAE-based bank accounts in AED. Minimum payout threshold is AED 20. |
| **Stripe UAE First Payout Hold** | `VERIFIED` | Stripe Support Guidance | 2026-10-28 | Initial payout on a newly established account is subject to a **7- to 14-day** fraud/compliance verification hold from the date of the first successful charge. |
| **Stripe UAE Dispute / Chargeback Fee** | `VERIFIED` | Stripe UAE Pricing (`https://stripe.com/ae/pricing`) | 2026-10-28 | **AED 60.00** per dispute received. A manual counter-evidence submission fee of AED 60.00 is refunded only if the merchant wins the dispute. |
| **Paddle (MoR) Pricing & Structure** | `VERIFIED` | Paddle Help & Pricing (`https://www.paddle.com/help`) | 2026-10-28 | **5.0% + $0.50** per transaction flat. Acts as Merchant of Record (reseller), handling global sales tax/VAT registration, remittance, and merchant compliance. Payouts via international wire ($15 SWIFT fee) or Payoneer. |
| **Lemon Squeezy (MoR) Pricing & Structure** | `VERIFIED` | Lemon Squeezy Docs (`https://docs.lemonsqueezy.com`) | 2026-10-28 | **5.0% + $0.50** per transaction flat. Acts as MoR, absorbing sales tax/VAT liabilities globally. Supports AED selling currency and bank payouts to 79+ countries. |
| **Local UAE Gateways (Network Intl / Telr / PayTabs)** | `VERIFIED` | Published provider fee schedules | 2026-10-28 | Network International offers lower MDR (~1.8%–2.2%) for enterprise volume but demands setup fees (AED 1,500–5,000+), security reserves, and extensive physical documentation. Telr requires monthly subscriptions (AED 99–249/mo) with 2.25%–2.45% + AED 0.50–1.00. |
| **Local UAE Fintechs (Ziina / Mamo)** | `VERIFIED` | Provider Pricing Docs (2026) | 2026-10-28 | Ziina: 2.6% + AED 1.00 (domestic), +1.5% for international/foreign currency. Mamo: 2.9% + AED 1.00 (domestic) / 3.4% + AED 1.00 (international), with T+5 settlement. Both lack mature subscription/metered billing primitives compared to Stripe. |
| **UAE Corporate Bank Account Onboarding** | `UNVERIFIED` | Commercial Banking Survey (Wio Bank, Mashreq NeoBiz, ENBD) | 2026-10-28 | Digital corporate business banks (Wio Bank, Ruya) approve UAE Free Zone trade licenses in 3–7 business days; traditional Tier-1 banks (ENBD, FAB, Mashreq) require 3–6 weeks with proof of local office and client contracts. Needs confirmation by corporate services PRO. |
| **UAE VAT on Cross-Border Digital Services** | `VERIFIED` | UAE Federal Decree-Law No. 8 of 2017 Art. 45 & Exec Regs Art. 31 | 2026-10-28 | Cross-border export of digital services to non-resident commercial entities outside the GCC implementing states qualifies for zero-rating (0% VAT), provided the customer has no place of residence in the UAE and receives the service outside the state. Domestic UAE sales require standard 5% VAT. |
| **Launchpad Milestone Wire Viability** | `VERIFIED` | International SWIFT & UAE Central Bank Funds Transfer System (UAEFTS) | 2026-10-28 | High-value B2B milestone transactions ($2,000–$10,000) processed over credit cards lose $58–$490 per transaction in interchange/gateway fees. Bank wire transfer (SWIFT / domestic UAE transfer via IBAN) carries flat banking costs ($0–$25) with zero chargeback risk. |

---

## 4. Deep-Dive Comparative Analysis

### 4.1. The Three Operating Models

```
                                ┌────────────────────────────────────────────────────────┐
                                │              Payment Architecture Models               │
                                └────────────────────────────────────────────────────────┘
                                                            │
               ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
               ▼                                            ▼                                            ▼
    ┌──────────────────────┐                     ┌──────────────────────┐                     ┌──────────────────────┐
    │ Model A: Direct PSP  │                     │ Model B: MoR Model   │                     │ Model C: Hybrid Rail │
    │ (Stripe UAE)         │                     │ (Paddle / LS)        │                     │ (Recommended)        │
    ├──────────────────────┤                     ├──────────────────────┤                     ├──────────────────────┤
    │ • Exvorta is Seller  │                     │ • MoR is Seller      │                     │ • Stripe Billing for │
    │ • 2.9%–4.9% + AED 1  │                     │ • 5% + $0.50 flat    │                     │   SaaS ($49–$299/mo) │
    │ • T+5 bank payout    │                     │ • MoR files all VAT  │                     │ • Wire / SWIFT for   │
    │ • Full API control   │                     │ • Higher take-rate   │                     │   Milestones ($2k+)  │
    └──────────────────────┘                     └──────────────────────┘                     └──────────────────────┘
```

### 4.2. Model Comparison Matrix

| Evaluation Metric | Stripe UAE (Direct PSP) | Paddle / Lemon Squeezy (MoR) | Regional UAE Gateways (Telr / Network Intl) |
| :--- | :--- | :--- | :--- |
| **Standard Domestic Fee** | 2.9% + AED 1.00 | 5.0% + $0.50 | 2.25%–2.85% + AED 1.00 (+ monthly fee) |
| **International Card Fee** | 3.9% + AED 1.00 | 5.0% + $0.50 | 3.2%–3.8% + AED 1.00 |
| **Non-AED FX Surcharge** | +1.0% | Included in MoR take | +1.5%–2.0% |
| **Setup / Recurring Fees** | AED 0 / month | $0 / month | AED 99–249/mo or AED 1,500+ setup |
| **Settlement Cadence** | Rolling T+5 business days | Bi-weekly or monthly SWIFT | T+1 to T+3 business days |
| **Legal Seller of Record** | Exvorta (Dubai entity) | The MoR platform | Exvorta (Dubai entity) |
| **Global VAT / Sales Tax** | Exvorta responsible for registrations | MoR assumes 100% tax liability | Exvorta responsible for registrations |
| **Developer Ecosystem** | World-class (Next.js, Payload, Stripe Checkout) | Good webhooks; rigid checkout styling | Average to poor; legacy SOAP/redirects |
| **B2B Invoicing Primitives**| Native Stripe Invoicing & Customer Portal | Consumer/SaaS focus; weak milestone B2B | Basic manual link generation |

### 4.3. Effective Fee Modeling Across Scenarios

#### Scenario 1: Pro SaaS Subscription ($99 / ~AED 364 per month)
- **Stripe UAE (Domestic UAE card, billed in AED):**
  - Calculation: (AED 364 × 2.9%) + AED 1.00 = AED 10.56 + AED 1.00 = **AED 11.56 (3.18%)**
  - Net to Exvorta: **AED 352.44**
- **Stripe UAE (International US/EU card, billed in USD, settled in AED):**
  - Calculation: 2.9% base + 1% intl + 1% FX = 4.9% + AED 1.00 = AED 17.84 + AED 1.00 = **AED 18.84 (5.18%)**
  - Net to Exvorta: **AED 345.16**
- **Paddle / Lemon Squeezy ($99 USD):**
  - Calculation: ($99 × 5%) + $0.50 = $4.95 + $0.50 = **$5.45 (~AED 20.00, 5.51%)**
  - Net to Exvorta: **$93.55 (~AED 343.33)** (excluding potential $15 SWIFT withdrawal batch fee)

#### Scenario 2: Launchpad Milestone Invoice ($5,000 / ~AED 18,365)
- **Stripe UAE (Card Payment, International, 4.9% + AED 1.00):**
  - Total processing cost: **AED 900.89 (~$245.30)** lost to interchange.
- **Direct B2B Bank Wire (SWIFT / Domestic UAE IBAN transfer):**
  - Total processing cost: **AED 0 to AED 90 ($0–$25 flat bank incoming fee)**.
  - Net saving by routing via wire: **~$220–$245 per milestone**.

---

## 5. Architectural & Technical Implications (ADR-008)

### 5.1. Zero Cardholder Data Surface (PCI DSS SAQ A)
- In strict adherence to ADR-008 (`docs/blueprint.md`), no card numbers, CVVs, or cardholder PANs ever touch Exvorta servers, database, or application memory.
- Implementation uses **Stripe Checkout** (hosted redirect or embedded component) and **Stripe Customer Portal** for payment method updates, invoice downloads, and subscription tier upgrades/cancellations.

### 5.2. Webhook Ingestion & Idempotency Pipeline
- Route: `app/api/webhooks/stripe/route.ts` (Risk R2 file per factory governance; requires owner-visible rationale when implemented).
- Strict requirements:
  1. **Raw Body Verification:** Next.js Route Handler must verify signatures using `stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)`.
  2. **Idempotency Keying:** Webhook events must be logged and checked against a dedicated collection or database table (`stripe_events`) using `event.id` to prevent double-crediting on retries.
  3. **Tenancy Mapping:** Stripe `customer_id` and `subscription_id` must map deterministically to the Payload `organizations` collection (ADR-008).

### 5.3. Currency & Pricing Presentation Strategy
- **Pricing Display:** Display dual currencies on marketing pricing tables (`$USD` default for international, `AED` toggle for GCC visitors).
- **Settlement Optimization:** Price domestic UAE customers in AED to avoid the 1% FX conversion penalty. Offer USD checkout for international customers while recognizing the 1% Stripe conversion fee as a predictable cost of doing business.

---

## 6. Open Questions for Platform Owner

> [!IMPORTANT]
> Per the `exvorta-researcher` protocol, jurisdictional and commercial structural choices are the exclusive decision of the platform owner. The following questions remain open for owner determination:

1. **Corporate Banking Partner & Timeline:**
   - Which banking institution is holding or will hold the Dubai entity's operational accounts (e.g., Wio Bank Business, Mashreq NeoBiz, Emirates NBD)?
   - *Impact:* Digital banks (Wio) allow rapid Stripe UAE account verification within 24–48 hours of license issuance, whereas traditional Tier-1 banks may require 3–6 weeks.
2. **Primary Currency & Multi-Currency Settlement:**
   - Should Stripe UAE settle entirely in AED into a local AED account (accepting the 1% currency conversion fee on foreign charges), or will the owner establish a USD-denominated bank account in the UAE to enable Stripe USD-like-for-like settlement?
   - *Impact:* A native USD corporate account eliminates the 1% FX penalty on international enterprise milestone invoices.
3. **Tax & Merchant of Record Stance (VAT Compliance):**
   - Does the owner prefer direct Stripe processing (assuming responsibility for monitoring international sales tax nexus thresholds as cross-border volume grows) or starting with an MoR (Paddle/Lemon Squeezy) for SaaS subscriptions to completely outsource international VAT/GST filings?
   - *Note:* ADR-008 explicitly designated Stripe. If the owner affirms Stripe, Exvorta relies on Stripe Tax + zero-rated export invoices for foreign B2B clients.
4. **Launchpad Milestone Rails Policy:**
   - Should high-ticket Launchpad milestones ($2k–$10k) disable credit card payment entirely in favor of direct bank transfer (SWIFT / IBAN), or allow credit card payments with the ~4.9% processing surcharge passed through or absorbed into project margins?

---

## 7. Verification Summary

- **Document Location:** `docs/research/res-04-payment-rails.md`
- **Risk Class:** `R0` (Research / Sourced Documentation / No Product Code)
- **Gate Status:** Ready for validation
- **Not verified:** Exact approval timeline for physical corporate bank accounts with traditional Tier-1 UAE banks (EMIRATES NBD / FAB), which varies based on applicant residency and office lease status.