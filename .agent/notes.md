# Agent Notes — RES-03: HS tariff dataset provenance for TOOL-4

- **Card:** `RES-03` (Task `t_a118bc22`)
- **Assignee:** `exvorta-researcher`
- **Risk Level:** `R0`
- **Branch:** `card/res-03-hs-data`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_a118bc22`

## Completed Actions
1. Initialized card context and analyzed requirements for customs tariff dataset provenance and commercial licensing for TOOL-4.
2. Verified authoritative datasets and primary sources across UAE (Dubai Customs Notice 10/2025, Cabinet Resolution 119/2024, Bayanat.ae Open Data) and Saudi Arabia (ZATCA Ministerial Resolution 1447-88-5 and Decision 1447-88-7).
3. Evaluated legal frameworks and IP constraints: WCO 6-digit statutory nomenclature vs. proprietary Explanatory Notes; official public domain status under Saudi Copyright Law (Royal Decree M/41, Art. 4); Open Government License (OGL-UAE) on Bayanat.ae; and commercial redistribution prohibitions under WTO / ITC MacMap terms.
4. Documented the structure and transition from 6-digit WCO headings and 8-digit GCC Unified Customs Tariff lines to 12-digit national Integrated Customs Tariff schedules (13,449 lines in UAE; 19,104 lines in KSA).
5. Authored comprehensive research document `docs/research/res-03-hs-data.md` adhering strictly to facts discipline (VERIFIED / UNVERIFIED / ASSUMPTION labels, primary URLs, access dates).
6. Outlined data model interface (`CustomsTariffLine`), bundle size protection (< 3 MB uncompressed / ~500 KB gzipped, server-side lookup), and open decisions for the decision owner (dual-corridor launch vs single-market, update cadence pipeline, Arabic search depth).

## Verification & Next Steps
- Run repository gate verification: `CARD_RISK=R0 bash scripts/agent/gate.sh`.
- Commit changes (`docs/research/res-03-hs-data.md` and `.agent/notes.md`) and push branch `card/res-03-hs-data` to `origin HEAD`.
- Hand off task via `kanban_request_review(summary, reviewer="exvorta-reviewer", metadata)`.
