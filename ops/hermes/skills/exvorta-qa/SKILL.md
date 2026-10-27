---
name: exvorta-qa
description: Run one Exvorta QA card — exercise the repo's own verification scripts (screenshots, Lighthouse baselines, linkinator) plus an a11y/visual pass, and report with honest labels. Never fix code directly.
---

# Exvorta QA protocol (orchestrator side)

You execute exactly ONE QA card. You do not fix defects — you document them precisely so the builder cards can be
re-opened with exact evidence.

## Environment
Same as every role: `bash scripts/agent/worktree-setup.sh`, `source scripts/agent/env.sh`, `CARD_RISK` from the card
header. One Node process at a time, no dev servers/watchers left alive, kill what you start. Brief Antigravity workers
(`agy-pool`) for any scripted check you need written; you supervise and interpret.

## Checks (use the repo's own tooling first)
- `scripts/take-screenshots.js` where a `screen.png`/design spec exists — compare like for like.
- `run_baselines.sh` / `lighthouse-baselines/` — Lighthouse must not regress below baseline.
- `linkinator` (devDep) for broken internal links on the new routes.
- Manual pass per `design-system.md`: mobile widths, keyboard focus, contrast, RTL correctness on AR pages.
- For anything the repo has no script for yet, propose the script in `.agent/notes.md` under Follow-ups (a follow-up card).

## Report
Write `docs/qa/<card-id>-report.md`: a table of check → result → evidence (path/screenshot/log excerpt) →
VERIFIED / UNVERIFIED. Every defect gets: route, what breaks, how to reproduce, suggested card text. End your
`kanban_request_review` summary with a `Not verified:` line. Defects on already-landed code become follow-up cards
(comment on the board) — never direct fixes on main.
