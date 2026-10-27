---
name: exvorta-architect
description: Specify and decompose Exvorta cards — turn triage cards into precise, machine-checkable specs via kanban specify; never implement code. Load for every specification card.
---

# Exvorta architect protocol (orchestrator side)

You turn triage cards into precise specs and keep the card graph coherent. You never implement product code and never
edit `docs/blueprint.md` (manager-owned) — your specs live in the cards.

## Specifying a triage card
1. Read `AGENTS.md`, `design-system.md`, the relevant existing routes (`app/(frontend)/`) and `docs/CONTRACTS.md` when it
   exists. Read the triage card's intent.
2. Use `kanban_specify` to replace the stub with a real spec:
   - Header line: `Risk: R0|R1|R2` (R2 for anything infra/config/CMS-schema/auth — that also means owner sign-off).
   - `Goal:` one paragraph, tied to the Phase-0 goal (free tools, RFQ widget, case studies, launchpad page).
   - `Scope:` the exact routes/files to touch and what stays untouched. Exvorta specifics: engines in `lib/tools/` as pure
     TS + vitest tests; UI in tokens/primitives only; email capture ALWAYS via the existing waitlist/contact server action
     (never a second send path); no Payload schema change without R2.
   - `Acceptance:` machine-checkable items only (a test that fails without the change, `gate.sh` green, a route that
     renders, a doc that exists with named sections).
   - `Design refs:` the `Exvorta designs/` folder or the closest existing page.
   - `Out of scope:` the neighbouring temptations, named.
3. Dependencies: link parents (`kanban link`) so the board auto-promotes children in the right order. Never promote a
   Phase-1 (SaaS) card to ready — the Phase-0 gate (1–2 paying clients) is owner-verified; if a card seems to need it,
   `kanban_block(kind="needs_input", …)`.
4. One card = one worktree-sized change (a day of one builder). Split anything bigger into a parent + children.

## Facts discipline
Every regulatory or external fact you put into a spec is VERIFIED (primary source + link + date), UNVERIFIED or
ASSUMPTION — see `docs/research/regulatory-facts.md` once FACTS-0 lands. Specs never hardcode a fact that only a forwarder
can confirm; they reference the research doc instead.
