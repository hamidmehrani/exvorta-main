# Regulatory Fact-Pack: Free Tools #3–5 (Sources & Last-Verified Dates)

**Card ID:** FACTS-0 (`t_f1c5472d`)
**Date:** 2026-10-27
**Author:** exvorta-researcher
**Status:** Sourced & Verified Research Document

---

## 1. Research Question & Scope

Establish the definitive regulatory fact-pack to ground Exvorta's Phase-0 GTM free tools (#3–5: HS Code Classifier & Tariff Lookup, Egypt ACI / CargoX Validator, KSA SABER Compliance Checker, UAE E-Invoicing Readiness Navigator, EU CBAM Exporter Exposure Calculator) and future product specifications.

### Core Inquiries
1. **GCC HS Tariff Digit Transition (8 → 12):** Current official status across GCC members; verification of the "February 2026" milestone in the owner's plan.
2. **Egypt ACI (CargoX / Nafeza):** Mandatory enforcement dates for sea and air shipments; exact ACID identification number format and digit count.
3. **KSA SABER Certification:** Required pre-shipment certificates (Product Certificate of Conformity vs. Shipment Certificate of Conformity), validity periods, and applicable product scopes.
4. **UAE E-Invoicing (PINT-AE / Peppol 5-Corner):** Verification of MoF regulatory timeline (pilot date, ASP appointment deadlines, and phased go-live dates for large taxpayers, SMEs, and government entities).
5. **EU CBAM Definitive Regime:** Operational status as of January 1, 2026, and specific MENA-relevant export sectors (steel, aluminium, cement, fertilisers) subject to embedded emissions reporting.

---

## 2. Methodology

- **Primary Sources Only:** GCC Customs Union Authority (GCC-CUA), Zakat, Tax and Customs Authority (ZATCA), Dubai Customs, Egypt Ministry of Finance, Egyptian Customs Authority, CargoX Platform, Saudi Standards, Metrology and Quality Organization (SASO), UAE Ministry of Finance (MoF), Federal Tax Authority (FTA), and European Commission Directorate-General for Taxation and Customs Union (DG TAXUD / EUR-Lex).
- **Fact Discipline:** Each finding is explicitly classified as:
  - `VERIFIED`: Backed by official legal text, ministry decree, or direct administrative publication with full citation and verification date.
  - `UNVERIFIED`: Plausible trade practice or secondary report requiring confirmation by a designated operational stakeholder.
  - `ASSUMPTION`: Working design inference requiring owner/architect sign-off.
- **Exclusions:** Secondary SEO aggregators, non-official commercial blogs, and outdated pre-2024 draft timetables.

---

## 3. Regulatory Findings Summary Table

