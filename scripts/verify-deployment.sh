#!/bin/bash
# =============================================================================
# scripts/verify-deployment.sh
# Post-deployment verification script for Exvorta
#
# Usage:
#   chmod +x scripts/verify-deployment.sh
#   ./scripts/verify-deployment.sh                        # defaults to https://exvorta.com
#   ./scripts/verify-deployment.sh https://preview.url   # test a preview URL
# =============================================================================

set -euo pipefail

URL="${1:-https://exvorta.com}"
PASS=0
FAIL=0
WARN=0

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ok()   { echo -e "${GREEN}✅ $1${NC}"; ((PASS++)); }
fail() { echo -e "${RED}❌ $1${NC}"; ((FAIL++)); }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; ((WARN++)); }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

echo ""
echo "=================================================================="
echo "  🚀 Exvorta Deployment Verification"
echo "  URL: ${URL}"
echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=================================================================="

# ── 1. Route Status Checks ─────────────────────────────────────────────────
echo ""
echo "── 1. Route Status Checks ────────────────────────────────────────"

routes=(
  "/"
  "/portfolio"
  "/rfq"
  "/waitlist"
  "/ecosystem"
  "/admin"
  "/api/health"
)

for route in "${routes[@]}"; do
  full_url="${URL}${route}"
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 -L "$full_url" 2>/dev/null || echo "TIMEOUT")
  
  if [[ "$status" == "200" ]]; then
    ok "${route} → ${status}"
  elif [[ "$status" == "307" || "$status" == "308" || "$status" == "301" || "$status" == "302" ]]; then
    warn "${route} → ${status} (redirect — check destination)"
  elif [[ "$status" == "TIMEOUT" ]]; then
    fail "${route} → TIMEOUT after 30s"
  else
    fail "${route} → ${status}"
  fi
done

# ── 2. Security Headers ───────────────────────────────────────────────────
echo ""
echo "── 2. Security Headers ───────────────────────────────────────────"

headers_output=$(curl -sI "${URL}" --max-time 30 2>/dev/null)

check_header() {
  local header="$1"
  local expected="$2"
  if echo "$headers_output" | grep -qi "$header"; then
    ok "Header present: ${header}"
    if [[ -n "$expected" ]]; then
      if echo "$headers_output" | grep -qi "$expected"; then
        ok "  └─ Value matches: ${expected}"
      else
        warn "  └─ Value may not match expected: ${expected}"
      fi
    fi
  else
    fail "Header MISSING: ${header}"
  fi
}

check_header "X-Frame-Options" "DENY"
check_header "X-Content-Type-Options" "nosniff"
check_header "Referrer-Policy" ""
check_header "Permissions-Policy" ""
check_header "Strict-Transport-Security" "max-age"

# Check CSP (optional — may be set via middleware)
if echo "$headers_output" | grep -qi "Content-Security-Policy"; then
  ok "Content-Security-Policy header present"
else
  warn "Content-Security-Policy not found (may be set per-page via middleware)"
fi

# ── 3. Performance Spot Check ─────────────────────────────────────────────
echo ""
echo "── 3. Response Times ─────────────────────────────────────────────"

perf_routes=("/" "/portfolio" "/rfq")
for route in "${perf_routes[@]}"; do
  time_s=$(curl -o /dev/null -s -w "%{time_total}" --max-time 30 "${URL}${route}" 2>/dev/null || echo "err")
  if [[ "$time_s" == "err" ]]; then
    fail "${route}: curl failed"
  else
    time_ms=$(echo "$time_s * 1000" | bc 2>/dev/null || echo "?")
    if (( $(echo "$time_s < 3.0" | bc -l 2>/dev/null || echo 0) )); then
      ok "${route}: ${time_s}s"
    else
      warn "${route}: ${time_s}s — exceeds 3s threshold"
    fi
  fi
done

# ── 4. API Health Check ───────────────────────────────────────────────────
echo ""
echo "── 4. API Health ─────────────────────────────────────────────────"

health_body=$(curl -s --max-time 15 "${URL}/api/health" 2>/dev/null || echo "{}")
if echo "$health_body" | grep -q '"status":"healthy"'; then
  ok "/api/health returns healthy status"
else
  fail "/api/health did not return expected JSON"
  info "Response: ${health_body}"
fi

# ── 5. Critical Assets ────────────────────────────────────────────────────
echo ""
echo "── 5. Critical Assets ────────────────────────────────────────────"

assets=(
  "/favicon.ico"
  "/manifest.webmanifest"
  "/robots.txt"
  "/sitemap.xml"
)

for asset in "${assets[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "${URL}${asset}" 2>/dev/null || echo "ERR")
  if [[ "$status" == "200" ]]; then
    ok "${asset} → ${status}"
  else
    warn "${asset} → ${status}"
  fi
done

# ── 6. Summary ────────────────────────────────────────────────────────────
echo ""
echo "=================================================================="
echo "  📊 Verification Summary"
echo "  ✅ Passed: ${PASS}"
echo "  ❌ Failed: ${FAIL}"
echo "  ⚠️  Warnings: ${WARN}"
echo "=================================================================="

if [[ "$FAIL" -gt 0 ]]; then
  echo ""
  echo -e "${RED}DEPLOYMENT VERIFICATION FAILED — ${FAIL} check(s) failed.${NC}"
  exit 1
elif [[ "$WARN" -gt 0 ]]; then
  echo ""
  echo -e "${YELLOW}DEPLOYMENT VERIFIED WITH WARNINGS — review warnings above.${NC}"
  exit 0
else
  echo ""
  echo -e "${GREEN}DEPLOYMENT FULLY VERIFIED — all checks passed.${NC}"
  exit 0
fi
