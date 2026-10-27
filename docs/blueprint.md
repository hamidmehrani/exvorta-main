# Blueprint — Exvorta kanban factory
Owner: Manager (Lead Architect & QA). Workers never edit this file (gate forbids it on `card/*` branches).

## Authority (v3, 2026-10-27)
- The old MASTER-PLAN is **VOID** (owner: never reviewed it, AI-generated, no authority). Its one durable idea is kept:
  the Trade File as the core object, and honesty labels everywhere.
- **ADR-007 (owner, live decision 2026-10-27):** the FULL product is authorized for build NOW — the agency site
  (sales-ready) AND the SaaS modules **CRM / Docs / Intel / Track / Pay** — with all architectural decisions delegated
  to the manager. No phase gate blocks the SaaS.
- This file + the owner's live decisions are the only authority above a card.

## Goal
1. exvorta.com: production-ready, sales-ready (Mobbin-evolved design, free-tool funnel, real case studies).
2. Exvorta Suite (SaaS): the exporter operations platform — Trade File at the core, modules CRM, Docs, Intel, Track, Pay
   shipping incrementally on ONE stack.

## Constraints / interfaces
- Repo: `hamidmehrani/exvorta-main` (PUBLIC — nothing confidential committed). Server clone:
  `/home/azureuser/projects/exvorta` (deploy-key SSH origin). Board `exvorta` default workdir = that clone.
- Stack (ONE stack, no second backend — ADR-008): Next.js 15.4 App Router, Payload CMS 3.88 (Postgres/Neon + Drizzle),
  pnpm, Tailwind 4, Resend, Cloudinary, Turnstile.
- Design law: `design-system.md` + `Exvorta designs/` + Mobbin evolution for `DES-*` cards (ADR-005, citations mandatory).
- Factory: hermes kanban board `exvorta`, profiles `exvorta-{architect,builder,qa,researcher,reviewer}`; heavy code via
  `agy-pool` Antigravity; orchestrator roles never hand-write product code beyond a one-line fix.
- `main` == production (Vercel auto-deploys); only `scripts/agent/land.sh` moves main; Vercel's atomic build is the
  production build gate.
- Risk classes: R0 additive · R1 edits existing pages/components/SEO/content · R2 infra/config/CMS-schema/auth
  (`next.config.ts`, `payload.config.ts`, `vercel.json`, middleware, `.env.example`, `app/(payload)`, `app/api`,
  `app/(frontend)/login`, everything under `app/(app)`) — R2 needs owner-visible rationale, manager approves.

## ADR-008 — SaaS architecture (manager decision, 2026-10-27)
- **Modular monolith on the existing stack.** No Supabase, no second database, no second auth: Payload collections +
  Postgres (Neon) + Payload auth serve the SaaS. Rationale: one deploy, one vendor surface, the factory already masters
  this stack, and Postgres/Next stays cloud-agnostic (portability kept without extra vendors).
- **Tenancy:** `organizations` collection; every tenant-owned collection carries `organization` + Payload `access`
  functions enforcing membership; **cross-tenant leak tests (vitest) are mandatory for every tenant-scoped collection**
  and run in the gate.
- **App surface:** route group `app/(app)` (dashboard, workspace per Trade File) — separate from marketing `(frontend)`;
  Payload admin remains the ops back-office (role-gated).
- **Docs engine:** server-side bilingual PDF via headless Chromium (`@sparticuz/chromium` + `puppeteer-core` on Vercel
  functions) — the only renderer with correct Arabic shaping; pdf-lib stays banned.
- **Pay:** Stripe (owner is Dubai-based; RES-04 confirms UAE specifics) — subscription plans + Launchpad milestone
  invoices; no card data touches our servers.
- **Track/Intel:** external data via server routes with hard quotas + caching; deterministic checks first, LLM assist
  with human sign-off only.
- **Module order:** Docs (Trade File core) → CRM → Pay → Track → Intel. Each module = epic → spec cards (architect) →
  build cards (builder) → module QA gate.

## The card model (v3)
| Area | Cards | Purpose |
|------|-------|---------|
| GROUND/PLAT/DES/PG/TOOL/INS/CONV/AGY/RES/QA | ~99 active | site production+sales readiness (see v2 table — unchanged) |
| SaaS foundation | 9 | SAAS-EPIC + architecture decomposition, tenant model + leak tests, auth, app shell, Trade File, Docs engine, Stripe, tracking, notifications |
| Spec wave (unlocked) | 32 | the former triage specs are ACTIVE: architect fleshes them out and decomposes into build cards |
| LAUNCH | 2 | QA-4 presentation gate + runbook |

Dependency waves self-sequence the board. The SaaS foundation starts immediately and runs in parallel with the site
wave (per-profile caps keep the host healthy).

## Standing decisions
ADR-000 factory model · ADR-001 main=production/landing=deploying · ADR-002+005 design sources (+Mobbin) · ADR-003 public
repo hygiene · ADR-004 vitest · ADR-006 founder Dubai-based (sanctions contingency withdrawn) · ADR-007 full-product
build, gates voided · ADR-008 SaaS architecture (above).

## Live status (2026-10-27, v3)
- Wave A: GROUND-0, FACTS-0, PLAT-11, CONV-05 running; 123+ cards seeded; 0 blocked.
- Real case studies exist in-repo (`components/blocks/case-study-data.ts`: Stonvi, Spicevo, Nutave) — GROWTH-1/RES-05
  pointed at them.
- SaaS track opened: foundation cards + 32 unlocked spec cards; architects decompose into build cards as specs complete.
