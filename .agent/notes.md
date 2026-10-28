# Agent Notes — TOOL-1: Incoterm & CBM calculator (/tools/incoterm-cbm)

- **Card:** `TOOL-1` (Task `t_f10ca839`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R0`
- **Branch:** `card/tool-1-incoterm-cbm`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_f10ca839`

## Objectives & Scope
1. **Pure TS Engine (`lib/tools/incoterm-cbm.ts`):**
   - 11 Incoterms 2020 responsibility matrix (EXW, FCA, CPT, CIP, DAP, DPU, DDP, FAS, FOB, CFR, CIF).
   - CBM math (pieces × L × W × H with cm/in unit toggle).
   - kg ↔ CBM volume estimation and volumetric/chargeable weight calculations (air, sea LCL, courier).
   - Container-fit estimator with 20', 40', 40HC usable CBM constants labeled with an "indicative, not a quote" comment.
   - URL query parameter state serialization and deserialization helpers.
   - Purity guarantee per `docs/CONTRACTS.md`: 100% pure TypeScript, zero React/DOM imports, zero network calls, zero side effects.
2. **Unit Tests (`lib/tools/incoterm-cbm.test.ts`):**
   - Comprehensive Vitest unit test suite covering matrix integrity, calculation accuracy, unit conversions, container fit edge cases, and query param roundtripping (28/28 tests passing).
3. **Frontend Route (`app/(frontend)/tools/incoterm-cbm/page.tsx`):**
   - Interactive client-side calculator adhering to `design-system.md` tokens and primitives ("new state, per design-system").
   - Preserves shared global Header and Footer; zero network requests during user interaction.
   - Lead capture CTA reusing existing waitlist/contact action patterns.
4. **Sitemap Integration (`app/sitemap.ts`):**
   - Add `/tools/incoterm-cbm` to static marketing routes.

## Verification Checklist
- [x] Merged upstream `origin/main` containing PLAT-01 Vitest harness (commit `da9da7e`).
- [x] Initial baseline gate verification clean (`CARD_RISK=R0 bash scripts/agent/gate.sh` -> GATE OK).
- [x] Brief Antigravity worker via `agy-pool` for `lib/tools/incoterm-cbm.ts` and `lib/tools/incoterm-cbm.test.ts`.
- [x] Execute engine unit tests via `pnpm exec vitest run lib/tools/incoterm-cbm.test.ts` (28/28 PASSED).
- [ ] Brief Antigravity worker for `app/(frontend)/tools/incoterm-cbm/page.tsx` and sitemap entry.
- [ ] Execute `CARD_RISK=R0 bash scripts/agent/gate.sh` until GATE OK.
- [ ] Push branch `card/tool-1-incoterm-cbm` and hand off via `kanban_request_review`.