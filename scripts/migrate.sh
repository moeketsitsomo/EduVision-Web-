#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "[migrate] Running Prisma migrations..."
docker compose -f docker-compose.prod.yml run --rm api sh -c "cd apps/api && npx prisma migrate deploy"
echo "[migrate] Migrations complete."
