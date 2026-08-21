#!/bin/bash
# =============================================================================
# scripts/backup-db.sh
# Neon PostgreSQL backup script for Exvorta
#
# Usage:
#   chmod +x scripts/backup-db.sh
#   DATABASE_URI="postgresql://..." ./scripts/backup-db.sh
#   ./scripts/backup-db.sh  # reads from .env if set
#
# Requirements:
#   - pg_dump (part of postgresql-client)
#   - Install: sudo apt-get install postgresql-client  (Ubuntu/Debian)
#              brew install libpq                      (macOS)
# =============================================================================

set -euo pipefail

# Load .env if it exists and DATABASE_URI is not already set
if [[ -z "${DATABASE_URI:-}" ]] && [[ -f ".env" ]]; then
  echo "Loading DATABASE_URI from .env..."
  export $(grep -E "^DATABASE_URI=" .env | head -1)
fi

if [[ -z "${DATABASE_URI:-}" ]]; then
  echo "❌ Error: DATABASE_URI environment variable is not set."
  echo "   Export it or add to .env before running this script."
  exit 1
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

mkdir -p "$BACKUP_DIR"

BACKUP_FILE="${BACKUP_DIR}/exvorta_backup_${TIMESTAMP}.sql"

echo ""
echo "📦 Backing up Exvorta database..."
echo "   Destination: ${BACKUP_FILE}"
echo "   Timestamp:   ${TIMESTAMP}"
echo ""

# pg_dump with compressed format and no connection limit issues
pg_dump \
  --no-password \
  --format=plain \
  --no-privileges \
  --no-owner \
  "$DATABASE_URI" \
  > "$BACKUP_FILE"

FILE_SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)

echo "✅ Backup complete!"
echo "   File:  ${BACKUP_FILE}"
echo "   Size:  ${FILE_SIZE}"
echo ""
echo "To restore from this backup:"
echo "   psql \"\$DATABASE_URI\" < ${BACKUP_FILE}"
