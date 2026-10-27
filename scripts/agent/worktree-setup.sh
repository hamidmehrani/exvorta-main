#!/usr/bin/env bash
# FIRST command inside every card worktree (idempotent). Installs pnpm deps if
# missing and REFUSES to continue when the checkout is not a clean clone: a
# worktree that contains a real .env or a credential file means somebody copied
# production or a secret into the factory. The repo is PUBLIC — nothing secret
# may ever reach git (AGENTS.md, factory section).
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/env.sh"
root="$(git rev-parse --show-toplevel)"
cd "$root"

[ "${EXVORTA_FACTORY_CLONE:-}" = "1" ] || { echo "worktree-setup: source scripts/agent/env.sh first" >&2; exit 2; }
case "$root" in
  "$EXVORTA_MAIN"|/opt/*|/etc/*) echo "worktree-setup: refusing to run in the main checkout or a system path ($root)" >&2; exit 2 ;;
esac

bad="$(find "$root" -maxdepth 4 \( -name .git -o -name node_modules -o -name .next -o -name .agent \) -prune -o -type f \
  \( -name '.env' -o -name '.env.local' -o -name '.env.production' -o -name '*.pem' -o -name 'id_rsa*' -o -name '*.db' -o -name '*credential*' \) ! -name '.env.example' -print 2>/dev/null | head -5)"
if [ -n "$bad" ]; then
  echo "worktree-setup: this checkout contains secret-shaped files:" >&2
  echo "$bad" | sed 's/^/  /' >&2
  echo "Block the card (needs_input): the clone must come from git clone, never copied from a machine holding real env files." >&2
  exit 2
fi

node_major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
[ "$node_major" = "22" ] || { echo "worktree-setup: node 22.x required (engines), found: $(node --version 2>/dev/null || echo none)" >&2; exit 2; }

if ! command -v pnpm >/dev/null 2>&1; then
  mkdir -p "$HOME/.local/bin"
  corepack enable --install-directory "$HOME/.local/bin" pnpm >/dev/null 2>&1 || true
  command -v pnpm >/dev/null 2>&1 || { echo "worktree-setup: pnpm unavailable even via corepack" >&2; exit 2; }
fi

if [ ! -d node_modules ]; then
  echo "worktree-setup: installing deps (pnpm store is shared across worktrees; first run is the slow one)"
  pnpm install --frozen-lockfile --prefer-offline
fi

mkdir -p .agent/tmp
printf 'CARD_TMP=%s\nCARD_ROOT=%s\n' "$root/.agent/tmp" "$root" >.agent/card.env
echo "worktree ready: $root (clean: no secret files, deps installed). Verify with scripts/agent/gate.sh."
