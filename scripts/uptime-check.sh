#!/usr/bin/env bash
# =============================================================================
# scripts/uptime-check.sh
# Automated Uptime & Health Verification for Exvorta
#
# Card: PLAT-13 (Task t_6722d4c6)
# Risk Class: R0
#
# Usage:
#   chmod +x scripts/uptime-check.sh
#   ./scripts/uptime-check.sh                        # checks https://exvorta.com
#   ./scripts/uptime-check.sh https://preview.url   # checks custom/preview URL
#
# Environment variables:
#   TARGET_URL       Fallback URL if not passed as $1 (default: https://exvorta.com)
#   TIMEOUT_SECONDS  Timeout per HTTP request in seconds (default: 10)
#   MAX_RETRIES      Number of retries on non-200/timeout (default: 2)
#   RETRY_DELAY      Seconds to wait between retries (default: 3)
#   SILENT           Set to 1 to suppress non-error console output (for cron)
# =============================================================================

set -euo pipefail

TARGET_URL="${1:-${TARGET_URL:-https://exvorta.com}}"
TARGET_URL="${TARGET_URL%/}"

TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-10}"
MAX_RETRIES="${MAX_RETRIES:-2}"
RETRY_DELAY="${RETRY_DELAY:-3}"
SILENT="${SILENT:-0}"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
  if [ "$SILENT" -eq 0 ]; then
    echo -e "${BLUE}[INFO]${NC} $1"
  fi
}

log_ok() {
  if [ "$SILENT" -eq 0 ]; then
    echo -e "${GREEN}[OK]${NC}   $1"
  fi
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1" >&2
}

log_fail() {
  echo -e "${RED}[FAIL]${NC} $1" >&2
}

ENDPOINTS=(
  "/api/health"
  "/"
)

check_endpoint_with_retry() {
  local endpoint="$1"
  local url="${TARGET_URL}${endpoint}"
  local attempt=0
  local max_attempts=$((MAX_RETRIES + 1))
  local http_code=""

  while [ "$attempt" -lt "$max_attempts" ]; do
    attempt=$((attempt + 1))
    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
      --max-time "$TIMEOUT_SECONDS" \
      --header "User-Agent: Exvorta-Uptime-Monitor/1.0" \
      -L "$url" 2>/dev/null || echo "000")

    if [ "$http_code" = "200" ]; then
      if [ "$endpoint" = "/api/health" ]; then
        local body
        body=$(curl -s --max-time "$TIMEOUT_SECONDS" \
          --header "User-Agent: Exvorta-Uptime-Monitor/1.0" \
          "$url" 2>/dev/null || echo "")
        if ! echo "$body" | grep -q '"status"[[:space:]]*:[[:space:]]*"healthy"'; then
          log_warn "Health endpoint HTTP 200 but payload status was not healthy (attempt $attempt/$max_attempts): $body"
          if [ "$attempt" -lt "$max_attempts" ]; then
            sleep "$RETRY_DELAY"
            continue
          fi
          log_fail "$endpoint invalid JSON response: $body"
          return 1
        fi
      fi
      log_ok "$endpoint returned HTTP $http_code (attempt $attempt/$max_attempts)"
      return 0
    else
      log_warn "$endpoint returned HTTP $http_code (attempt $attempt/$max_attempts)"
      if [ "$attempt" -lt "$max_attempts" ]; then
        sleep "$RETRY_DELAY"
      fi
    fi
  done

  log_fail "$endpoint failed after $max_attempts attempt(s). Last HTTP code: $http_code"
  return 1
}

main() {
  log_info "Initiating Exvorta uptime verification for: $TARGET_URL"
  log_info "Config: timeout=${TIMEOUT_SECONDS}s, retries=${MAX_RETRIES}, retry_delay=${RETRY_DELAY}s"

  local failed_checks=0

  for ep in "${ENDPOINTS[@]}"; do
    if ! check_endpoint_with_retry "$ep"; then
      failed_checks=$((failed_checks + 1))
    fi
  done

  if [ "$failed_checks" -gt 0 ]; then
    log_fail "Uptime verification FAILED: $failed_checks check(s) did not return HTTP 200."
    exit 1
  fi

  log_ok "All uptime checks PASSED successfully."
  exit 0
}

main "$@"
