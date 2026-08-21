#!/bin/bash
# =============================================================================
# scripts/lighthouse-ci.sh
# Run Lighthouse audits on key Exvorta routes
#
# Usage:
#   chmod +x scripts/lighthouse-ci.sh
#   ./scripts/lighthouse-ci.sh                        # defaults to https://exvorta.com
#   ./scripts/lighthouse-ci.sh https://preview.url   # test a preview URL
#
# Requirements:
#   npm install -g lighthouse  (or use local: npx lighthouse)
# =============================================================================

set -euo pipefail

URL="${1:-https://exvorta.com}"
REPORT_DIR="./lighthouse-reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PASS=0
FAIL=0

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

mkdir -p "$REPORT_DIR"

echo ""
echo "=================================================================="
echo "  🔍 Lighthouse CI — Exvorta Performance Audit"
echo "  URL: ${URL}"
echo "  Time: $(date '+%Y-%m-%d %H:%M:%S')"
echo "  Reports: ${REPORT_DIR}/"
echo "=================================================================="

# Minimum acceptable Lighthouse scores (0–100)
MIN_PERFORMANCE=85
MIN_ACCESSIBILITY=90
MIN_BEST_PRACTICES=85
MIN_SEO=90

routes=(
  "/"
  "/portfolio"
  "/rfq"
  "/ecosystem"
  "/waitlist"
)

for route in "${routes[@]}"; do
  full_url="${URL}${route}"
  # Safe filename from route
  safe_name=$(echo "$route" | tr '/' '_')
  safe_name="${safe_name:-_root}"
  report_file="${REPORT_DIR}/lh${safe_name}_${TIMESTAMP}"

  echo ""
  echo -e "${BLUE}── Testing: ${route}${NC}"

  # Run Lighthouse
  if ! npx --yes lighthouse "$full_url" \
    --output json \
    --output html \
    --output-path "$report_file" \
    --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
    --form-factor=mobile \
    --throttling-method=simulate \
    --quiet 2>/dev/null; then
    echo -e "${RED}❌ Lighthouse failed to run on ${route}${NC}"
    ((FAIL++))
    continue
  fi

  # Parse scores from JSON report
  json_file="${report_file}.report.json"

  if [[ ! -f "$json_file" ]]; then
    echo -e "${RED}❌ Report file not found: ${json_file}${NC}"
    ((FAIL++))
    continue
  fi

  # Extract scores (multiply by 100 for 0-100 scale)
  perf=$(node -e "const r=require('${json_file}'); console.log(Math.round(r.categories.performance.score*100))" 2>/dev/null || echo "?")
  a11y=$(node -e "const r=require('${json_file}'); console.log(Math.round(r.categories.accessibility.score*100))" 2>/dev/null || echo "?")
  bp=$(node -e "const r=require('${json_file}'); console.log(Math.round(r.categories['best-practices'].score*100))" 2>/dev/null || echo "?")
  seo=$(node -e "const r=require('${json_file}'); console.log(Math.round(r.categories.seo.score*100))" 2>/dev/null || echo "?")

  route_pass=true

  # Performance
  if [[ "$perf" != "?" ]] && (( perf >= MIN_PERFORMANCE )); then
    echo -e "  ${GREEN}✅ Performance:     ${perf}/100${NC}"
  else
    echo -e "  ${RED}❌ Performance:     ${perf}/100 (min: ${MIN_PERFORMANCE})${NC}"
    route_pass=false
  fi

  # Accessibility
  if [[ "$a11y" != "?" ]] && (( a11y >= MIN_ACCESSIBILITY )); then
    echo -e "  ${GREEN}✅ Accessibility:   ${a11y}/100${NC}"
  else
    echo -e "  ${RED}❌ Accessibility:   ${a11y}/100 (min: ${MIN_ACCESSIBILITY})${NC}"
    route_pass=false
  fi

  # Best Practices
  if [[ "$bp" != "?" ]] && (( bp >= MIN_BEST_PRACTICES )); then
    echo -e "  ${GREEN}✅ Best Practices:  ${bp}/100${NC}"
  else
    echo -e "  ${RED}❌ Best Practices:  ${bp}/100 (min: ${MIN_BEST_PRACTICES})${NC}"
    route_pass=false
  fi

  # SEO
  if [[ "$seo" != "?" ]] && (( seo >= MIN_SEO )); then
    echo -e "  ${GREEN}✅ SEO:             ${seo}/100${NC}"
  else
    echo -e "  ${RED}❌ SEO:             ${seo}/100 (min: ${MIN_SEO})${NC}"
    route_pass=false
  fi

  echo -e "  ${BLUE}ℹ️  HTML report:    ${report_file}.report.html${NC}"

  if $route_pass; then
    ((PASS++))
  else
    ((FAIL++))
  fi
done

echo ""
echo "=================================================================="
echo "  📊 Lighthouse CI Summary"
echo "  ✅ Routes passed: ${PASS}"
echo "  ❌ Routes failed: ${FAIL}"
echo "  📁 Reports saved: ${REPORT_DIR}/"
echo "=================================================================="
echo ""
echo "  Score thresholds:"
echo "  Performance ≥ ${MIN_PERFORMANCE}  |  Accessibility ≥ ${MIN_ACCESSIBILITY}"
echo "  Best Practices ≥ ${MIN_BEST_PRACTICES}  |  SEO ≥ ${MIN_SEO}"
echo "=================================================================="

if [[ "$FAIL" -gt 0 ]]; then
  echo ""
  echo -e "${RED}LIGHTHOUSE CI FAILED — ${FAIL} route(s) below threshold.${NC}"
  exit 1
else
  echo ""
  echo -e "${GREEN}LIGHTHOUSE CI PASSED — all routes within budget.${NC}"
  exit 0
fi
