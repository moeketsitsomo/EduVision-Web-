# EduVision School CMS — Release Notes v1.0.0

**Release Date:** 2026-07-25
**Tag:** `v1.0.0`
**Status:** Production-ready

## Overview

EduVision School CMS v1.0.0 is a production-ready, multi-tenant platform that gives every school its own professional public website, secure admin dashboard, and isolated database records. The super admin can create schools and auto-provision their admin accounts and websites.

## What Is Included

### Public Website

- Responsive public website with school branding, colors, logo, favicon, and dark/light mode.
- Dynamic CMS pages: Home, About, Principal's Message, Vision & Mission, School History, Staff, Academics, Admissions, School Fees, School Uniform, Sports, Gallery, News, Events, Downloads, Contact Us, Emergency Contacts, and Social Media.
- Latest news and upcoming events widgets on the home page.
- Multi-tenant routing by subdomain, custom domain, or `x-school-slug` header.

### Admin Dashboard

- Secure login with JWT and httpOnly cookies.
- Role-based access control: `SUPER_ADMIN`, `SCHOOL_ADMIN`, `SCHOOL_STAFF`.
- Generic CRUD manager for pages, posts/news, events, staff, galleries, downloads, school fees, contacts, social links, and navigation.
- Media library for uploading logos, photos, videos, PDFs, newsletters, and policies.
- School settings and branding page for colors, logo, favicon, contact details, meta description, and dark mode.
- Audit logs for all admin actions.

### Super Admin

- Platform statistics: total schools, users, pages, posts, media.
- Recent activity feed.
- School list with status and subscription.
- Create school form with optional auto-provisioned school admin account.
- Suspend and activate schools.

### Production Deployment

- Docker Compose production stack (`docker-compose.prod.yml`).
- Nginx reverse proxy with SSL termination and static file serving.
- Self-signed first-boot certificate and Let's Encrypt automation scripts.
- PostgreSQL 16 and Redis 7 services.
- Local file storage with S3-ready abstraction.
- Environment variable configuration.
- Security hardening: Helmet, CSP, rate limiting, CORS, bcrypt, JWT, RBAC, Prisma parameterized queries.
- Health endpoint at `/api/health`.
- Backup strategy documentation.

## Quick Links

- Installation and development setup: [README.md](README.md)
- Production deployment: [DEPLOYMENT.md](DEPLOYMENT.md)
- Environment template: [.env.example](.env.example)

## Deployment

```bash
cp .env.example .env
# edit .env with your domain and secrets
./scripts/deploy.sh
./scripts/init-ssl.sh yourdomain.com www.yourdomain.com
```

Run migrations and seed on first boot:

```bash
docker compose -f docker-compose.prod.yml exec api sh -c "cd apps/api && npx prisma migrate deploy"
docker compose -f docker-compose.prod.yml exec api npx ts-node apps/api/prisma/seed.ts
```

## Default Credentials

- Super admin: `superadmin@eduvision.local` / `SuperAdmin123!` (school slug `platform`)
- Demo school admin: `admin@demo-school.edu` / `SchoolAdmin123!` (school slug `demo-school`)

Change all default credentials immediately after first login.

## Known Limitations / Future Modules

This release includes the core CMS and production deployment foundation. The following modules are architected for future releases:

- Parent, Teacher, and Learner portals
- Online Admissions
- Results and Reports
- Attendance and Timetable
- AI Chatbot
- SMS and Email Notifications
- Online Payments
- Library, Hostel, and Transport Management

## Verification

- `npx tsc --noEmit` passes in `apps/api` and `apps/web`.
- `npm run build` succeeds in `apps/web`.
- End-to-end browser verification completed for public site, admin login, CRUD, media upload, settings, and super admin school creation.
- Multi-tenant isolation verified via subdomain and header-based requests.

## Support

For deployment questions, see [DEPLOYMENT.md](DEPLOYMENT.md). For local development, see [README.md](README.md).
