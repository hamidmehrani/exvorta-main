# RES-03: HS Tariff Dataset Provenance & Commercial Licensing for TOOL-4

**Card ID:** RES-03 (`t_a118bc22`)  
**Profile:** `exvorta-researcher`  
**Date:** 2026-10-28  
**Risk Level:** R0 (Research Documentation)  
**Deliverable:** Sourced, dated research specification for TOOL-4 (Customs Tariff Engine / HS Code Lookup)

---

## 1. Question

What is the provenance, commercial licensing terms, dataset structure, and update cadence for Harmonized System (HS) customs tariff schedules required to power Exvorta's customs tariff engine (`TOOL-4`)? Specifically:
1. **Primary Provenance:** Where are the authoritative, machine-readable datasets for GCC customs tariffs hosted (specifically UAE and Saudi Arabia / ZATCA)?
2. **Licensing & Redistribution Rights:** Are these schedules in the public domain, distributed under Open Government Licenses, or restricted by third-party intellectual property (such as the World Customs Organization / WCO or multilateral portals)?
3. **Harmonization Architecture:** How do national schedules transition between international 6-digit WCO headings, 8-digit GCC Unified Customs Tariff lines, and modern 12-digit national Integrated Customs Tariff systems?
4. **Tool Architecture Implications:** What are the storage, hosting, search, and update requirements for implementing `TOOL-4` in `lib/tools/tariff/` without legal risk or prohibitive payload size?

---

## 2. Method

