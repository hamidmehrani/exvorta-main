<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## REBUILD RULES
- `code.html` files are the visual spec — port 1:1, never redesign
- `screen.png` is the acceptance test
- Header and Footer are shared — never rebuild per page
- Use tokens and primitives only — no raw hex, no ad-hoc font classes anywhere
- One page per session
- After each page, run `scripts/take-screenshots.js` and compare to matching `screen.png` before finishing
- Animations via Reveal component OR custom animation components (AnimatedHeadline, SectionReveal, MagneticButton). No regex/patch scripts ever.

## Kanban factory (aws-hamesu board `exvorta`)
- Work happens on `card/*` branches in git worktrees driven by the hermes kanban dispatcher (profiles
  `exvorta-{architect,builder,qa,researcher,reviewer}`; all heavy code is written by the Antigravity accounts via
  `agy-pool` — orchestrator roles never hand-write product code beyond a one-line fix, ADR-000 in `docs/blueprint.md`).
- FIRST command in a card worktree: `bash scripts/agent/worktree-setup.sh`; then `source scripts/agent/env.sh` in every
  shell and `export CARD_RISK=<R0|R1|R2>` from the card header.
- A card is done when `CARD_RISK=<risk> bash scripts/agent/gate.sh` prints `GATE OK`, the branch is pushed
  (`git push -u origin HEAD`), and hand-off happened via `kanban_request_review` to `exvorta-reviewer`.
- Only `scripts/agent/land.sh` (reviewer-only) moves `main`. **main == production: Vercel auto-deploys every landed
  commit** (ADR-001). No direct pushes to main, ever.
- Risk classes: **R0** additive (new route/tool/component/docs) · **R1** edits existing pages/components/SEO/content ·
  **R2** infra/config/CMS-schema/auth (`next.config.ts`, `payload.config.ts`, `vercel.json`, middleware, `.env.example`,
  `app/(payload)`, `app/api`, `app/(frontend)/login`) — R2 needs owner sign-off via `needs_input`.
- **This repo is PUBLIC:** never commit credentials, client material, or confidential strategy; the factory clone never
  holds a real `.env` (worktree-setup refuses one).
- The host is shared (LeadGen sales machine + Hamesu factory): one Node process at a time, no dev servers or watchers
  left running, kill what you start.
