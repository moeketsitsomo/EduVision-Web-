#!/bin/bash
set -e

# Production deployment helper.
# Ensure .env is configured before running this script.

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "ERROR: .env file not found. Copy .env.example to .env and configure secrets."
  exit 1
fi

if [ ! -f nginx/ssl/cert.pem ] || [ ! -f nginx/ssl/key.pem ]; then
  echo "SSL certificate not found. Generating a self-signed certificate for first boot..."
  ./scripts/init-selfsigned.sh
fi

docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

echo "EduVision is deploying. Health checks:"
echo "  HTTP  : http://localhost/health"
echo "  HTTPS : https://localhost/health"
