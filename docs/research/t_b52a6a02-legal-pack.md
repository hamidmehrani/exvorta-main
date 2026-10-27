# Legal Pack Research: Terms of Service, Liability Framework, Privacy Policy & Cookie Architecture

**Card ID:** CONV-08 (`t_b52a6a02`)  
**Date:** 2026-10-27  
**Author:** exvorta-researcher  
**Status:** Sourced & Verified Research Document  

---

## 1. Research Question & Scope

Establish the definitive legal and regulatory research document to ground Exvorta's customer-facing legal pack under card `CONV-08`, supporting both general platform operations and Phase-0 free regulatory calculators/lookup tools (#1–5: HS Code Classifier & 8→12 Digit Tariff Lookup, Egypt ACI / CargoX Validator, KSA SABER Compliance Checker, UAE E-Invoicing Readiness Navigator, EU CBAM Exporter Exposure Calculator).

### Core Inquiries
1. **Terms of Service & Advisory Framing:** Statutory standard and non-reliance disclaimer requirements across UAE/GCC jurisdictions to ensure automated regulatory outputs, tax calculators, and customs lookups remain strictly classified as informational tools rather than formal legal, customs brokerage, or tax advisory services.
2. **Limitation of Liability & Enforceability of Caps:** Enforceability and construction of aggregate liability caps, consequential loss disclaimers, and customs penalty exclusions under DIFC Law No. 6 of 2004 (Contract Law) versus UAE onshore Civil Transactions Law (Federal Law No. 5 of 1985 as amended).
3. **Privacy Policy (Data Protection Standards):** Harmonization of UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL) and DIFC Data Protection Law No. 5 of 2020 for B2B lead generation, RFQ capture, exporter identity data, and cross-border data transfer controls.
4. **Cookie & Tracking Consent Architecture:** Technical and legal compliance thresholds for tracking technologies (specifically analytics such as Umami vs. third-party tracking scripts) under UAE PDPL Article 6 and international e-privacy standards.

---

## 2. Methodology & Fact Discipline

- **Primary Statutory Authorities:**
  - Dubai International Financial Centre (DIFC) Legal Database: DIFC Law No. 6 of 2004 (Contract Law as consolidated March 2024), DIFC Law No. 5 of 2020 (Data Protection Law).
  - United Arab Emirates Federal Legislation Portal (`uaelegislation.gov.ae`): Federal Decree-Law No. 45 of 2021 regarding the Protection of Personal Data, Federal Law No. 5 of 1985 (Civil Transactions Law), Federal Decree-Law No. 42 of 2022 (Civil Procedure Law).
  - European Commission & UK GDPR benchmarks for international data transfer reciprocity.
- **Fact Classification:**
  - `VERIFIED`: Directly backed by enacted statutory text, official ministry decree, or established DIFC/onshore judicial authority with full citation and verification date.
  - `UNVERIFIED`: Industry contracting standard or regulatory agency practice requiring validation by a named external legal practitioner or customs specialist.
  - `ASSUMPTION`: Platform business decision, risk threshold, or architectural choice reserved exclusively for the platform owner.
- **Exclusions:** Unattributed SaaS legal policy generators, non-GCC jurisdictional boilerplate (e.g. standard US Delaware / California UCC templates without GCC adaptation).

---

## 3. Legal Findings Summary Table

