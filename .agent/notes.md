# Agent Notes — SAAS-0: Exvorta Suite SaaS build graph decomposition

- **Card:** `SAAS-0` (Task `t_5277cc94`)
- **Assignee:** `exvorta-architect`
- **Risk Level:** `R0`
- **Branch:** `card/saas-0-build-graph`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_5277cc94`

## Build Graph Architecture & Dependency Wiring
1. **Foundation Decomposed (ADR-007 / ADR-008):**
   - Modular monolith on existing Next.js 15.4 App Router + Payload CMS 3.88 + Neon Postgres stack.
   - Tenancy isolation via `organizations` collection and mandatory Vitest cross-tenant leak tests.
2. **Card Boundaries & Execution Order:**
   - `SAAS-1` (t_842434ec, R2, todo): Tenant model (organizations, membership roles, leak tests). Parent: t_5277cc94. Actionable on land.
   - `SAAS-2` (t_a29fe334, R2, todo): SaaS auth (login/register/invite, Turnstile). Parent: t_5277cc94. Actionable on land.
   - `SAAS-3` (t_b7e70702, R0, todo): App shell (app/(app) layout, nav, tokens). Parent: t_5277cc94. Actionable on land.
   - `SAAS-4` (t_b7e59ea7, R2, todo): Trade File core (state machine, vitest). Parents: t_5277cc94, t_842434ec (SAAS-1).
   - `SAAS-5` (t_579e43a9, R1, todo): Docs engine (headless Chromium, Quote template). Parents: t_5277cc94, t_b7e59ea7 (SAAS-4).
   - `SAAS-6` (t_0052eb73, R2, todo): Stripe pay & billing. Parents: t_5277cc94, t_eef1da06 (RES-04 blocked on UAE license).
   - `SAAS-7` (t_63c1fa51, R1, todo): Tracking quotas & integration. Parents: t_5277cc94, t_b7e59ea7 (SAAS-4), t_d5a9e103 (P1-TRACK-01).
   - `SAAS-8` (t_6a0f95c6, R1, todo): Resend transactional notifications. Parents: t_5277cc94, t_a29fe334 (SAAS-2).
3. **Verification:**
   - Exactly the first three foundation cards (`SAAS-1`, `SAAS-2`, `SAAS-3`) promote to ready when `t_5277cc94` lands.
   - All subsequent cards strictly gated behind internal and external prerequisites.
