---
name: exvorta-builder
description: Implement ONE Exvorta card in its git worktree — brief the Antigravity workers (agy-pool, gemini-3.8-flash-high) to write the code, then verify with the real gate (scripts/agent/gate.sh), push and hand off for review. Load for every implementation card.
---

# Exvorta builder protocol (orchestrator side)

You implement exactly ONE card. The rules of the whole repository are `AGENTS.md` (read it first, every time); the visual
law is `design-system.md` + `Exvorta designs/`; the card is your spec. Read the card (`kanban_show`) first and note its
**risk class** (R0 / R1 / R2) from the header line.

## Division of labour (factory ADR-000)
The only model family is **Gemini 3.8 Flash (High)**. **All heavy thinking and all code writing is done by the signed-in
Antigravity accounts through `agy-pool`**; you are the orchestrator: set up, brief, supervise, verify with the REAL gate,
push, hand off. Do not write product code yourself, at most a trivial fix (one line, a typo) after gate output.
`agy-pool` picks a free account, never runs two tasks on one account and rotates on quota errors; `agy-pool --status`
shows accounts, cooldowns and 24 h token use. There is no other model in the factory.

## Environment (Linux host, shared with the LeadGen sales machine and the Hamesu factory)
1. `cd "$HERMES_KANBAN_WORKSPACE"`: your private git worktree on branch `card/*` (`git branch --show-current` to confirm).
   Never work elsewhere. The profile terminal is ONE persistent shell: if you ever `cd` away, return at once. Before any
   multi-file write run `pwd` and require `…/.worktrees/<card-id>`.
2. First command: `bash scripts/agent/worktree-setup.sh` (installs pnpm deps on first use — the store is shared, first run
   is slow, keep heartbeats going). It refuses to continue when the checkout contains a secret-shaped file: then
   `kanban_block(kind="needs_input", reason="clean-clone check failed: <names only>")` and stop.
3. In EVERY shell: `source scripts/agent/env.sh`, then `export CARD_RISK=<R0|R1|R2>` (from the card header).
4. **You never touch production:** no Vercel, no Neon, no Resend, no Cloudinary, no `pnpm db:up`/docker, no `/opt/leadgen`,
   no other `~/projects/*` checkout, no ssh, no sudo, no systemctl. The repo is PUBLIC — you never commit a credential,
   a client file or anything confidential (the gate also checks). Tests are local and side-effect-free; nothing in a card
   calls a real external service.
5. **Memory is shared (~16 GB for three workloads):** one Node process at a time, `NODE_OPTIONS` is capped by env.sh,
   NO dev server and NO watcher ever (`pnpm dev` is not part of any card), kill every process you started before you
   finish. Long steps (tsc, install) run with output to `.agent/<name>.log`; poll and call `kanban_heartbeat`.

## Workflow
1. `kanban_comment` a short plan (what you will brief, which files, test strategy, risks).
2. **UI card? Get the design spec first.** The design source is the repo itself: `Exvorta designs/<page>/` (`code.html`
   ported 1:1, `screen.png` as the acceptance test) and `design-system.md` (tokens, primitives, type scale). New pages
   that have no design folder yet follow `design-system.md` primitives and the closest existing page's structure
   (see `app/(frontend)/`), and you mark every invented-free choice as "new state, per design-system" in your summary.
3. Brief the worker per file with the card's scope for that file (one file per round where possible); apply its diffs with
   `git apply --recount`, and after every apply run the relevant check (`pnpm exec vitest run <file>`, `pnpm exec tsc
   --noEmit`) before continuing.
4. Unit tests first for pure logic (engines live in `lib/tools/`, vitest). One file per run — never a watch mode.
5. Run `CARD_RISK=<risk> bash scripts/agent/gate.sh` until it ends with `GATE OK`.
6. Push your branch: `git push -u origin HEAD` (card branches only — main is untouchable).
7. Hand off: `kanban_request_review(summary, reviewer="exvorta-reviewer", metadata)` — summary ends with a `Not verified:`
   line; honest labels: VERIFIED / UNVERIFIED / ASSUMPTION. Nothing about deploys: the reviewer lands.

## If you are blocked
`kanban_block(kind="needs_input", reason="…")` with the exact missing decision (design gap, R2 change, regulatory fact).
Never guess an owner decision, never reopen a locked decision, never widen the card's scope.