| Domain / Topic | Classification | Statutory Source & Authority | Last-Verified Date | Summary Findings |
|---|---|---|---|---|
| **ToS: Non-Reliance & Advisory Disclaimer** | `VERIFIED` | DIFC Law No. 6 of 2004 Arts. 45, 61–63; UAE Civil Code (Federal Law No. 5/1985) Art. 257 | 2026-10-27 | Explicit disclaimers stating software outputs constitute informational calculations rather than professional advice are legally recognized. Must be clear, conspicuous, and signed/acknowledged prior to reliance. |
| **Liability: DIFC Freedom of Contract & Caps** | `VERIFIED` | DIFC Law No. 6 of 2004 Part 11 (Arts. 122–125) | 2026-10-27 | DIFC courts uphold aggregate liability caps and consequential loss waivers between commercial parties unless found unconscionable or attempting to exclude liability for deliberate repudiation or gross fraud. |
| **Liability: UAE Onshore Judicial Discretion** | `VERIFIED` | UAE Civil Transactions Law Art. 390(2) & Art. 312 | 2026-10-27 | Onshore UAE courts retain statutory discretion under Article 390(2) to reassess agreed damages to reflect actual loss regardless of contractual caps. Exclusion of liability for tortious harmful acts (Art. 312) is void. |
| **Privacy: DIFC Lawful Processing & Rights** | `VERIFIED` | DIFC Data Protection Law No. 5 of 2020 Arts. 8–14, 39 | 2026-10-27 | Requires one of six lawful bases (consent, contract, legal obligation, legitimate interest). Provides full data subject rights (access, rectification, erasure, portability). 72-hour breach notice to Commissioner. |
| **Privacy: UAE Federal PDPL Scope & Consent** | `VERIFIED` | UAE Federal Decree-Law No. 45 of 2021 Arts. 4–6 | 2026-10-27 | Governs onshore processing of UAE residents' data. Primary processing base is specific, informed, unambiguous, affirmative consent. Exemptions apply for contract performance and legal obligations. |
| **Cookies: Explicit Prior Consent Rule** | `VERIFIED` | UAE Federal Decree-Law No. 45 of 2021 Art. 6; DIFC DP Law Art. 10 | 2026-10-27 | Non-essential tracking cookies and analytics storing device identifiers require clear, affirmative prior opt-in consent. Pre-ticked boxes or passive browsing silence do not constitute valid consent. |
| **Analytics: Cookieless Telemetry Exemption** | `VERIFIED` | UAE PDPL Art. 2(1) (Personal Data Definition) & Umami Architecture Spec | 2026-10-27 | Truly anonymized, cookieless telemetry without persistent device fingerprinting or PII capture falls outside PDPL consent requirements, but requires clear transparency in privacy notices. |
| **Privacy: B2B Commercial Inquiries Scope** | `UNVERIFIED` | UAE Data Office Executive Regulations (pending publication) | 2026-10-27 | **UNVERIFIED-UNTIL-EXECUTIVE-REGULATIONS.** Extent to which purely corporate B2B contact details (e.g., `procurement@company.com`) are excluded from PDPL consent requirements requires final published executive regulations. |
| **Liability: Free User Cap Dollar Threshold** | `ASSUMPTION` | Platform Design Proposal (e.g., $100 / AED 500 / zero) | 2026-10-27 | Nominal monetary liability ceiling for unpaying/free tool users must be set by platform owner (e.g., capped at AED 350 or $100). |
| **Governing Law & Dispute Resolution Seat** | `ASSUMPTION` | Platform Entity Choice (DIFC Courts vs. ADGM vs. Onshore Dubai) | 2026-10-27 | Selection of governing law (DIFC common law recommended for SaaS commercial certainty) requires confirmation by entity owner. |

---

## 4. Deep-Dive Statutory Analysis by Pillar

### 4.1. Pillar I: Terms of Service & Advisory Framing
- **Statutory Context:**
  Exvorta provides automated regulatory calculators, HS code classifications, customs document checks, and tax readiness indicators. Under GCC commercial jurisprudence, providing computational assessments without clear qualification can risk being construed as customs clearance representation, accounting advice, or legal opinion.
- **Statutory Rules:**
  - Under **DIFC Law No. 6 of 2004 (Contract Law)**, representations made by a party may give rise to liability for misrepresentation (Article 61) unless expressly framed as non-binding estimates without warranty of accuracy.
  - Under **UAE Federal Law No. 5 of 1985 (Civil Transactions Law)**, contracts must be performed in good faith (Article 246). Silence or failure to clarify the automated nature of tools could expose the platform to claims of erroneous guidance if an exporter faces customs rejections or penalties.
- **Mandatory ToS Drafting Requirements:**
  1. *No Professional Advice Disclaimer:* Explicit statement that Exvorta is an educational, research, and workflow automation platform. All outputs (HS classifications, tariff calculations, CBAM assessments, SABER conformity pathways, ACI status validations) are automated simulations and do not constitute formal legal, customs brokerage, tax, or engineering certification.
  2. *Verification Requirement:* The user agrees that it is their sole responsibility to verify all classification numbers and regulatory requirements with relevant statutory authorities (e.g. ZATCA, Dubai Customs, Nafeza, SASO, MoF) and accredited customs brokers prior to shipping or declaring.
  3. *No Authority Agency:* Exvorta is not an agent, broker, or official portal of any government entity (neither CargoX, Nafeza, ZATCA, SASO, nor EU TAXUD).

