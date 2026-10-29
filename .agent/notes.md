# Agent Notes — PLAT-02: Sentry wiring, DSN, error boundary, release tagging

- **Card:** `PLAT-02` (Task `t_b51690ce`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R0` (effective risk confirmed by owner: monitoring/SDK only, no infra changes)
- **Branch:** `card/plat-02-sentry`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_b51690ce`

## Requirements & Scope
1. Sentry error monitoring layer with optional DSN via `SENTRY_DSN` env var (inactive when unset, non-blocking).
2. Git SHA release tagging in Sentry envelope payload (`process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || 'development'`).
3. Connect `reportError` in `app/(frontend)/error.tsx`.
4. Create `app/global-error.tsx` (root error boundary for App Router).
5. Unit tests with Vitest verifying envelope dispatch and graceful no-op when `SENTRY_DSN` is unset.
6. Zero paid SaaS or self-hosted dependencies; keep Vitest test runner.

## Progress & Completed Actions
- [x] Initialized card context and confirmed owner unblock instructions (R0 risk, no paid SaaS, Vitest test runner).
- [x] Verified existing worktree environment, pnpm dependencies, and vitest baseline (5 tests passing).
- [x] Inspected `lib/error-reporting.ts`, `app/(frontend)/error.tsx`, and `docs/sentry-setup.md`.
- [x] Prepared worker brief in `.agent/brief-plat-02.md` for `agy-pool` dispatch.

## Next Steps
- Dispatch worker turn via `agy-pool` to implement release tagging in `lib/error-reporting.ts`, `app/(frontend)/error.tsx`, `app/global-error.tsx`, and vitest unit tests in `__tests__/error-reporting.test.ts`.
- Run vitest and gate: `CARD_RISK=R0 bash scripts/agent/gate.sh`.
- Push branch and hand off via `kanban_request_review`.
