# Agent Notes — PLAT-07: Security headers + embed framing policy

- **Card:** `PLAT-07` (Task `t_2a9122fc`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R2`
- **Branch:** `card/plat-07-headers`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_2a9122fc`

## Objectives & Scope
1. **Security Headers in `next.config.ts`:**
   - Enforce baseline security headers on `/(.*)`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security`.
   - Dedicated embed framing rule for `/rfq/embed` and `/rfq/embed/(.*)`: permissive `frame-ancestors *` and no `X-Frame-Options: SAMEORIGIN` block so client websites can iframe the RFQ widget.
   - Retain Payload admin header scoping and asset cache headers.
2. **Preserve Dynamic Security.txt:**
   - Dynamic Route Handler at `app/.well-known/security.txt/route.ts` remains intact with `text/plain; charset=utf-8`.
3. **Vitest Unit Tests (`__tests__/headers.test.ts`):**
   - Validate header rules for general routes and `/rfq/embed` framing.
   - Validate Route Handler `GET()` response status and headers.

## Verification Checklist
- [x] Initial worktree setup and dependencies verified (`bash scripts/agent/worktree-setup.sh`).
- [x] Inspected existing `next.config.ts` headers, `security.txt`, and test conventions.
- [x] Plan comment #56 posted to task `t_2a9122fc`.
- [x] Brief Antigravity worker via `agy-pool` for `next.config.ts` and `__tests__/headers.test.ts`.
- [ ] Verify test suite passes (`pnpm exec vitest run __tests__/headers.test.ts`).
- [ ] Run full gate check (`CARD_RISK=R2 bash scripts/agent/gate.sh`) until `GATE OK`.
- [ ] Push branch `card/plat-07-headers` and hand off via `kanban_request_review`.
