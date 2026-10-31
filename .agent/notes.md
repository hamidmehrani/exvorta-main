# Agent Notes — DES-06: Mobbin design pass: tools hub

- **Card:** `DES-06` (Task `t_d58cc346`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R1`
- **Branch:** `card/des06-design`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_d58cc346`

## Objectives & Scope
1. Transform `/tools` into an institutional developer showroom with high visual density, spec metadata, and trust architecture.
2. Adopted Mobbin references recorded in `docs/design-refs/t_d58cc346.json`:
   - Tool showroom / catalog cards (enterprise developer/tool hub cards)
   - Trust / "Why free" philosophy architecture
   - Lead-gen email capture band (`ToolsWaitlistBand`)
3. Reviewer Rework (Attempt 2 changes_requested fix):
   - Fixed dead links in `app/(frontend)/tools/page.tsx` crawler discovery block.
   - Replaced dead routes (`/tools/freight-density` and `/tools/incoterms-matrix`) with real, verified routes (`/tools/incoterm-cbm`, `/tools/docs-generator`, `/tools/uae-einvoicing`).

## Verification Checklist
- [x] Run worktree setup (`bash scripts/agent/worktree-setup.sh`).
- [x] Fixed crawler discovery hrefs in `app/(frontend)/tools/page.tsx`.
- [x] Unit tests passing (`pnpm exec vitest run` -> 15 test files, 198 passed).
- [x] TypeScript compiler clean (`pnpm exec tsc --noEmit` -> 0 errors).
- [x] ESLint clean (`pnpm lint` -> 0 errors).
- [x] Factory gate passes (`CARD_RISK=R1 bash scripts/agent/gate.sh` -> GATE OK).