### What Was Searched
- **GCC Regional & National Customs Authorities:**
  - GCC Customs Union Authority (GCC-CUA) unified tariff specifications ([gcc-cua.org/unifedtariff](https://gcc-cua.org/unifedtariff)).
  - UAE Federal Authority for Identity, Citizenship, Customs and Port Security (ICP) and Bayanat UAE Open Data Portal ([bayanat.ae](https://bayanat.ae/en/Datasets/Dataset-info?id=1s6xnU2HZWoejs-Bzv48DtY2upzLQMC0Ss4h-sVQmKU)).
  - Dubai Customs notices, implementation guidelines, and tariff files (Customs Notice No. 10/2025, Notice No. 02/2026, Cabinet Resolution No. 119 of 2024, Al Munasiq portal, `IntegratedCustomsTariff.pdf`, `HSCodeMaster-v3.2`).
  - Saudi Zakat, Tax and Customs Authority (ZATCA) Integrated Customs Tariff portal, eServices-220 inquiry service, and Ministerial Resolutions (Ministerial Resolution No. 1447-88-5 dated 27 Oct 2025 and Decision No. 1447-88-7 dated 14 Nov 2025).
- **Multilateral Trade & Nomenclature Bodies:**
  - World Customs Organization (WCO) HS 2022 nomenclature legal structure, FAQ, and WCO Trade Tools subscription terms.
  - World Trade Organization (WTO) Tariff Download Facility licensing terms and user agreements.
  - International Trade Centre (ITC) Market Access Map (MacMap) commercial redistribution policies.
  - UN Comtrade classification tables (HS 2022 reference files).
- **Statutory & Legal Frameworks:**
  - Saudi Copyright Law (Royal Decree No. M/41, Article 4) regarding official government texts, statutory schedules, and public instruments.
  - UAE Open Government License (OGL-UAE) terms on Bayanat.ae.

### What Was Excluded
- **Third-Party Commercial Aggregators:** Descartes CustomsInfo, Avalara Customs Tariff API, TariffIQ, 3CE, and TradeSparq. These providers distribute proprietary enriched databases under restrictive SaaS terms prohibiting redistribution, white-labeling, or bulk extraction.
- **Logistics Forwarder Private Rate APIs:** Internal APIs from DHL, Kuehne+Nagel, Aramex, or Agility. These services provide estimated quote endpoints rather than canonical, redistributable whole-tariff datasets.

---

## 3. Findings Table

| Fact / Finding | Label | Primary Source & Link | Verified Date | Operational Context / Citation |
|---|---|---|---|---|
| **UAE 12-Digit Integrated Customs Tariff Scale** | `VERIFIED` | Dubai Customs Notice No. 10/2025 & Cabinet Resolution No. (119) of 2024 ([dubaicustoms.gov.ae](https://www.dubaicustoms.gov.ae/en/PoliciesAndNotices/Notices/CN10_2025.pdf)) | 2026-10-28 | Expansion from ~7,809 8-digit codes to 13,449–13,450 12-digit lines (951 new codes, 6,518 subdivisions, 5,981 unchanged with zero-extensions). |
| **KSA 12-Digit Integrated Customs Tariff Scale** | `VERIFIED` | ZATCA Ministerial Resolution No. (1447-88-5) & Decision No. (1447-88-7) ([zatca.gov.sa](https://zatca.gov.sa/en/RulesRegulations/Taxes/Pages/Integrated-Tarrifs.aspx)) | 2026-10-28 | ZATCA consolidated operational surface contains 19,104 lines at the 12-digit level, reflecting KSA national sub-headings, duty ceilings, and excise tiers. |
| **GCC Standard Common External Duty Baseline** | `VERIFIED` | GCC Unified Customs Law & Dubai Customs Integrated Tariff Schedule | 2026-10-28 | Standard ad valorem tariff across GCC member states is 5% on most non-exempt manufactured imports (85.8% of UAE tariff lines; 11.4% are duty-free at 0%). |
| **UAE 12-Digit Implementation Roadmap** | `VERIFIED` | Dubai Customs Notice No. 02/2026 & Notice No. 10/2025 | 2026-10-28 | Phased rollout: Phase 1 (Aug 2025) for GCC trade; Phase 2 (Feb 2026) for Free Zones and customs warehouses to mainland; Phase 3 (Aug 2026) for Rest of World imports; Phase 4 (Feb 2027) for temporary flows. |
| **KSA 12-Digit Implementation Status** | `VERIFIED` | ZATCA Official Gazette publication & EY Tax Alert ([zatca.gov.sa](https://zatca.gov.sa/en/RulesRegulations/Taxes/Pages/Integrated-Tarrifs.aspx)) | 2026-10-28 | Saudi Arabia implemented 12-digit tariff structure effective 1 January 2025; updated amendments (including HS 98.04 free zone rules) took effect 27 November 2025. |
| **WCO HS Nomenclature Copyright Boundaries** | `VERIFIED` | World Customs Organization FAQ & Publications ([wcoomd.org](https://www.wcoomd.org/en/topics/nomenclature/overview/harmonized_system_faq.aspx)) | 2026-10-28 | WCO holds copyright in its publications, Explanatory Notes, and database products. The base 6-digit nomenclature codes/descriptions as enacted in national legislation are public statutory law, but WCO Explanatory Notes cannot be extracted or redistributed. |
| **Saudi Official Tariff Legal / Copyright Status** | `VERIFIED` | Saudi Copyright Law, Royal Decree No. M/41, Article 4 | 2026-10-28 | Laws, regulations, ministerial decisions, and official state documents are exempt from copyright protection under Saudi law. ZATCA tariff schedules are official texts freely usable with attribution. |
| **UAE Open Government License (OGL-UAE)** | `VERIFIED` | Bayanat UAE Open Data Policy ([bayanat.ae](https://bayanat.ae/en/Datasets/Dataset-info?id=1s6xnU2HZWoejs-Bzv48DtY2upzLQMC0Ss4h-sVQmKU)) | 2026-10-28 | Datasets published on Bayanat.ae are licensed under Open Government License, granting worldwide, royalty-free, perpetual commercial exploitation rights subject to source attribution. |
| **Multilateral Portal Redistribution Restrictions** | `VERIFIED` | WTO Tariff Download Facility Terms & ITC MacMap Terms of Use | 2026-10-28 | Both WTO and ITC explicitly restrict commercial redistribution, systematic automated downloading, and integration into commercial SaaS products without express written authorization. |
| **Egyptian ACID Format (Cross-Border Reference)** | `UNVERIFIED` | Egyptian trade forwarder convention | 2026-10-28 | Reported as a 19-digit alphanumeric identifier generated by Nafeza MTS. Requires operational confirmation from a licensed Egyptian customs forwarder before hardcoding validation rules. |
| **Target User Search Paradigm for TOOL-4** | `ASSUMPTION` | Exvorta GTM Strategy & LeadGen thesis | 2026-10-28 | Exporters and traders will search primarily via plain-text product descriptions (English/Arabic keywords) rather than exact 12-digit codes. |

---

## 4. Implications for TOOL-4 (Customs Tariff Engine)

1. **Dataset Sourcing & Licensing Strategy:**
   - **Canonical Ingestion Sources:** Exvorta must ingest tariff lines directly from official national publications:
     - UAE: Dubai Customs Integrated Tariff Annexes (`HSCodeMaster-v3.2` / `IntegratedCustomsTariff.pdf`) and Bayanat.ae Open Data.
     - Saudi Arabia: ZATCA Integrated Customs Tariff whole-tariff export.
   - **Prohibited Sources:** Do not scrape or re-host data from ITC MacMap, WTO Tariff Download Facility, or WCO Explanatory Notes.
   - **Attribution Requirement:** Display statutory source attribution on all TOOL-4 results:
     > *"Tariff schedules sourced from UAE Federal Customs Authority / Dubai Customs (Notice 10/2025) and ZATCA (Resolution 1447-88-5). Informational estimates only; verify with licensed customs brokers before filing."*

2. **Data Model & Schema:**
   Each tariff entry in TOOL-4 should follow a standardized interface:
   ```typescript
   export interface CustomsTariffLine {
     hsCode: string;          // 6, 8, or 12 digits (normalized numeric string)
     jurisdiction: 'AE' | 'SA' | 'GCC';
     digits: 6 | 8 | 12;
     descriptionEn: string;
     descriptionAr?: string;
     dutyRate: number;        // e.g. 0.05 for standard 5%
     dutyType: 'ad_valorem' | 'specific' | 'exempt' | 'prohibited';
     vatRate: number;         // 0.05 for UAE, 0.15 for KSA
     exciseRate?: number;     // e.g. 0.50 (sugary drinks), 1.00 (energy drinks/tobacco)
     restricted: boolean;
     controllingAuthority?: string; // e.g. 'MoIAT', 'ESMA', 'SFDA', 'ZATCA'
     effectiveDate: string;   // ISO date (e.g. '2025-08-01')
   }
   ```

3. **Storage & Delivery Performance:**
   - **Payload Sizing:** The UAE tariff comprises ~13,450 lines; KSA comprises ~19,104 lines. An optimized flat JSON or SQLite database of these tables occupies approximately **1.8 MB – 2.8 MB (uncompressed)** or **~400 KB – 650 KB (gzipped)**.
   - **Bundle Discipline:** In compliance with repository mobile performance rules (fast on GCC mobile networks), the raw tariff dataset MUST NOT be included in the client-side JavaScript bundle.
   - **Execution Path:** Tariff lookup logic must reside in `lib/tools/tariff.ts`, exposed via a lightweight server action or API route (`app/api/tools/tariff/route.ts`), supporting keyword search and prefix code completion in < 50ms.

4. **Handling the Phased 12-Digit Transition:**
   - Because UAE RoW imports remain on 8 digits until August 2026, TOOL-4 must support dual-resolution lookup: matching either 8-digit GCC base codes or 12-digit national codes using official correlation tables.

---

## 5. Open Questions for Decision Owner

1. **Dual-Corridor vs Single-Market Launch:**
   - *Option A:* Launch TOOL-4 covering both UAE (Dubai/Abu Dhabi 12-digit) and KSA (ZATCA 12-digit) simultaneously to support the high-volume UAE-to-Saudi cross-border export corridor.
   - *Option B:* Launch Phase 1 with UAE 12-digit only, adding KSA in a follow-up card.
   - *Decision Owner:* Product / LeadGen Owner.

2. **Update Cadence Pipeline:**
   - *Option A (Static Snapshot):* Commit a versioned SQLite/JSON artifact into the repository, updated manually when major customs notices land (estimated 1-2 times per year).
   - *Option B (Automated Cron Sync):* Deploy an automated ingestion worker checking ZATCA eServices and Bayanat.ae monthly for tariff delta changes.
   - *Decision Owner:* LeadGen Systems Architect.

3. **Arabic Natural Language Search Depth:**
   - *Option A:* Exact substring and prefix match on official English and Arabic commodity descriptions.
   - *Option B:* Client-side or Edge semantic embedding vector search across bilingual trade synonyms (e.g. matching "laptop" to "Portable automatic data processing machines weighing not more than 10 kg").
   - *Decision Owner:* Product / Search UX Owner.
