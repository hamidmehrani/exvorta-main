# Agent Notes — TOOL-5: Egypt ACI & KSA SABER Corridor Compliance Engine

- **Card:** `TOOL-5` (Task `t_99baf9e9`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R1`
- **Branch:** `card/tool-5-aci-saber`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_99baf9e9`

## Objectives & Scope
1. Implement pure TypeScript corridor compliance validation engine in `lib/tools/aci-saber.ts`:
   - Egypt ACI (Nafeza / CargoX): Sea freight mandate (1 Oct 2021, Decree 38/2021), Air freight mandate (1 Jan 2026), 19-digit ACID validation (marked provisional pending forwarder confirmation), Egyptian Importer Tax ID validation (9 digits), CargoX foreign exporter account requirements.
   - KSA SABER (SASO / FASAH): Regulated (PCoC 1-year validity with accredited CAB and ISO/IEC 17025 test report) vs Non-regulated (SDoC), mandatory SCoC for 100% of shipments linked to FASAH.
   - Readiness math (0-100 score, READY / AT_RISK / BLOCKED verdict) and state serialization for query string sharing.
2. Author comprehensive Vitest test suite in `lib/tools/aci-saber.test.ts`:
   - 17 unit tests verifying ACID format validation, Tax ID check, SABER certificate format check, item generation per corridor/mode/regulation, readiness score calculation, and URL state serialization/deserialization.
3. Build interactive UI in `app/(frontend)/tools/corridor-checker/`:
   - English route (`page.tsx`) & Client Component (`CorridorChecker.tsx`): Interactive corridor switcher, mode toggle (sea/air), product regulation selector, live identifier validators, filterable checklist with Ready/Pending/Missing toggles and consequence highlights, URL sharing, and A4 print stylesheet (`@media print`).
   - Arabic RTL mirror route (`ar/page.tsx`) & Client Component (`ar/CorridorCheckerAr.tsx`): Fully localized RTL view with Arabic typography, labels, statutory references, and print layout.
   - Redirect aliases: `app/(frontend)/tools/egypt-aci/page.tsx` and `app/(frontend)/tools/saber-compliance/page.tsx`.
   - Lead/Waitlist capture: Integration with `submitWaitlist` and `submitLead` permitted for `'Corridor-Checker'`.
4. Register static routes in `app/sitemap.ts` (`/tools/corridor-checker`, `/tools/corridor-checker/ar`).

## Verification Checklist
- [x] Orient worktree and confirm baseline dependencies (`bash scripts/agent/worktree-setup.sh`).
- [x] Implement core logic in `lib/tools/aci-saber.ts`.
- [x] Implement unit tests in `lib/tools/aci-saber.test.ts`.
- [x] Implement UI in `app/(frontend)/tools/corridor-checker/` (EN and AR).
- [x] Configure redirects `/tools/egypt-aci` and `/tools/saber-compliance`.
- [x] Update `app/sitemap.ts` and `__tests__/seo.test.ts`.
- [x] Run test suite: `pnpm test` (all 168 tests pass across repository).
- [x] Run TypeScript check: `pnpm exec tsc --noEmit` (0 errors).
- [x] Run linter: `pnpm lint` (0 errors).
- [x] Run factory gate: `CARD_RISK=R1 bash scripts/agent/gate.sh` -> `GATE OK`.
