# Blueprint — Exvorta kanban factory
Owner: Manager (Lead Architect & QA). Workers never edit this file (gate forbids it on `card/*` branches).
Update before every delegation wave.

## Goal
Make exvorta.com **production-ready and sales-ready**: harden the platform, evolve the design with Mobbin references,
ship the free-tool funnel, sales content and conversion flows — so the Phase-0 gate (1–2 paying Exvorta Web clients,
$1,500–$3,000 collected) can be met. Phase 1+ (SaaS) is specified but NOT built until the gate is met.

## Constraints / interfaces
- Repo: `hamidmehrani/exvorta-main` (PUBLIC — nothing confidential may be committed).
- Stack: Next.js 15.4 App Router, Payload CMS 3.88 (Postgres/Neon + Drizzle), pnpm, Tailwind 4, Resend, Cloudinary.
- Design law: `design-system.md` + `Exvorta designs/<page>/` (`code.html` = spec, `screen.png` = acceptance) —
  **amended by ADR-005: `DES-*` cards additionally evolve the design from Mobbin references via the judged `mobbin-ref`
  loop with mandatory citations**. Header/Footer shared. Animations only via existing components.
- Factory: hermes kanban board `exvorta`, profiles `exvorta-{architect,builder,qa,researcher,reviewer}`,
  heavy code written by Antigravity accounts via `agy-pool` (orchestrator roles never hand-write product code).
- `main` == production: Vercel auto-deploys every landed commit. Only `scripts/agent/land.sh` (reviewer) moves main.
- Vercel's atomic build is the production build gate; the local gate (`scripts/agent/gate.sh`) covers scope, secrets,
  types, lint, unit tests.
- Risk classes: **R0** additive · **R1** edits existing pages/components/SEO/content · **R2** infra/config/CMS-schema/auth
  (`next.config.ts`, `payload.config.ts`, `vercel.json`, middleware, `.env.example`, `app/(payload)`, `app/api`,
  `app/(frontend)/login`) — R2 requires owner sign-off via `needs_input`.

## The 100+ card model (9 areas + phase gates)
| Area | Cards | Purpose | Entry rule |
|------|-------|---------|-----------|
| GROUND | 1 | repo ground-truth audit → contracts/verification docs | running |
| PLAT | 13 | production-readiness: vitest, Sentry, Umami, SEO-tech, perf, a11y, headers, 404/500, E2E, consent, backups, AR architecture, uptime | todo → auto after GROUND-0 |
| DES | 12 | Mobbin-driven design passes per page/section (citations mandatory) | todo → auto after GROUND-0 (+page parents where new) |
| PG | 8 | sales pages: pricing, about, services ×3, FAQ, partner program, contact upgrade | todo → auto after GROUND-0 |
| TOOL | 7+4 | free-tool funnel: calculator (running), docgen, RFQ widget, HS converter, ACI/SABER checker, e-inv assessment, hub, share/analytics | TOOL-1..3 running wave; TOOL-4..6 wait for FACTS-0 |
| INS | 12 | editorial system + keyword map + 10 SEO articles (EN, AR later) | articles wait for keyword map |
| CONV | 10 | WhatsApp CTA, Turnstile, Resend flows, concierge onboarding, social proof, legal pack, lead magnet, newsletter | todo → auto after GROUND-0 |
| AGY | 6 | productized agency delivery: onboarding/deploy runbooks, proposal template, catalog builder, boilerplate spec | runbooks ready now |
| RES | 5 | competitors, keywords, HS dataset provenance, payment rails, portfolio evidence | ready now |
| QA | 4 | batch gates: QA-0 (tools wave), QA-1 (tools 4–6), QA-2 (pages), QA-3 (conversion) | wait for their batch |
| P1/EP | 21+3 | Phase-1 SaaS specs (8 docs, auth, import, QR, deal room, tracking, e-invoicing, LC audit, BL diff, CRM, HS, CBAM, P&L, funnel) + 3 phase epics | **triage — locked behind the Phase-0 gate** |

Total ≈ 116 cards. Dependency waves let the dispatcher self-sequence: parents complete → children auto-promote.

## Standing decisions
- **ADR-000:** factory model (hermes kanban + exvorta-* profiles + agy-pool Antigravity; orchestrators never hand-write code).
- **ADR-001:** `main` = production (Vercel auto-deploy). Landing is deploying. No local production build in the factory.
- **ADR-002 (amended by ADR-005):** design source = repo designs + design-system.md; `DES-*` cards add Mobbin references
  with `mobbin-ref cite` (`.design-refs/` never committed, gate enforces).
- **ADR-003:** repo is public → master-plan strategy/pricing docs stay out of git; this blueprint is the sanitized plan.
- **ADR-004 (pending, proposed):** adopt vitest as the unit-test runner (PLAT-01 owns the setup; TOOL-1 depends on it).
- **ADR-006 (owner, 2026-10-27):** the founder is Dubai-based; the sanctions/entity contingency work is withdrawn
  (ENTITY-0 archived). Standard payment rails are back on the table (RES-04 picks the gateway for Phase-1).

## Live status (2026-10-27, batch 2)
- Wave A dispatched: GROUND-0 + FACTS-0 running; TOOL-1..3 + GROWTH-1 chained behind GROUND-0; QA-0 behind the batch.
- Batch 2 seeded (~97 cards) across PLAT/DES/PG/TOOL/INS/CONV/AGY/RES/QA; Phase-1 specs parked in triage.
- Mobbin amendment (ADR-005) landed in the factory rules; `mobbin-ref` verified working on the host.
