# EduVision School Website Platform — Release Notes v1.2.0

**Release date:** 2026-07-25

## Overview

v1.2.0 is the Launch Readiness release. It hardens the platform for commercial use with dependency security updates, performance improvements, production caching, a first-run setup wizard, a system health dashboard, storage and backup reporting, a professional marketing site and complete user, administrator and installation documentation.

## New in v1.2.0

### Security and Performance

- Replaced `bcrypt` with `bcryptjs` to remove native compilation and transitive `tar` vulnerabilities.
- Upgraded NestJS to v11 and Express to v5.
- Resolved all `npm audit` vulnerabilities to 0 known issues.
- Added Prisma database indexes for frequently queried fields (`schoolId`, `subscriptionStatus`, `trialEndsAt`, `role`, `isPublished`, etc.).
- Implemented Redis-backed caching for public endpoints (`/public/site`, `/public/notices`, `/public/calendar`, `/public/pages/:slug`) with a 60-second TTL.
- Disabled `poweredByHeader` and production browser source maps.
- Added lazy loading to images and accessibility labels for icon buttons.

### Administration

- First-run setup wizard at `/setup` for new installations.
- System Health dashboard at `/admin/health` showing database, Redis, storage, memory and backup status.
- Storage usage reporting by school and media type.
- Backup status reporting with last backup age, total size and individual backup files.

### Business and Marketing

- Professional landing page for the EduVision platform.
- Online pricing page at `/pricing`.
- Request a Demo page at `/demo`.
- Contact Sales page at `/contact`.
- Lead capture API (`POST /api/leads`) storing enquiries securely outside the public upload path.

### Content

- Greatly expanded the demo school seed dataset with pages, news, staff, events, contacts, social links, fees, notices, students, attendance, gallery and downloads.

### Documentation

- `USER_MANUAL.pdf` and source markdown.
- `ADMINISTRATOR_GUIDE.pdf` and source markdown.
- `INSTALLATION_GUIDE.pdf` and source markdown.
- `API_DOCUMENTATION.md`.
- `CHANGELOG.md`.

## Deployment

- Updated `docker-compose.prod.yml` to mount backups read-only into the API container for status reporting.
- Fixed backup container command to run without `chmod` on a read-only mount.
- Updated Nginx configuration to deny access to `/uploads/private/`.

## Verification

- `npx tsc --noEmit` passes in `apps/api` and `apps/web`.
- `npm run build` passes in `apps/api` and `apps/web`.
- Docker production stack builds and starts successfully.
- Public site, admin login, CRUD, file upload/download, multi-tenant isolation, 2FA setup, subscription expiry and backup procedures verified.

## Upgrade Notes

If upgrading from v1.1.0:

```bash
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

Migrations will run automatically. Review the new environment variables in `.env.example`:

- `REDIS_URL` — required for caching.
- `DEFAULT_SCHOOL_SLUG` — fallback for unresolved hosts.
- `NEXT_PUBLIC_PLATFORM_HOSTS` — hosts that show the marketing landing page.

## Support

For deployment help, see `DEPLOYMENT.md`, `INSTALLATION_GUIDE.pdf` and the provider guides in `docs/deployment/`.
