#!/usr/bin/env bash
# The factory gate for the exvorta repository. A card is done when this exits 0
# in the card's own worktree.
#
#   CARD_RISK=R0 scripts/agent/gate.sh [--base REF] [--timeout S]
#
# Environment: CARD_RISK=R0|R1|R2 (default R0). Changes to protected infra files
# (next.config.ts, payload.config.ts, vercel.json, middleware, .env.example,
# app/(payload), app/api, app/(frontend)/login) fail unless CARD_RISK=R2;
# changes to secret-shaped paths fail always.
#
# Steps, in order (each prints PASS/FAIL/SKIP; exit code = number of failed steps, capped 99):
#   1 changed     changed files against the base (tracked + untracked, excluding deps/build)
#   2 scope       forbidden / protected paths
#   3 docs-guard  no edit of docs/blueprint.md on a card/* branch (manager-owned)
#   4 secrets     secret-shaped strings in changed files
#   5 compile     bash -n on changed .sh, then `pnpm exec tsc --noEmit`
#   6 lint        `pnpm lint`
#   7 tests       `pnpm exec vitest run` when vitest is installed, else SKIP with a note
#
# No production build here: landing (scripts/agent/land.sh) pushes main and
# Vercel's atomic build is the production gate (docs/blueprint.md ADR-001).
set -u
cd "$(dirname "$0")/../.."
BASE=origin/main
TMO=${GATE_TIMEOUT:-900}
RISK=${CARD_RISK:-R0}

while [ $# -gt 0 ]; do
  case "$1" in
    --base) BASE=$2; shift 2 ;;
    --timeout) TMO=$2; shift 2 ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) echo "unknown argument $1" >&2; exit 2 ;;
  esac
  shift
done

FAILS=0
step() { printf '%-11s %s\n' "$1" "$*"; }
fail() { FAILS=$((FAILS + 1)); step "$1" "FAIL $2"; }

if ! git rev-parse --verify -q "$BASE" >/dev/null; then
  echo "gate: base ref $BASE does not exist here; fetch it first (git fetch origin main)" >&2
  exit 2
fi

branch="$(git rev-parse --abbrev-ref HEAD)"
CHANGED="$( (git diff --name-only "$BASE"...HEAD; git diff --name-only "$BASE"; git ls-files --others --exclude-standard) \
  | grep -v -E '^(node_modules/|\.next/|\.agent/|pnpm-lock\.yaml$)' | sort -u )"
NCH="$(printf '%s\n' "$CHANGED" | grep -c . || true)"
echo "gate: base=$BASE risk=$RISK branch=$branch changed=$NCH files"
if [ "$NCH" -eq 0 ]; then echo "GATE OK (nothing changed against $BASE)"; exit 0; fi

# 1 changed (list)
step changed "$(printf '%s\n' "$CHANGED" | head -12 | tr '\n' ' ')"
[ "$NCH" -le 12 ] || step changed "(+ $((NCH - 12)) more)"

# 2 scope
FORB="$(printf '%s\n' "$CHANGED" | grep -E '(^|/)\.env($|\.local$|\.production$)|\.pem$|id_rsa|\.db$|\.vercel/|^create_vercel_projects\.sh$|^push_repos\.sh$' || true)"
if [ -n "$FORB" ]; then fail scope "forbidden path(s) changed: $(printf '%s' "$FORB" | tr '\n' ' ')";
else
  PROT="$(printf '%s\n' "$CHANGED" | grep -E '^next\.config\.ts$|^payload\.config\.ts$|^vercel\.json$|^middleware\.ts$|^\.env\.example$|^docker-compose\.yml$|^drizzle\.config\.ts$|^\(payload\)/|^app/\(payload\)/|^app/api/|^app/\(frontend\)/login/' || true)"
  if [ -n "$PROT" ] && [ "$RISK" != "R2" ]; then
    fail scope "protected infra path(s) changed under CARD_RISK=$RISK: $(printf '%s' "$PROT" | tr '\n' ' ')"
  elif [ -n "$PROT" ]; then
    step scope "PASS (protected path(s) allowed because CARD_RISK=R2: $(printf '%s' "$PROT" | tr '\n' ' '))"
  else
    step scope "PASS"
  fi
fi

# 3 docs-guard
if [ "${branch#card/}" != "$branch" ]; then
  BP="$(printf '%s\n' "$CHANGED" | grep -E '^docs/blueprint\.md$' || true)"
  [ -z "$BP" ] && step docs-guard "PASS" || fail docs-guard "docs/blueprint.md is manager-owned; propose changes via a card comment instead"
else
  step docs-guard "SKIP (not a card/* branch)"
fi

# 4 secrets
SECRET_PAT='sk_live_|sk-|ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|xox[bp]-|re_[A-Za-z0-9]{20,}|npg_[A-Za-z0-9]{10,}|vcp_[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY|://[A-Za-z0-9_]+:[^@/ ]{8,}@'
HITS=""
while IFS= read -r f; do
  [ -f "$f" ] || continue
  case "$f" in *.lock|*package-lock.json) continue ;; esac
  m="$(grep -nE "$SECRET_PAT" "$f" 2>/dev/null | grep -vE 'process\.env|\.env\.example|YOUR_|<your|example|placeholder|xxxx' | head -2)"
  [ -n "$m" ] && HITS="$HITS$f: $m"$'\n'
done <<EOF
$CHANGED
EOF
if [ -n "$HITS" ]; then fail secrets "secret-shaped string(s): $(printf '%s' "$HITS" | head -4 | tr '\n' ' ')"; else step secrets "PASS"; fi

# 5 compile
CSH="$(printf '%s\n' "$CHANGED" | grep '\.sh$' || true)"
COK=1
for f in $CSH; do bash -n "$f" || COK=0; done
[ "$COK" = 1 ] && step compile-sh "PASS" || fail compile-sh "bash -n failed"

step tsc "running (timeout ${TMO}s)…"
if timeout "$TMO" pnpm exec tsc --noEmit >/tmp/gate_tsc.$$ 2>&1; then
  step tsc "PASS"
else
  fail tsc "$(tail -5 /tmp/gate_tsc.$$ | tr '\n' ' ')"
fi
rm -f /tmp/gate_tsc.$$

# 6 lint
step lint "running…"
if timeout "$TMO" pnpm lint >/tmp/gate_lint.$$ 2>&1; then
  step lint "PASS"
else
  fail lint "$(tail -5 /tmp/gate_lint.$$ | tr '\n' ' ')"
fi
rm -f /tmp/gate_lint.$$

# 7 tests
if [ -d node_modules/vitest ] || [ -d node_modules/.pnpm/vitest* ] 2>/dev/null; then
  step vitest "running…"
  if timeout "$TMO" pnpm exec vitest run --reporter=dot >/tmp/gate_vitest.$$ 2>&1; then
    step vitest "PASS ($(grep -oE '[0-9]+ passed' /tmp/gate_vitest.$$ | tail -1))"
  else
    fail vitest "$(tail -8 /tmp/gate_vitest.$$ | tr '\n' ' ')"
  fi
  rm -f /tmp/gate_vitest.$$
else
  step vitest "SKIP (vitest not installed yet — the first tool card adds it; see blueprint ADR-004)"
fi

if [ "$FAILS" -eq 0 ]; then echo "GATE OK"; else echo "GATE FAILED: $FAILS step(s)"; fi
[ "$FAILS" -eq 0 ] || exit $(( FAILS < 99 ? FAILS : 99 ))
