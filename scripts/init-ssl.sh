#!/bin/bash
set -e

# Obtain a real Let's Encrypt certificate using the webroot challenge.
# Usage: ./scripts/init-ssl.sh example.com www.example.com
#
# For wildcard (*.example.com) certificates, use DNS-01 instead of webroot.

if [ -z "$1" ]; then
  echo "Usage: ./scripts/init-ssl.sh <primary-domain> [additional domains...]"
  exit 1
fi

PRIMARY=$1
domains=""
for d in "$@"; do
  domains="$domains -d $d"
done

# Ensure the webroot directory exists so Certbot can write the challenge.
mkdir -p certbot/www

# Request/renew the certificate.
docker compose -f docker-compose.prod.yml run --rm --entrypoint certbot certbot \
  certonly --webroot -w /var/www/certbot $domains \
  --agree-tos --no-eff-email -m "${SSL_EMAIL:-admin@eduvisionschools.co.za}"

# Copy the certificate into nginx/ssl so the default nginx config can load it.
mkdir -p nginx/ssl
docker compose -f docker-compose.prod.yml run --rm \
  -v "$(pwd)/nginx/ssl:/out" \
  --entrypoint /bin/sh certbot \
  -c "cp /etc/letsencrypt/live/$PRIMARY/fullchain.pem /out/cert.pem && cp /etc/letsencrypt/live/$PRIMARY/privkey.pem /out/key.pem"

docker compose -f docker-compose.prod.yml restart nginx

echo "SSL certificate installed for $PRIMARY"
