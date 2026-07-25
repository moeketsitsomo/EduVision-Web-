#!/bin/bash
set -e

# Restore EduVision from a backup archive.
# Usage: ./scripts/restore.sh <path-to-db-backup.sql.gz> [path-to-uploads-backup.tar.gz]

DB_BACKUP="$1"
UPLOADS_BACKUP="${2:-}"

if [ -z "$DB_BACKUP" ]; then
  echo "Usage: $0 <path-to-db-backup.sql.gz> [path-to-uploads-backup.tar.gz]"
  exit 1
fi

if [ ! -f "$DB_BACKUP" ]; then
  echo "ERROR: Database backup not found: $DB_BACKUP"
  exit 1
fi

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "ERROR: .env file not found. Copy .env.example to .env and configure secrets."
  exit 1
fi

# Load minimal environment for psql credentials
export $(grep -E '^(POSTGRES_USER|POSTGRES_DB|POSTGRES_PASSWORD)=' .env | xargs)

# Ensure containers are running
if ! docker compose -f docker-compose.prod.yml ps | grep -q 'postgres'; then
  echo "Starting PostgreSQL container..."
  docker compose -f docker-compose.prod.yml up -d postgres
  sleep 5
fi

# Restore database
echo "[restore] Restoring database from $DB_BACKUP ..."
zcat "$DB_BACKUP" | docker compose -f docker-compose.prod.yml exec -T postgres psql -U "${POSTGRES_USER:-eduvision}" -d "${POSTGRES_DB:-eduvision}"

# Restore uploads if provided
if [ -n "$UPLOADS_BACKUP" ] && [ -f "$UPLOADS_BACKUP" ]; then
  echo "[restore] Restoring uploads from $UPLOADS_BACKUP ..."
  docker run --rm -v "$(realpath "$UPLOADS_BACKUP"):/restore.tar.gz:ro" \
    -v "eduvision_uploads:/data" alpine tar -xzf /restore.tar.gz -C /data
fi

echo "[restore] Completed at $(date)"
