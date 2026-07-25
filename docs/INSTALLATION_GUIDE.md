# EduVision School Website Platform — Installation Guide

Version 1.2.0

## 1. Requirements

- Ubuntu 22.04/24.04 LTS or equivalent Linux server
- Docker 24+ and Docker Compose v2
- A domain name (for production)
- At least 2 GB RAM and 20 GB disk

## 2. Clone the Repository

```bash
git clone https://github.com/moeketsitsomo/EduVision-Web-.git
cd EduVision-Web-
```

## 3. Environment Configuration

Copy the example environment file and edit it:

```bash
cp .env.example .env
nano .env
```

Required values:

- `POSTGRES_PASSWORD` — a strong database password
- `JWT_SECRET` — a long random string
- `TOTP_SECRET` — at least 32 random characters
- `COOKIE_DOMAIN` — e.g. `.eduvisionschools.co.za` for production
- `STORAGE_BASE_URL` — public URL for uploads, e.g. `https://eduvisionschools.co.za`
- `NEXT_PUBLIC_PLATFORM_HOSTS` — comma-separated hosts that show the marketing site

Optional but recommended:

- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` — for password reset emails
- `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_ENDPOINT` — for S3-compatible media storage

## 4. Start the Production Stack

```bash
docker compose -f docker-compose.prod.yml up -d
```

This starts:

- PostgreSQL
- Redis
- API (NestJS)
- Web (Next.js)
- Nginx reverse proxy with HTTPS
- Certbot for Let's Encrypt certificates
- Daily backup container

## 5. Initial Setup

Visit `https://yourdomain/setup` and create the platform super admin account. This only works when no `platform` school exists.

Alternatively, seed the database with demo data:

```bash
docker compose -f docker-compose.prod.yml exec api sh -c "cd apps/api && npx tsx prisma/seed.ts"
```

## 6. HTTPS Certificates

Run the SSL helper with your domain:

```bash
./scripts/init-ssl.sh eduvisionschools.co.za
```

Certbot will request a certificate and configure Nginx. Replace `eduvisionschools.co.za` with your domain.

## 7. School Onboarding

1. Login as super admin.
2. Go to **Super Admin > New School**.
3. Fill in school details and choose a plan.
4. The school website is available at `https://schoolslug.yourdomain.com`.
5. Share the admin login URL with the school.

## 8. Updating

Pull the latest code and restart:

```bash
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

Migrations run automatically when the `migrations` container starts.

## 9. Ubuntu Server without Docker

For a native Ubuntu installation:

1. Install Node.js 20, PostgreSQL 16 and Redis.
2. Create a PostgreSQL database and user.
3. Set `DATABASE_URL` and `REDIS_URL` in `.env`.
4. Run `npm install --legacy-peer-deps` at the repository root.
5. Run `npm run db:generate` and `npm run db:migrate`.
6. Build with `npm run build --workspace=@eduvision/api` and `npm run build --workspace=web`.
7. Start the API with `node apps/api/dist/src/main.js` and the web app with `node apps/web/server.js`.
8. Configure Nginx as a reverse proxy using `nginx/default.conf` as a template.
9. Run `certbot` for SSL.

## 10. Verification

After installation verify:

- `https://yourdomain/api/health` returns `{"status":"ok"}`
- The marketing site loads at the root domain.
- A school subdomain resolves and shows the correct school.
- Admin login works.
- File uploads and downloads work over HTTPS.

## 11. Support

For issues, review the logs:

```bash
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f web
```

See `DEPLOYMENT.md` for provider-specific instructions (DigitalOcean, Hetzner, AWS, Azure).