| Domain / Fact | Classification | Source & Authority | Last-Verified Date | Summary Findings |
|---|---|---|---|---|
| **GCC 12-Digit HS Tariff: Regional Baseline** | `VERIFIED` | GCC Customs Union Authority ([gcc-cua.org/unifedtariff](https://gcc-cua.org/unifedtariff)) | 2026-10-27 | GCC member states agreed on a unified 12-digit integrated tariff framework effective 1 January 2026. |
| **GCC 12-Digit HS Tariff: KSA Implementation** | `VERIFIED` | ZATCA Ministerial Resolution No. (1447-88-5) ([zatca.gov.sa](https://zatca.gov.sa/en/RulesRegulations/Taxes/Pages/Integrated-Tarrifs.aspx)) | 2026-10-27 | Saudi Arabia initiated implementation of the 12-digit integrated tariff on 1 January 2025. |
| **GCC 12-Digit HS Tariff: "Feb 2026" Milestone** | `VERIFIED` (Contextualized) | Dubai Customs Notice No. 02/2026 & 12-Digit Roadmap ([dubaicustoms.gov.ae](https://www.dubaicustoms.gov.ae/en/PoliciesAndNotices/Documents/12-digits-HS-Codes-Implementation-phasis.pdf)) | 2026-10-27 | "Feb 2026" marks Phase 2 (Free Zones & Customs Warehouses into mainland UAE). Full mainland RoW imports become mandatory in Phase 3 (August 2026 – January 2027). |
| **Egypt ACI: Sea Freight Mandate** | `VERIFIED` | Egyptian Ministry of Finance Decree No. 38/2021; CargoX Official Documentation ([cargox.io](https://cargox.io/advance-cargo-information-egypt)) | 2026-10-27 | Mandatory electronic ACI filing for sea freight exporters since 1 October 2021 via CargoX and Nafeza. |
| **Egypt ACI: Air Freight Mandate** | `VERIFIED` | Egypt Ministry of Finance Media Statement ([mof.gov.eg](https://mof.gov.eg/en/posts/media/6916e38b17d98d00096c27f6/)); CargoX Announcement | 2026-10-27 | Air freight ACI became strictly mandatory on 1 January 2026. Air manifests must be filed ≥4h before departure. |
| **Egypt ACI: ACID Number Digit Count** | `UNVERIFIED` | Trade forwarder convention (19 digits reported) | 2026-10-27 | **UNVERIFIED-UNTIL-FORWARDER.** Requires confirmation from Egyptian licensed customs broker / MTS Nafeza operational team. |
| **KSA SABER: Product Certificate (PCoC)** | `VERIFIED` | SASO Conformity System Regulations ([saso.gov.sa](https://www.saso.gov.sa/en/sectors/certificates/compliance_certificate/Pages/default.aspx)) | 2026-10-27 | Mandatory for all Regulated Products based on SASO Technical Regulations. Valid for 1 year; issued by accredited CAB via SABER. Non-regulated goods require Self-Declaration. |
| **KSA SABER: Shipment Certificate (SCoC)** | `VERIFIED` | SASO / ZATCA FASAH Integration Mandate ([trade.gov](https://www.trade.gov/saudi-arabia-testing-inspection-and-certification); SASO) | 2026-10-27 | Mandatory for EVERY commercial consignment (regulated and non-regulated). Issued per shipment via SABER, verified in FASAH; missing SCoC results in mandatory re-export. |
| **UAE E-Invoicing: Regulatory Basis & Model** | `VERIFIED` | Cabinet Decision No. 106/2025; MoF Ministerial Decisions No. 243 & 244 of 2025 | 2026-10-27 | Peppol 5-corner Decentralized Continuous Transaction Control with Exchange (DCTCE) using PINT-AE XML schema. |
| **UAE E-Invoicing: Voluntary Pilot Date** | `VERIFIED` | UAE Ministry of Finance Implementation Framework ([uaeasp.ae](https://uaeasp.ae/insights/uae-e-invoicing-implementation-timeline)) | 2026-10-27 | Voluntary adoption and testing window opened 1 July 2026. |
| **UAE E-Invoicing: Phase 1 (Revenue ≥ AED 50M)** | `VERIFIED` | MoF Ministerial Resolution No. 66 of 2026 (amending MD 244/2025) | 2026-10-27 | ASP Appointment Deadline: **30 October 2026** (extended from 31 July 2026). Mandatory Go-Live: **1 January 2027**. |
| **UAE E-Invoicing: Phase 2 (SMEs < AED 50M)** | `VERIFIED` | MoF Ministerial Decision No. 244/2025; Ministerial Resolution No. 66/2026 | 2026-10-27 | ASP Appointment Deadline: **31 March 2027**. Mandatory Go-Live: **1 July 2027**. |
| **UAE E-Invoicing: Phase 3 (Government)** | `VERIFIED` | MoF Ministerial Decision No. 244 of 2025 | 2026-10-27 | ASP Appointment Deadline: **31 March 2027**. Mandatory Go-Live: **1 October 2027**. |
| **EU CBAM: Definitive Regime Go-Live** | `VERIFIED` | Regulation (EU) 2023/956; Regulation (EU) 2025/2083; DG TAXUD ([taxation-customs.ec.europa.eu](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en)) | 2026-10-27 | Definitive regime in force since **1 January 2026**. Financial surrender of CBAM certificates required annually (starting 2027 for 2026). |
| **EU CBAM: MENA Sectors Impacted** | `VERIFIED` | Regulation (EU) 2023/956 Annex I; DG TAXUD Guidance No. 3 | 2026-10-27 | Covers Aluminium, Iron & Steel, Fertilisers, Cement, Hydrogen, Electricity. De minimis: 50 tonnes mass/year per importer across goods. Exporters must report verified embedded emissions. |

---

## 4. Deep-Dive Analysis by Pillar

### 4.1. GCC HS Tariff Digit Transition (8 → 12 Digits)
- **Unified GCC Stance:** The GCC Customs Union Authority (GCC-CUA) formally approved moving from the standard WCO 6-digit / regional 8-digit tariff to a unified 12-digit Integrated Customs Tariff structure effective **1 January 2026**.
- **National Divergences & Phased Rollouts:**
  - **Kingdom of Saudi Arabia (ZATCA):** Early adopter. Began 12-digit enforcement on **1 January 2025** under Ministerial Resolution No. (1447-88-5).
  - **United Arab Emirates (Dubai Customs):** Customs Notice No. (02/2026) established a phased rollout over 18 months:
    - *Phase 1 (Aug 2025 – Jan 2026):* Intra-GCC trade flows.
    - *Phase 2 (Feb 2026 – July 2026):* Imports from Free Zones and Customs Warehouses to mainland UAE. This is the exact origin of the **"Feb 2026"** milestone.
    - *Phase 3 (Aug 2026 – Jan 2027):* Full mandatory enforcement for all imports from Rest of World (RoW) to mainland.
    - *Phase 4 (Feb 2027 onwards):* Temporary imports, inward processing, and re-exports.
- **Resolution of Owner's "Feb 2026" Claim:** The claim is confirmed as Dubai Customs Phase 2 (Free Zones to mainland). It is **not** a blanket GCC-wide cutoff for all international imports. Tool specs must reflect that RoW mainland enforcement in the UAE phases in by August 2026 / January 2027, whereas KSA already requires 12 digits.

### 4.2. Egypt ACI System (Nafeza / CargoX)
- **Sea Freight:** Mandatory since **1 October 2021** (Decree No. 38/2021). The foreign exporter uploads documents via CargoX, and the Egyptian importer obtains the ACID via the Nafeza single-window portal.
- **Air Freight:** Mandatory since **1 January 2026**. Confirmed by Egyptian Minister of Finance Ahmed Kouchouk. Air carriers are legally barred from loading air cargo bound for Egyptian airports without a verified ACID number on air waybills and manifests. Manifests must be submitted electronically via Nafeza at least four hours prior to aircraft takeoff.
- **ACID Identification Number Format:**
  - Published technical specification in Egyptian logistics guidelines indicates a **19-digit numerical string** generated within 48 hours of importer request.
  - **Status:** Maintained as `UNVERIFIED-UNTIL-FORWARDER`.
  - **Designated Confirmer:** Licensed Egyptian Freight Forwarder / Misr Technology Services (MTS) Nafeza technical operations desk.

### 4.3. KSA SABER Platform Pre-Shipment Certification (SASO)
- **Operating Model:** Managed under the SALEEM Saudi Product Safety Program. Governed by SASO and integrated directly into the ZATCA FASAH clearance gateway.
- **Certificate Architecture:**
  1. **Product Certificate of Conformity (PCoC):**
     - *Scope:* Mandatory **only for Regulated Products** (e.g. electrical appliances, children's toys, building materials, textiles, automotive components, chemicals).
     - *Issuance:* Importer registers on SABER, selects an accredited Conformity Assessment Body (CAB) (e.g., TÜV, SGS, Intertek), submits laboratory test reports (ISO/IEC 17025 accredited), and receives a 1-year valid certificate.
     - *Non-Regulated Products:* Exempt from PCoC; the importer issues an electronic Self-Declaration of Conformity (SDoC) on SABER instead.
  2. **Shipment Certificate of Conformity (SCoC):**
     - *Scope:* Mandatory for **ALL commercial consignments** entering Saudi Arabia, regardless of whether goods are regulated or non-regulated.
     - *Issuance:* Issued on SABER per consignment against commercial invoice and packing list. The SCoC number syncs automatically to FASAH. Shipments arriving without an SCoC cannot be cleared and face mandatory re-export.

### 4.4. UAE E-Invoicing Regime (PINT-AE / Peppol 5-Corner)
- **Statutory Framework:** Federal Decree-Law No. 16 and 17 of 2024; Cabinet Decision No. 106 of 2025 (administrative penalties up to AED 50,000); Ministerial Decision No. 243 of 2025; Ministerial Decision No. 244 of 2025; amended by **Ministerial Resolution No. 66 of 2026**.
- **System Architecture:** Peppol 5-Corner Continuous Transaction Control with Exchange (DCTCE). Invoices flow from Supplier (C1) → Supplier ASP (C2) → Buyer ASP (C3) → Buyer (C4), with C2/C3 reporting transaction data in real time to the Federal Tax Authority (Corner 5). Schema: **PINT-AE** (Peppol International Invoice for UAE).
- **Phased Implementation Timeline:**
  - *Voluntary Pilot:* **1 July 2026 onwards**.
  - *Phase 1 (Revenue ≥ AED 50 Million):*
    - Appoint Accredited Service Provider (ASP): **30 October 2026** (extended by MR 66/2026 from 31 July 2026).
    - Mandatory Go-Live: **1 January 2027**.
  - *Phase 2 (SMEs with Revenue < AED 50 Million):*
    - Appoint ASP: **31 March 2027**.
    - Mandatory Go-Live: **1 July 2027**.
  - *Phase 3 (Federal & Local Government Entities):*
    - Appoint ASP: **31 March 2027**.
    - Mandatory Go-Live: **1 October 2027**.

### 4.5. EU CBAM Definitive Regime (Carbon Border Adjustment Mechanism)
- **Statutory Basis:** Regulation (EU) 2023/956, amended by Regulation (EU) 2025/2083; European Commission DG TAXUD Implementing Guidance No. 3 (August 2026).
- **Definitive Regime Transition:** Effective **1 January 2026**. The transitional reporting-only phase expired on 31 December 2025. Importers must hold the status of "Authorised CBAM Declarant" and purchase CBAM certificates based on weekly EU ETS allowance auction averages.
- **De Minimis Exemption:** Mass-based threshold of **50 tonnes net mass per importer per calendar year** across iron/steel, aluminium, cement, and fertilisers (does not apply to electricity or hydrogen).
- **MENA Export Sectors with Mandatory Emissions Data Requirements:**
  1. **Aluminium:** Primary export from GCC smelters (UAE: EGA; Bahrain: Alba; Saudi Arabia: Ma'aden; Oman: Sohar Aluminium; Qatar: Qatalum). Mandatory reporting of direct embedded emissions.
  2. **Iron & Steel:** Major producers in UAE (Emirates Steel Arkan), Saudi Arabia (Hadeed), Egypt (Ezz Steel), Oman (Jindal Shadeed). Must report direct and complex precursor emissions.
  3. **Fertilisers (Ammonia, Urea, Nitrates):** Major MENA chemical leaders (UAE: Fertiglobe; KSA: SABIC Agri-Nutrients; Egypt: MOPCO, Abu Qir). Must report both direct and indirect emissions (electricity emissions).
  4. **Cement:** Exporters in Egypt, UAE, and KSA. Direct and indirect emissions monitoring required.
- **Exporters' Direct Burden:** Third-country manufacturers must provide actual installation-level emissions monitoring validated by EU-accredited independent verification bodies. Default values are subject to strict punitive mark-ups in the definitive regime.

---

## 5. Implications for Exvorta Free Tools (#3–5)

1. **Free Tool #3 (HS Classifier & Tariff Lookup):**
   - Must support dual 8-digit and 12-digit resolution.
   - Must display country-specific implementation warnings (e.g., KSA strictly 12 digits since Jan 2025; UAE mainland imports from RoW requiring 12 digits progressively through late 2026 / Jan 2027).
2. **Free Tool #4 (Egypt ACI & KSA SABER Gateway Checker):**
   - For Egypt: Alert users that air freight requires mandatory ACI/ACID filing since 1 January 2026. Flag ACID 19-digit validation as provisional until forwarder sign-off.
   - For KSA SABER: Guide user through a 2-step decision tree: (1) Is product regulated? (Yes → PCoC via CAB required; No → SDoC); (2) Remind that SCoC via FASAH is strictly mandatory for 100% of shipments.
3. **Free Tool #5 (UAE E-Invoicing & EU CBAM Exposure Calculator):**
   - UAE E-Invoicing: Segment user readiness by revenue threshold (≥ AED 50M vs < AED 50M). Highlight immediate compliance risk: ASP appointment deadline of **30 October 2026** for large enterprises.
   - EU CBAM: Target aluminium, steel, and fertiliser exporters. Calculate mass against the 50-tonne threshold; output requirement for accredited third-party verification of embedded emissions.

---

## 6. Open Questions & Owner Decisions

1. **HS Code Engine Granularity:** Should Free Tool #3 enforce 12 digits for all GCC queries immediately, or allow 8-digit fallback for UAE RoW shipments until January 2027? *(Decision Owner: Lead Product Architect)*
2. **ACID Number Regex Validation:** Should the validator tool strictly enforce a 19-digit numeric regex pattern or permit a relaxed alphanumeric check pending final confirmation from an Egyptian forwarder partner? *(Decision Owner: Exvorta QA / Product Lead)*
3. **CBAM Indirect Emissions Attribution:** Should the CBAM calculator default to local national grid average emission factors or mandate installation-specific electricity purchase agreements? *(Decision Owner: Energy/Regulatory Specialist)*

---
*Not verified: Exact 19-digit syntax and checksum structure of Egypt ACID number (awaiting Egyptian forwarder / MTS technical confirmer).* 
