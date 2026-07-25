# EduVision School CMS — Production Deployment Guide

This guide covers deploying the EduVision multi-tenant School Website CMS to a live server using Docker Compose and Nginx. The same steps work for a VPS, a dedicated Ubuntu server, or any cloud provider (AWS, DigitalOcean, Hetzner, Azure, GCP, etc.).

## What You Will Deploy

| Service | Technology | Purpose |
|---|---|---|
| Web Frontend | Next.js 15 (standalone) | Public school websites and admin dashboard |
| API Backend | NestJS 10 + Prisma 5 | REST API, auth, CRUD, multi-tenant logic |
| Database | PostgreSQL 16 | Persistent school data |
| Cache | Redis 7 | Sessions/cache (ready for future use) |
| Reverse Proxy | Nginx + Certbot | SSL termination, static file serving, routing |
| File Storage | Local volume (or S3) | Logos, photos, PDFs, newsletters, policies |

## Server Requirements

- Ubuntu 22.04 LTS or 24.04 LTS (or any Docker-capable Linux host)
- 2+ vCPUs, 4 GB RAM minimum, 20 GB SSD
- Docker Engine 24+ and Docker Compose v2
- A public static IP address
- Ports `80` and `443` open in the firewall
- A domain name you control (e.g. `eduvisionschools.co.za`)

## Domain Strategy

Recommended DNS setup:

- Platform / marketing site: `eduvisionschools.co.za`
- School subdomains: `schoolname.eduvisionschools.co.za`
- Wildcard DNS record: `*.eduvisionschools.co.za` → server IP
- Custom domains: school owners point an A record to the server, then set the school's `customDomain` in the admin dashboard.

Nginx is configured with `server_name _;` (default server), so any domain or subdomain that resolves to the server will be handled automatically. The application resolves the school from the `Host` header.

## Initial Setup

1. Clone or copy the project to your server.
2. Copy the example environment file and fill in real values:

   ```bash
   cp .env.example .env
   nano .env
   ```

3. Minimum required environment values:

   ```env
   POSTGRES_USER=eduvision
   POSTGRES_PASSWORD=change-to-a-long-random-password
   POSTGRES_DB=eduvision
   DATABASE_URL=postgresql://eduvision:change-to-a-long-random-password@postgres:5432/eduvision?schema=public

   JWT_SECRET=change-to-a-very-long-random-string-min-64-chars
   JWT_EXPIRES_IN=7d
   COOKIE_DOMAIN=.eduvisionschools.co.za

   API_URL=http://localhost:4000
   STORAGE_BASE_URL=https://eduvisionschools.co.za

   STORAGE_TYPE=local
   STORAGE_LOCAL_ROOT=uploads
   ```

   - `COOKIE_DOMAIN` should be the root domain with a leading dot so cookies work across all school subdomains.
   - `STORAGE_BASE_URL` must be the public HTTPS domain where uploaded files will be served. Nginx serves `/uploads` directly from the shared volume.
   - `API_URL` is only used by the web server for internal/server-side API calls; the Docker Compose override sets it to `http://api:4000` automatically.

4. Review `docker-compose.prod.yml` and `nginx/default.conf`. The defaults are production-ready for a single-server deployment.

## First Deploy

Run the deploy helper from the project root:

```bash
./scripts/deploy.sh
```

This script will:
1. Verify `.env` exists.
2. Generate a self-signed SSL certificate if `nginx/ssl/cert.pem` is missing.
3. Build the `api` and `web` Docker images.
4. Start PostgreSQL, Redis, API, Web, Nginx, and Certbot in detached mode.

After ~60 seconds, the application will be available at `https://your-domain` using the self-signed certificate.

## Database Migrations and Seed

On a fresh database, run:

```bash
# Deploy migrations
docker compose -f docker-compose.prod.yml exec api sh -c "cd apps/api && npx prisma migrate deploy"

# Seed the super admin and demo school
docker compose -f docker-compose.prod.yml exec api npx ts-node apps/api/prisma/seed.ts
```

Default credentials after seeding:

- Super admin: `superadmin@eduvision.local` / `SuperAdmin123!` (school slug: `platform`)
- Demo school admin: `admin@demo-school.edu` / `SchoolAdmin123!` (school slug: `demo-school`)

Change all default passwords immediately after first login.

## SSL Certificate (Let's Encrypt)

The self-signed certificate is only for first boot. Replace it with a real certificate before going live.

For a single domain or a list of domains:

```bash
./scripts/init-ssl.sh eduvisionschools.co.za www.eduvisionschools.co.za
```

For a wildcard certificate (e.g. `*.eduvisionschools.co.za`), use DNS-01 validation instead of the webroot challenge. The `certbot` container is already configured to automatically renew certificates every 12 hours.

## Verifying the Deployment

- Public health check: `https://your-domain/api/health`
- Public school site: `https://schoolname.your-domain/`
- Admin login: `https://your-domain/admin/login`
- Super admin dashboard: `https://your-domain/admin/super`

Health command:

