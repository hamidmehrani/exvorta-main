# shellcheck shell=bash
# Source me (do not execute): the factory shell for the exvorta board.
# The app is Next.js 15 + Payload 3 built with pnpm; NODE is capped so a card
# cannot starve the shared host (LeadGen sales machine + Hamesu factory).
_rh="${AGENT_REAL_HOME:-$HOME}"
export PATH="$_rh/.local/bin:$PATH"
export EXVORTA_MAIN="${EXVORTA_MAIN:-$_rh/projects/exvorta}"
unset _rh
# marker for tools and tests: this is the factory clone, never production
export EXVORTA_FACTORY_CLONE=1
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--max-old-space-size=2048"
# the card's risk class (R0/R1/R2), read by scripts/agent/gate.sh; land.sh --risk sets it,
# builders export it from the card header
export CARD_RISK="${CARD_RISK:-R0}"
