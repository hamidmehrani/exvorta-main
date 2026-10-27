# Blueprint — Exvorta kanban factory
Owner: Manager (Lead Architect & QA). Workers never edit this file (gate forbids it on `card/*` branches).
Update before every delegation wave.

## Goal
Ship Phase 0 of Exvorta (exvorta.com — live agency site, Next.js 15 + Payload 3): free client-side lead-gen
tools, RFQ cart widget as a standard agency deliverable, case studies, and the Phase 0.5 entity decision —
so the Phase 0 gate (1–2 paying Exvorta Web clients, $1,500–$3,000 collected) can be met.
Phase 1+ (SaaS) is specified but NOT built until the gate is met (MASTER-PLAN §4 contract).

## Constraints / interfaces
- Repo: `hamidmehrani/exvorta-main` (PUBLIC — nothing confidential may be committed).
- Stack: Next.js 15.4 App Router, Payload CMS 3.88 (Postgres/Neon + Drizzle), pnpm, Tailwind 4, Resend, Cloudinary.
- Design system: `design-system.md` + `Exvorta designs/<page>/` (`code.html` = visual spec, `screen.png` = acceptance test).
  Header/Footer shared. Animations only via Reveal / existing animation components.
- Factory: hermes kanban board `exvorta`, profiles `exvorta-{architect,builder,qa,researcher,reviewer}`,
  heavy code written by Antigravity accounts via `agy-pool` (worker role = orchestrator).
- `main` == production: Vercel auto-deploys every landed commit. Only `scripts/agent/land.sh` (reviewer) moves main.
- Vercel's atomic build is the production build gate; the local gate (`scripts/agent/gate.sh`) covers scope, secrets,
  types, lint, unit tests.
- Risk classes: **R0** additive (new route/tool/component/docs) · **R1** edits existing pages/components/SEO/content ·
  **R2** infra/config/CMS-schema/auth (`next.config.ts`, `payload.config.ts`, `vercel.json`, middleware, `.env.example`,
  `app/(payload)`, `app/api`, `app/(frontend)/login`) — R2 requires owner sign-off via `needs_input`.

## Tasks — Wave A (Phase 0)
| ID | Task | Assignee | Deps | Acceptance criteria | Status |
|----|------|----------|------|---------------------|--------|
| GROUND-0 | Repo ground-truth audit → `docs/CONTRACTS.md` (route/primitive inventory + card conventions) + `docs/VERIFICATION.md` (what each verify script proves) | exvorta-architect | — | Docs exist; gate `GATE OK`; contract lists every `(frontend)` route + shared primitives | ready |
| TOOL-1 | Incoterm & CBM calculator `/tools/incoterm-cbm`: 11 Incoterms responsibility matrix, CBM math (L×W×H×qty, cm/in), container fit (20′/40′/40HC), URL-share; pure-TS engine in `lib/tools/` + vitest unit tests (add vitest devDep) | exvorta-builder | GROUND-0 | vitest suite green; tsc+lint clean (gate); client-side only (no fetch on interaction); renders in tokens/primitives | todo |
| TOOL-1B | Calculator AR/RTL mirror page + SEO pack (meta, OG, sitemap, hreflang) + "Issued via Exvorta" CTA | exvorta-builder | TOOL-1 | AR page RTL-correct (logical properties); sitemap/hreflang valid; gate OK | todo |
| FACTS-0 | Regulatory fact-pack for free tools #3–5 (GCC HS 12-digit status, Egypt ACI/ACID, KSA SABER, UAE PINT-AE e-invoicing timeline, CBAM scope) in `docs/research/regulatory-facts.md` | exvorta-researcher | — | Every fact labeled VERIFIED (primary source + link + date) / UNVERIFIED / ASSUMPTION; no code | ready |
| TOOL-2 | Bilingual invoice / packing list / CMR generator `/tools/docs-generator` (print-CSS A4, browser print-to-PDF, EN/AR); email capture reuses the EXISTING waitlist/contact server action — no second send path | exvorta-builder | GROUND-0 | A4 print CSS both langs (AR RTL correct); capture posts through the existing action; gate OK | todo |
| TOOL-3 | RFQ Cart widget as standard deliverable: embeddable `/rfq/embed` (iframe-friendly, postMessage resize) on top of the existing `/rfq` flow, catalog from `public/rfq-catalogs/*.json`; embed docs page | exvorta-builder | GROUND-0 | `/rfq` behavior unchanged (verified); embed route standalone; docs page with snippet; gate OK | todo |
| GROWTH-1 | 2 case studies via the existing portfolio collection + `/launchpad` offer page (Digital Exporter Launchpad) per design specs | exvorta-builder | GROUND-0 | No Payload schema change (R2); pages render; content placeholders marked; gate OK | todo |
| QA-0 | QA sweep of all tools with the repo's own scripts (`scripts/take-screenshots.js`, `run_baselines.sh`, linkinator) → `docs/qa/qa-0-report.md` | exvorta-qa | TOOL-1B, TOOL-2, TOOL-3, GROWTH-1 | Report with VERIFIED/UNVERIFIED per check; no baseline regressions; defects filed as follow-up cards | todo |
| ENTITY-0 | Phase 0.5 decision memo `docs/research/entity-decision.md`: UAE free zone vs Turkey (formation, banking/sarraf compatibility, timeline, sanctions-exposure) | exvorta-researcher | — | Recommendation + open questions; every claim sourced+dated; no code | ready |

## Parked (triage — specifier fleshes out only when Phase 0 gate nears)
P1-GOLDEN (10 real doc packs, consent + anonymization) · P1-SCHEMA (Trade File schema, Supabase+RLS) ·
P1-ENGINE (deterministic corridor rule engine) · P1-DOCS8 (8 bilingual docs + QR) · P1-DEPOSIT (deposit & VAT-exit tracker) ·
P1-RLS (cross-tenant leak-test CI) · P1-LAUNCHPAD (Launchpad delivery pipeline) ·
PHASE-1B epic (PINT-AE ASP connector, LC pre-audit MT700, BL diff) · PHASE-2 epic (tracking, deal room) ·
PHASE-3 epic (CRM, HS classifier, CBAM, sanctions, P&L).
**Gate rule: no Phase-1 card is promoted to ready before the Phase-0 gate is met.**

## Decisions log
- **ADR-000 (2026-10-27):** Factory model = hermes kanban board `exvorta` + `exvorta-*` profiles; all heavy code via
  Antigravity (`agy-pool`, gemini-3.8-flash-high); orchestrator roles never hand-write product code beyond a one-line fix.
- **ADR-001 (2026-10-27):** `main` = production (Vercel auto-deploy). Landing is deploying. Vercel's atomic build is the
  production build gate; no local production build in the factory (needs secrets we must not hold).
- **ADR-002 (2026-10-27):** Design source = `design-system.md` + `Exvorta designs/` (`code.html`, `screen.png`). No Mobbin,
  no invented screens; port 1:1.
- **ADR-003 (2026-10-27):** Repo is public → MASTER-PLAN stays out of git; `docs/blueprint.md` carries the sanitized
  working plan; pricing/strategy details live only in the card text where the owner put them.
- **PENDING ADR-004 (proposed by GROUND-0):** adopt vitest as the unit-test runner (repo currently ships `__tests__/setup.ts`
  with no runner installed).

## Live status (2026-10-27)
- Board `exvorta` created on aws-hamesu; repo cloned at `/home/azureuser/projects/exvorta`; factory scripts + skills landed
  via `factory-bootstrap`; Wave A seeded (9 cards: 3 ready, 5 todo with dependencies, 1 QA gate card).
