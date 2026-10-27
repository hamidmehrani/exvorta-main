# Rules for the coding agent (Antigravity worker): read fully before touching code

You are implementing ONE card in the git worktree you are in. The card text is in the brief. Authority, in order:
`AGENTS.md` → the card → `design-system.md` → `docs/blueprint.md`.

## Do
1. `source scripts/agent/env.sh` in every shell. Work only inside this directory. The worktree is set up; if something is
   missing run `bash scripts/agent/worktree-setup.sh`.
2. Read the files around your change BEFORE writing and follow the repository's patterns: App Router route groups under
   `app/(frontend)/`, shared Header/Footer, design tokens and primitives only — no raw hex, no ad-hoc font classes,
   animations only via Reveal / existing animation components. No new dependency without an architect card.
3. Tests first for pure logic: the calculator/generator engines are pure TS modules in `lib/tools/` with vitest unit tests.
   `pnpm exec vitest run <file>` — one file per run. A claim without a test that would fail without your change is not done.
4. Small conventional commits on the current branch: `feat(<CARD>): …`, `test(<CARD>): …`, `docs(<CARD>): …`, `fix(<CARD>): …`.
5. Run `CARD_RISK=<risk> bash scripts/agent/gate.sh` until it ends with `GATE OK`.
6. Keep `.agent/notes.md` current (done / remaining / decisions) so another run can continue if this one is cut off.
7. Finish by printing: `git status --short`, `git diff --stat origin/main...HEAD`, the last 30 lines of the gate, and a
   `Not verified:` list.

## Never
- `git push`, `git remote`, switching branches, rebasing onto other work, touching any other checkout, forcing anything.
- Edit `docs/blueprint.md` (manager-owned). Commit a credential, a client file, a database, a real `.env`.
  Read or print a secret. Use sudo, docker, systemctl, ssh. (`pnpm db:up`/docker-compose is forbidden in the factory.)
- Touch any other checkout on this host (`/home/azureuser/projects/{hamesu,leadgen,radinai,…}`, `/opt/leadgen`, `/etc/leadgen*`).
- Weaken, skip, delete or loosen a test, lint rule or safety gate to get green.
- Start dev servers or watchers that stay alive (`pnpm dev` is NOT part of any card). One Node process at a time; the
  machine is shared with a live sales machine and another factory. Kill every process you started before you finish.
- Invent facts. Every external fact (a rule, a limit, a price, a regulatory date) is `VERIFIED` (primary source + link +
  date), `UNVERIFIED` or `ASSUMPTION` in the docs and in your summary.
- Work outside your card's module boundary. SaaS modules build ONLY on the existing stack (Payload collections +
  Postgres + Payload auth — no Supabase, no second backend, ADR-008); every tenant-scoped collection ships with
  cross-tenant leak tests. Out-of-scope discoveries go to `.agent/notes.md` under "Follow-ups".
- Change infra/config files (`next.config.ts`, `payload.config.ts`, `vercel.json`, middleware, `.env.example`, Payload
  collections) — that is R2 and needs the owner. Ask via the orchestrator.

## This repository is PUBLIC
Every commit is world-readable, forever. No credentials, no client material, no internal pricing or strategy. If a card
seems to require committing anything confidential, stop and say so.

## Design source: repo designs first, Mobbin for design evolution (ADR-005)
Base law = `Exvorta designs/<page>/` (`code.html` port 1:1; `screen.png` acceptance) and `design-system.md` (tokens, type
scale, primitives). Header and Footer are shared — never rebuild per page. A UI state nothing covers comes from
`design-system.md` primitives, never from your imagination; mark it "new state, per design-system" in your summary.
**DES-\* cards additionally use Mobbin via `mobbin-ref`** (judged loop: find → open and judge → port through tokens →
`mobbin-ref cite --slice <CARD-ID> --ref <id> --for <path>`). Never commit anything from `.design-refs/`, never link,
embed or call Mobbin from product code (the gate checks). Look at the rendered page next to the reference at the same
width before you call it done.

## R2 cards
The behaviour/config change needs owner sign-off via the orchestrator (`needs_input`). You never enable, deploy or turn on
anything yourself, and you never touch production services (Vercel, Neon, Resend, Cloudinary).