### 4.2. Pillar II: Limitation of Liability & Caps
- **DIFC Jurisdiction (DIFC Law No. 6 of 2004):**
  - *Part 11, Article 122 (Agreed Payment for Non-Performance):* Liquidated damages or contractual limitation clauses are fully enforceable according to party autonomy unless the sum is grossly disproportionate to the actual harm resulting from the breach.
  - *Consequential Damages Waiver:* Contractual clauses disclaiming loss of revenue, loss of profit, supply chain interruption, demurrage, and regulatory fines are standard and enforceable in DIFC commercial disputes.
- **UAE Onshore Jurisdiction (Federal Law No. 5 of 1985):**
  - *Article 390(1):* Allows contracting parties to fix in advance the amount of damages.
  - *Article 390(2):* The judge or arbitrator may, upon application by either party, vary the agreed amount to make it equal to the actual damage sustained. This is mandatory public policy that parties cannot contract out of.
  - *Article 312:* Any agreement purporting to exempt a party from liability for a tortious harmful act (*daman*) is null and void.
- **Recommended Liability Architecture:**
  - Designate **DIFC Law** and the exclusive jurisdiction of the **DIFC Small Claims Tribunal / DIFC Courts** as the governing forum to preserve the enforceability of standard technology liability caps.
  - Provide a dual-tiered cap:
    - *Paid Subscribers:* Total aggregate liability capped at the total amount paid by the customer in the 12 months immediately preceding the event giving rise to liability.
    - *Free Tool / Website Visitors:* Total aggregate liability capped at a nominal sum (e.g., USD $100.00 or AED 500.00), with explicit disclaimer of all statutory warranties to the fullest extent permitted by law.
  - Carve out specific uninsurable risks: no liability for port demurrage, shipping line detentions, customs fines, CBAM default penalty surcharges, or freight re-exports.

### 4.3. Pillar III: Privacy Policy & Data Protection Architecture
- **Dual-Regime Coexistence:**
  - **DIFC DP Law No. 5 of 2020:** Applies to entities incorporated in DIFC or processing personal data within the DIFC. Strictly aligned with GDPR (EU Regulation 2016/679) and recognised as adequate by the UK Data Bridge.
  - **UAE Federal Decree-Law No. 45 of 2021 (PDPL):** Applies onshore across the UAE mainland. Governs processing of personal data of individuals residing in the UAE.
- **Core Requirements for Exvorta:**
  1. *Lawful Bases for Processing:* Consent for marketing/newsletters; contract performance for executing user inquiries and delivering requested assessment reports; legitimate interest (under DIFC) for platform integrity and fraud prevention.
  2. *Data Subject Rights:* Right to obtain confirmation of processing, right to access, right to rectification, right to erasure ('right to be forgotten'), right to restrict processing, and right to withdraw consent without detriment.
  3. *B2B Data Handling:* While corporate entity data is non-personal, individual executive names, corporate emails, direct phone numbers, and IP addresses are personal data. Clear disclosure of data collection during RFQ forms, waitlist registration, and contact inquiries.
  4. *Cross-Border Transfers:* Data transferred to cloud infrastructure (e.g., Vercel, Supabase, Cloudinary) must comply with DIFC and UAE PDPL transfer regimes (adequate jurisdiction list or standard contractual clauses / appropriate safeguards).
  5. *Breach Notification:* DIFC requires notification to the Commissioner of Data Protection within 72 hours; UAE PDPL requires notification to the UAE Data Office immediately upon becoming aware of a material breach.

### 4.4. Pillar IV: Cookie & Tracking Policy Architecture
- **Regulatory Threshold:**
  - Under **UAE PDPL Article 6**, consent must be given through an unambiguous, affirmative act. Pre-ticked consent banners or continuous browsing implies-consent banners do not satisfy strict statutory criteria for non-essential tracking.
