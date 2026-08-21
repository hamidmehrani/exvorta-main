#!/bin/bash
# Full DB reset + migrate + seed pipeline for Exvorta
# Usage: ./scripts/db-setup.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "========================================"
echo " STEP 1: Reset Database"
echo "========================================"
npx tsx --env-file=.env scripts/reset-db.ts

echo ""
echo "========================================"
echo " STEP 2: Create Migration"
echo "========================================"
# Clean any stale migrations
rm -rf migrations/
mkdir -p migrations

# Run payload migrate:create
npm run payload migrate:create -- --name initial --forceAcceptWarning

echo ""
echo "========================================"
echo " STEP 3: Run Migration"
echo "========================================"
npm run payload migrate

echo ""
echo "========================================"
echo " STEP 4: Seed Content"
echo "========================================"
PAYLOAD_FORCE_DRIZZLE_PUSH=true NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" npx tsx --env-file=.env scripts/seed-master.ts

echo ""
echo "========================================"
echo " SUCCESS: Database seeded!"
echo "========================================"