```bash
curl -s https://your-domain/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

## Multi-Tenancy and Provisioning

Each school is isolated by `schoolId` in the database. When a super admin creates a new school:

1. The API creates the school record.
2. If an admin email and password are provided, a `SCHOOL_ADMIN` user is automatically provisioned.
3. The school's public website is immediately available at `https://school-slug.your-domain/` (or a custom domain configured in DNS).

No manual server configuration is required per school.

## Production Environment Variables Reference

| Variable | Example | Purpose |
|---|---|---|
| `POSTGRES_USER` | `eduvision` | PostgreSQL user |
| `POSTGRES_PASSWORD` | `...` | PostgreSQL password |
| `POSTGRES_DB` | `eduvision` | PostgreSQL database |
| `DATABASE_URL` | `postgresql://...` | Prisma connection string |
| `REDIS_URL` | `redis://redis:6379` | Redis connection (used for cache/sessions) |
| `PORT` | `4000` | API port inside container |
| `NODE_ENV` | `production` | Runtime environment |
| `API_URL` | `http://localhost:4000` | Public API base URL (used for links) |
| `JWT_SECRET` | `...` | JWT signing secret (min 64 chars) |
| `JWT_EXPIRES_IN` | `7d` | JWT expiry |
| `COOKIE_DOMAIN` | `.eduvisionschools.co.za` | Cookie domain for cross-subdomain auth |
| `STORAGE_TYPE` | `local` or `s3` | File storage backend |
| `STORAGE_LOCAL_ROOT` | `uploads` | Local upload directory |
| `STORAGE_BASE_URL` | `https://eduvisionschools.co.za` | Public base URL for file URLs |
| `AWS_REGION` | `af-south-1` | S3 region (if using S3) |
| `AWS_S3_BUCKET` | `eduvision-uploads` | S3 bucket (if using S3) |
| `AWS_ACCESS_KEY_ID` | `...` | AWS access key (if using S3) |
| `AWS_SECRET_ACCESS_KEY` | `...` | AWS secret key (if using S3) |

## S3 File Storage (Optional)

For multi-server deployments, use S3-compatible storage instead of the local `uploads` volume:

1. Set `STORAGE_TYPE=s3`.
2. Configure `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.
3. Update `STORAGE_BASE_URL` to your CDN or S3 public URL.
4. Remove the `uploads` volume from `nginx` and `api` services.

## Security Hardening

The application already includes:

- JWT authentication with bcrypt password hashing
- Role-based access control (`SUPER_ADMIN`, `SCHOOL_ADMIN`, `SCHOOL_STAFF`)
- HttpOnly `access_token` cookie
- Helmet security headers (CSP, HSTS, XSS, etc.)
- Rate limiting (200 requests per 15 minutes per IP)
- CORS with credentials
- Prisma parameterized queries (SQL injection protection)
- Request validation and sanitization with `class-validator`
- Audit logs for all admin actions

Recommended additional steps:

- Change default JWT secret and super admin credentials immediately.
- Use a firewall (`ufw` or cloud security groups) and restrict ports 22, 80, 443.
- Consider `fail2ban` for SSH and Nginx brute-force protection.
- Keep the server and Docker base images updated.
- Run `docker compose -f docker-compose.prod.yml pull` regularly for base image updates.

## Backup Strategy

Schedule daily backups on the host:

```bash
# Database backup
docker compose -f docker-compose.prod.yml exec -T api pg_dump -h postgres -U eduvision eduvision > /backups/eduvision-$(date +%F).sql

# Uploads backup
docker run --rm -v eduvision_uploads:/data -v /backups:/backup alpine tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
```

Store backups offsite (S3, Backblaze B2, etc.).

## Monitoring and Logging

- View container logs: `docker compose -f docker-compose.prod.yml logs -f api web nginx`
- Monitor disk, CPU, and memory with `docker stats` or a cloud monitoring agent.
- For production monitoring, integrate with Prometheus/Grafana, Datadog, or CloudWatch.

## Scaling

The current stack is single-server. To scale horizontally:

1. Move PostgreSQL and Redis to managed services (AWS RDS / ElastiCache, etc.).
2. Use S3 for `STORAGE_TYPE` instead of the local `uploads` volume.
3. Run multiple `web` and `api` containers behind a load balancer.
4. Ensure all instances share the same `JWT_SECRET` and `COOKIE_DOMAIN`.

## Updating the Application

To deploy a new version:

```bash
git pull origin main
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

Run migrations if needed:

```bash
docker compose -f docker-compose.prod.yml exec api sh -c "cd apps/api && npx prisma migrate deploy"
```

## Troubleshooting

- **502 Bad Gateway**: API or Web container is not ready. Check `docker compose -f docker-compose.prod.yml logs api web`.
- **Database connection errors**: Verify `DATABASE_URL` and that the `postgres` container is healthy.
- **Mixed content warnings**: Ensure `STORAGE_BASE_URL` uses HTTPS and matches the public domain.
- **Images not loading**: Check `nginx` logs and verify `nginx/ssl/cert.pem` and `key.pem` exist.

## Support

For development setup, see `README.md`. For release details, see `RELEASE_NOTES_v1.0.0.md`.