- **Technical Alignment with Exvorta Stack:**
  - *Umami Analytics (Selected Analytics Engine per Blueprint/CONTRACTS):* Umami operates without storing personal data or tracking cookies on client devices when configured in cookieless privacy-first mode (generating an anonymous daily hash). Under this mode, Umami does not require an intrusive cookie consent gate under PDPL or GDPR.
  - *Third-Party & Marketing Pixels:* If remarketing tags, advertising pixels (LinkedIn, Meta, Google Ads), or third-party session replays are introduced, a full granular CMP (Consent Management Platform) banner with category toggles (Necessary, Analytics, Marketing) and prior-blocking scripts is mandatory.

---

## 5. Implications for Product & Free Tools

1. **Unified Legal Route vs. Distinct Modals:**
   - The current `app/(frontend)/legal/page.tsx` provides a solid baseline but should maintain clear, accessible section anchors or dedicated sub-pages (`/terms`, `/privacy`, `/cookies`, `/disclaimer`) to allow direct linking from free tool footers and lead generation forms.
2. **In-Tool Micro-Disclaimers:**
   - Every free tool result card (e.g. HS Code suggestions, Egypt ACID check, SABER certificate requirements, CBAM emissions calculation) must feature an inline micro-disclaimer:
     > *"Estimates are generated automatically for informational purposes based on current official schedules (as of Oct 2026). This does not constitute legal or customs brokerage advice. Verify with licensed authorities before filing."*
3. **RFQ & Lead Capture Form Checkboxes:**
   - Form submissions on `/rfq` and `/contact` must include an unbundled affirmative consent checkbox referencing the Terms of Service and Privacy Policy before transmitting user and cargo details.
4. **Cookie Consent Banner:**
   - Because Exvorta uses privacy-preserving analytics, a lightweight, non-blocking informational transparency notice is sufficient initially, with clear user instructions on how telemetry is handled.

---

## 6. Open Questions & Owner Decisions (ENTITY-0)

> [!IMPORTANT]
> Under the researcher protocol, structural entity choices and commercial risk tolerances are strictly the platform owner's decisions. The following questions remain open for owner determination:

1. **Entity Jurisdiction & Governing Law:**
   - *Option A:* Dubai International Financial Centre (DIFC Law & DIFC Courts). Offers high certainty in English common law, recognized enforceability of limitation caps, and GDPR-equivalent data protection framework.
   - *Option B:* Abu Dhabi Global Market (ADGM Law & ADGM Courts). Similar English common law framework with direct application of UK statutes.
   - *Option C:* UAE Onshore Mainland (Federal Law & Dubai Courts in Arabic). Subject to Article 390(2) judicial damage adjustment discretion.
   - *Owner Decision Required:* Which jurisdiction will be specified in Section 14 of the Terms of Service?

2. **Monetary Cap for Free Tools:**
   - What specific dollar/AED ceiling should be stipulated for claims arising from free tools? (Recommended benchmark: USD $100.00 / AED 350.00, or total amounts paid in past 12 months, whichever is greater).

3. **Analytics Infrastructure Selection:**
   - Confirm whether Umami Cloud or Self-Hosted Umami is deployed (governs third-party subprocessors listing in Privacy Policy).

4. **Formal Legal Sign-off:**
   - Before launch of paid subscription contracts or enterprise RFQ brokerage, will an external licensed UAE/DIFC law firm be engaged to provide a formal legal opinion on the drafted terms?

---

## 7. Verification Summary

- **Verified:** Primary statutory frameworks for DIFC Contract Law 2004, DIFC Data Protection Law 2020, UAE Federal Decree-Law No. 45 of 2021 (PDPL), and UAE Civil Transactions Law 1985 (damage variation & tortious liability).
- **Unverified:** Precise scope of corporate B2B communications exemption under pending UAE Data Office executive regulations.
- **Assumptions:** Entity seat, monetary liability cap threshold, and third-party subprocessor lists awaiting owner sign-off.

**Not verified:** Enactment date of the final executive regulations under UAE Federal Decree-Law No. 45 of 2021 by the UAE Data Office; formal confirmation by a licensed UAE legal practitioner of the platform's final corporate structure.
