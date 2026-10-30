# Agent Notes — PLAT-05: Performance pass: fonts, images, budgets

- **Card:** `PLAT-05` (Task `t_95d07e32`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R0`
- **Branch:** `card/plat-05-perf`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_95d07e32`

## Scope (Owner Decision)
- Scope is strictly performance optimizations:
  1. Self-host local Vazirmatn font (`public/fonts/Vazirmatn-Variable.woff2`) via `next/font/local` in `app/(frontend)/layout.tsx` / `app/globals.css`.
  2. Optimize image rendering via `next/image` with explicit `sizes` across components to eliminate layout shifts and warnings.
  3. Document performance budgets (LCP/CLS) in `docs/CONTRACTS.md`.
- Vitest, Sentry, Umami, and SEO tasks are excluded from this card.

## Status & Progress
- Font asset downloaded to `public/fonts/Vazirmatn-Variable.woff2`.
- Worktree rebased onto origin/main to clear divergence false positives.
- Resolving merge conflicts in `.agent/notes.md` and `docs/CONTRACTS.md`.
