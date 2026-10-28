# Agent Notes — PLAT-08: 404/500 + empty/error states per design system

- **Card:** `PLAT-08` (Task `t_9e3df552`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R1`
- **Branch:** `card/plat-08-error-states`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_9e3df552`

## Objectives & Scope
1. **404 Not Found (`app/(frontend)/not-found.tsx`):**
   - Polish per `design-system.md` (blueprint grid backdrop, frame border, obsidian/muted typography).
   - Navigation links to `/tools`, `/contact`, and home (`/`).
   - Quick action / search CTA.
   - Accessible metadata and structured hierarchy.
2. **500 Error Boundary (`app/(frontend)/error.tsx`):**
   - Polish per `design-system.md` with system fault code 500 eyebrow.
   - Interactive recovery button (`reset()`) and contact link (`ops@exvorta.com`).
   - Accessible semantic markup and consistent styling.
3. **Empty States in Listings:**
   - `components/blocks/PortfolioArchiveBlock.tsx` & `components/blocks/PortfolioArchiveLayout.tsx`:
     Accessible empty state when `projects.length === 0` (Playfair serif headline, mono label, CTA to explore tools/contact).
   - `components/blocks/InsightsArchive.tsx`:
     Explicit empty state when `posts.length === 0` (replaces indefinite skeleton loader).
4. **Consistency & Verification:**
   - Consistent English messaging across all error and empty states.
   - Zero visual regressions on home and active routes.
   - TypeScript check (`pnpm exec tsc --noEmit`) and linter (`pnpm lint`).
   - Repository gate verification (`CARD_RISK=R1 bash scripts/agent/gate.sh`).

## Verification Checklist
- [x] Initial plan commented on card thread (comment #60).
- [x] Baseline gate verification (`CARD_RISK=R1 bash scripts/agent/gate.sh` -> GATE OK).
- [ ] Brief Antigravity worker via `agy-pool` for `not-found.tsx` and `error.tsx`.
- [ ] Brief Antigravity worker via `agy-pool` for archive empty states.
- [ ] Verify TypeScript and linting (`pnpm exec tsc --noEmit && pnpm lint`).
- [ ] Execute `CARD_RISK=R1 bash scripts/agent/gate.sh` until GATE OK.
- [ ] Push branch `card/plat-08-error-states` and hand off via `kanban_request_review`.
