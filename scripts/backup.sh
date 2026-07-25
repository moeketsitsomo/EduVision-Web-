#!/bin/bash
set -e

# Environment variables expected:
# POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
# BACKUP_RETENTION_DAYS (default 7)
# BACKUP_S3_BUCKET and BACKUP_S3_PREFIX (optional)

BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION="${BACKUP_RETENTION_DAYS:-7}"
DATE=$(date +%F-%H%M%S)
mkdir -p "$BACKUP_DIR"

DB_FILE="$BACKUP_DIR/eduvision-db-$DATE.sql"
echo "[backup] Dumping database to $DB_FILE ..."
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -h postgres -U "$POSTGRES_USER" -d "$POSTGRES_DB" > "$DB_FILE"
gzip "$DB_FILE"

UPLOADS_FILE="$BACKUP_DIR/eduvision-uploads-$DATE.tar.gz"
echo "[backup] Archiving uploads to $UPLOADS_FILE ..."
tar -czf "$UPLOADS_FILE" -C /data .

# Cleanup old local backups
find "$BACKUP_DIR" -type f -mtime +"$RETENTION" -delete

echo "[backup] Completed at $(date)"
