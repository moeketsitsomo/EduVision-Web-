# EduVision School Website Platform

A production-ready, multi-tenant School Website CMS. Each school gets its own public website, admin dashboard, branding, and isolated data. Super admin can create schools and provision their sites automatically.

## Stack

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS 4 + shadcn/ui v4
- **Backend**: NestJS 10 + Prisma 5 + PostgreSQL
- **Reverse Proxy / SSL**: Nginx + Certbot (Let's Encrypt)
- **Containerization**: Docker Compose
- **Authentication**: JWT, bcrypt, Passport, httpOnly cookies
- **Security**: Helmet, rate limiting, CORS, CSP, XSS/CSRF protection, audit logs, role-based access

## Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment and configure secrets
cp .env.example .env

# 3. Start PostgreSQL and Redis
docker compose up -d postgres redis

# 4. Run migrations and seed
cd apps/api && npx prisma migrate dev && npx ts-node prisma/seed.ts

# 5. Start API and Web (from repo root in separate terminals)
cd apps/api && npm run dev      # http://localhost:4000
cd apps/web && npm run dev      # http://localhost:3000
```

Default credentials:

- Super admin: `superadmin@eduvision.local` / `SuperAdmin123!` (school slug: `platform`)
- Demo school admin: `admin@demo-school.edu` / `SchoolAdmin123!` (school slug: `demo-school`)

> Change all default credentials immediately after first login.

## Production Deployment

See [DEPLOY.md](DEPLOY.md) for the full production guide, including:

- Docker Compose production stack
- Nginx reverse proxy + SSL (Let's Encrypt)
- PostgreSQL, Redis, and file storage
- Environment variables and security hardening
- Backup and monitoring recommendations

The short version:

```bash
cp .env.example .env
# edit .env with real secrets and domains
./scripts/deploy.sh
```

## Features

- Public school website with dynamic CMS pages, news, events, staff, fees, downloads, gallery, contacts
- Secure admin dashboard with full CRUD for every module
- Media library for logos, photos, videos, PDFs, newsletters, policies
- School branding: colors, logo, favicon, dark mode, custom domain support
- Super admin dashboard to create, suspend, and manage schools
- Multi-tenant isolation: each school has its own data, users, and branding
- Audit logs and role-based permissions
- Mobile-responsive, accessible UI

## Future Modules

The architecture supports adding: Parent/Teacher/Learner portals, online admissions, results, attendance, timetable, AI chatbot, SMS/email notifications, payments, library/hostel/transport management.

## License

Copyright © 2026 EduVision. All rights reserved.
