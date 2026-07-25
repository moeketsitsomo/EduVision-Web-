# EduVision Production Deployment Guide

This guide covers deploying the EduVision multi-tenant School CMS to a live server.

## Architecture

- **Frontend**: Next.js 15 standalone server (`web` service)
- **Backend API**: NestJS 10 (`api` service)
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Reverse Proxy / SSL**: Nginx with Let's Encrypt (Certbot)
- **File Storage**: Local volume (`uploads`) served directly by Nginx, or configure S3 via `STORAGE_TYPE=s3`

## Server Requirements

- Ubuntu 22.04/24.04 LTS (or any Docker-capable host)
- Docker Engine 24+ and Docker Compose v2
- A public IP and at least one domain pointing to the server
- Ports 80 and 443 open

## Domain Strategy

Recommended:

- Platform / admin access: `eduvisionschools.co.za`
- School subdomains: `schoolname.eduvisionschools.co.za`
- Custom domains: point an A record to the server; set the school's `customDomain` in the database.

Nginx uses `server_name _;` (default server) and passes the `Host` header, so any school domain that resolves to the server will work.

## Environment Configuration

1. Copy the example file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set real values at minimum:

   ```env
   POSTGRES_PASSWORD=a-long-random-password
   JWT_SECRET=another-long-random-string
   COOKIE_DOMAIN=.eduvisionschools.co.za
   API_URL=http://localhost:4000
   STORAGE_BASE_URL=https://eduvisionschools.co.za
   ```

3. For local or first-boot HTTPS testing, you can leave `API_URL` as `http://localhost:4000` and let Nginx terminate SSL.

## First Deploy

```bash
./scripts/deploy.sh
```

This script:
1. Verifies `.env` exists.
2. Generates a self-signed SSL certificate if no certificate exists.
3. Builds the Docker images.
4. Starts all services in detached mode.

Visit `https://your-domain` after 30 seconds.

## Real SSL Certificates (Let's Encrypt)

After first boot, replace the self-signed certificate:

```bash
./scripts/init-ssl.sh eduvisionschools.co.za www.eduvisionschools.co.za
```

For a wildcard certificate (`*.eduvisionschools.co.za`), use DNS-01 validation instead of webroot. The `certbot` service will automatically renew existing certificates every 12 hours.

## Database Migrations & Seed

On first deploy, run migrations and seed the super admin:

```bash
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec api npx ts-node prisma/seed.ts
```

## Super Admin Login

Use the credentials created by `prisma/seed.ts`:

- Email: `superadmin@eduvision.local`
- Password: `SuperAdmin123!`
- School slug: `platform`

Change these immediately after first login.

## Production Checklist

- [ ] Real `JWT_SECRET` (at least 64 random characters)
- [ ] Real `POSTGRES_PASSWORD`
- [ ] `COOKIE_DOMAIN` set to your root domain
- [ ] Valid SSL certificate
- [ ] `NODE_ENV=production` in `.env`
- [ ] Backups configured for PostgreSQL and `uploads` volume
- [ ] Rate limits, fail2ban, or WAF in front of Nginx
- [ ] S3 storage configured for file uploads if running on multiple servers

## Scaling Notes

- The platform is stateless except for the `uploads` volume and PostgreSQL/Redis.
- If running multiple `web`/`api` replicas, use S3 for `STORAGE_TYPE` and a managed Postgres/Redis.
- Upload `uploads` to S3 to avoid shared-volume issues.

## Backup Strategy

```bash
# Database
docker compose -f docker-compose.prod.yml exec api pg_dump -h postgres -U eduvision eduvision > eduvision-backup-$(date +%F).sql

# Files
docker run --rm -v eduvision_uploads:/data -v $(pwd):/backup alpine tar czf /backup/uploads-backup-$(date +%F).tar.gz -C /data .
```

Automate the above with a cron job or your cloud backup service.
