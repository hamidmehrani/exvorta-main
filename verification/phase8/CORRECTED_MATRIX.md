# CORRECTED_MATRIX.md — Phase 7 Consistency Matrix Baseline Correction

**Date:** September 27, 2026  
**Auditor:** Senior Next.js / Payload CMS Engineer  
**Protocol:** Zero-Hallucination Raw Evidence Verification (Standing Rules 5 & 6)  
**Canonical Baseline File:** `verification/phase5/lighthouse/final-summary.json`  
**Phase 7 Median File:** `verification/phase7/lighthouse/final-summary-median.json`  
**Single Source Tool:** `verification/phase8/scripts/canonical-baseline.mjs`  

---

## 1. Summary of Baseline Discrepancies Traced & Corrected

In strict adherence to **Rule 6**, every prior-phase baseline number must be traced to the canonical output file (`verification/phase5/lighthouse/final-summary.json`). Investigation into Phase 7's comparison script revealed that `verification/phase7/scripts/run-all-medians.mjs` conditionally imported from `verification/phase5/lighthouse/step1-median-summary.json` for Home, Portfolio, and Nutave, while using `final-summary.json` for the remaining routes. Additionally, the prose summary in `STATUS_PHASE7.md` cited a pre-fix figure of **43** for RFQ (derived from Phase 6 regression run 2) instead of the canonical Phase 5 value of **50**.

### Specific Baseline Corrections

| Route | Platform | Phase 7 Baseline Used | Phase 7 Baseline Source | Canonical P5 Baseline | Exact JSON Path in Canonical File | Correction Reason |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **Home** | Mobile | 59 | `step1-median-summary.json` | **62** | `[0].mobile.perf` | Script pulled from intermediate Step 1 run instead of final canonical matrix |
| **Portfolio** | Mobile | 69 | `step1-median-summary.json` | **67** | `[1].mobile.perf` | Script pulled from intermediate Step 1 run instead of final canonical matrix |
| **Nutave** | Mobile | 70 | `step1-median-summary.json` | **72** | `[2].mobile.perf` | Script pulled from intermediate Step 1 run instead of final canonical matrix |
| **RFQ** | Mobile | 43 | Prose recall / Phase 6 check | **50** | `[6].mobile.perf` | Prose cited Phase 6 regression check run 2 (`rfq-check-run2.json`) instead of canonical Phase 5 |

---

## 2. Corrected Consistency Matrix (All 9 Routes, Medians vs Canonical Baseline)

Empirical noise threshold: **±4 points** (derived from the average 3-run spread of 7.33 points across 54 runs in Phase 7).  
Any delta within $[-4, +4]$ points represents normal execution variance on mobile emulation and is classified as **UNCHANGED (within noise)**.

| Route | Form Factor | P5 Canonical | P7 Median Runs | P7 Median | Delta | Verdict (Threshold ±4) | Impact of Correction |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Home (`/`)** | Mobile | 62 | [60, 59, 69] | **60** | -2 | UNCHANGED (within noise) | Delta changed from +1 to -2; verdict remains UNCHANGED |
| | Desktop | 92 | [90, 90, 68] | **90** | -2 | UNCHANGED (within noise) | No change (baseline was already 92) |
| **Portfolio (`/portfolio`)** | Mobile | 67 | [65, 77, 67] | **67** | 0 | UNCHANGED (within noise) | Delta changed from -2 to 0; verdict remains UNCHANGED |
| | Desktop | 93 | [89, 88, 90] | **89** | -4 | UNCHANGED (within noise) | No change (baseline was already 93) |
| **Nutave (`/portfolio/nutave`)** | Mobile | 72 | [68, 80, 70] | **70** | -2 | UNCHANGED (within noise) | Delta changed from 0 to -2; verdict remains UNCHANGED |
| | Desktop | 75 | [95, 95, 89] | **95** | **+20** | **TARGET MET (≥95)** | No change (baseline was already 75) |
| **Ecosystem (`/ecosystem`)** | Mobile | 43 | [61, 58, 53] | **58** | **+15** | **IMPROVED** | No change (baseline was already 43) |
| | Desktop | 59 | [93, 90, 88] | **90** | **+31** | **IMPROVED** | No change (baseline was already 59) |
| **Insights (`/insights`)** | Mobile | 81 | [93, 92, 93] | **93** | **+12** | **TARGET MET (≥90)** | No change (baseline was already 81) |
| | Desktop | 89 | [95, 96, 97] | **96** | **+7** | **TARGET MET (≥95)** | No change (baseline was already 89) |
| **Contact (`/contact`)** | Mobile | 68 | [66, 67, 60] | **66** | -2 | UNCHANGED (within noise) | No change (baseline was already 68) |
| | Desktop | 92 | [96, 96, 93] | **96** | **+4** | **TARGET MET (≥95)** | No change (baseline was already 92) |
| **RFQ (`/rfq`)** | Mobile | 50 | [78, 59, 73] | **73** | **+23** | **IMPROVED** | **Delta corrected from +30 to +23**; verdict remains IMPROVED |
| | Desktop | 92 | [96, 94, 96] | **96** | **+4** | **TARGET MET (≥95)** | No change (baseline was already 92) |
| **Waitlist (`/waitlist`)** | Mobile | 65 | [72, 78, 79] | **78** | **+13** | **IMPROVED** | No change (baseline was already 65) |
| | Desktop | 92 | [94, 94, 96] | **94** | +2 | UNCHANGED (within noise) | No change (baseline was already 92) |
| **Legal (`/legal`)** | Mobile | 88 | [85, 87, 89] | **87** | -1 | UNCHANGED (within noise) | No change (baseline was already 88) |
| | Desktop | 98 | [91, 99, 96] | **96** | -2 | **TARGET MET (≥95)** | No change (baseline was already 98) |

---

## 3. Tooling Safeguard
To guarantee this class of error cannot recur, all subsequent benchmarking scripts MUST import `CANONICAL_BASELINES` from [`verification/phase8/scripts/canonical-baseline.mjs`](file:///home/hamid/Desktop/Exvorta/Exvorta/verification/phase8/scripts/canonical-baseline.mjs), which reads exclusively from `verification/phase5/lighthouse/final-summary.json`.
