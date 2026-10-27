#!/usr/bin/env bash
# Merge train for the exvorta board. The REVIEWER runs this from inside a card
# worktree, only after approving the card.
#
# ORDER: rebase on origin/main -> gate on the rebased code (card's risk class)
#        -> fast-forward main -> append ledger row -> push.
#
# !!! LANDING IS DEPLOYING (docs/blueprint.md ADR-001): main == production and
# Vercel auto-deploys every landed commit. Vercel's atomic build is the
# production build gate — a broken build never serves; the site keeps the last
# good deployment until the fix lands. The reviewer includes the landed sha in
# the review summary so the owner's manager can check the Vercel deployment.
#
#   usage: land.sh --card-id EXV-E0-02 --risk R0|R1|R2 [--note "text"] [--card t_abcd]
# Exit codes: 0 landed | 2 usage/state | 3 rebase conflict | 4 gate failed | 5 push failed
set -uo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/env.sh"
die() { echo "land.sh: $*" >&2; exit "${2:-2}"; }

card_id="" status="done" note="" card="" risk=""
while [ $# -gt 0 ]; do
  case "$1" in
    --card-id) card_id="$2"; shift ;;
    --risk) risk="$2"; shift ;;
    --note) note="$2"; shift ;;
    --card) card="$2"; shift ;;
    --status) status="$2"; shift ;;
    *) die "unknown arg $1" ;;
  esac
  shift
done
[ -n "$card_id" ] || die "--card-id is required"
case "$risk" in R0|R1|R2) ;; *) die "--risk R0|R1|R2 is required (read it from the card header)";; esac
export CARD_RISK="$risk"

wt="$(git rev-parse --show-toplevel)" || die "not in a git worktree"
main="$EXVORTA_MAIN"
branch="$(git rev-parse --abbrev-ref HEAD)"
[[ "$branch" == card/* ]] || die "refusing: branch '$branch' is not card/*"
[ "$wt" != "$main" ] || die "refusing: run from the card worktree, not the main checkout"
[ -z "$(git status --porcelain)" ] || die "uncommitted changes in $wt — commit first"
[ -z "$(git -C "$main" status --porcelain)" ] || die "main checkout $main is dirty; an operator must clean it"

exec 9>/tmp/exvorta-factory-land.lock
flock -w 3600 9 || die "could not get the landing lock within 1h"

git fetch -q origin || die "git fetch failed" 5
if ! git rebase origin/main >/tmp/exvorta-rebase.$$ 2>&1; then
  files="$(git diff --name-only --diff-filter=U | tr '\n' ' ')"
  git rebase --abort
  echo "REBASE CONFLICT in: $files" >&2
  echo "Ask the builder to rebase the branch on origin/main and resolve (docs: keep both sides)." >&2
  exit 3
fi
rm -f /tmp/exvorta-rebase.$$

bash scripts/agent/gate.sh --base origin/main || die "gate failed on the rebased code — do not land" 4

sha="$(git rev-parse HEAD)"
git -C "$main" fetch -q origin || die "fetch in main checkout failed" 5
git -C "$main" merge --ff-only "$sha" || die "fast-forward of main failed (main diverged?) — call the owner" 2

ledger="$main/docs/LEDGER.md"
[ -f "$ledger" ] || printf '# Landing ledger\n\n| date (UTC) | card | sha | risk | note |\n|---|---|---|---|---|\n' > "$ledger"
printf '| %s | %s | %s | %s | %s |\n' "$(date -u +%F)" "$card_id" "${sha:0:8}" "$risk" "${note:--}" >> "$ledger"
git -C "$main" add docs/LEDGER.md
git -C "$main" commit -q -m "docs(land): $card_id landed (${sha:0:8}, $risk)" || die "ledger commit failed"

if git -C "$main" push -q origin main; then
  echo "LANDED $card_id sha=${sha:0:8} risk=$risk — pushed to origin/main."
  echo "Vercel is deploying main now (landing IS deploying). Include sha ${sha:0:8} in the review summary."
else
  echo "push to origin/main failed — main checkout holds $sha locally; DO NOT retry blindly, call the owner" >&2
  exit 5
fi
