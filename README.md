# EduVision School Website Platform

A production-ready, multi-tenant School Website Content Management System. Every school gets its own public website, secure admin dashboard, branding, and isolated data. A super admin dashboard provisions new schools and their admin accounts automatically.

Built for commercial deployment: VPS, dedicated server, or any cloud provider.

## Features

- Public school website with dynamic CMS pages: Home, About, Principal's Message, Vision & Mission, History, Staff, Academics, Admissions, School Fees, Uniform, Sports, Gallery, News, Events, Downloads, Contact, Emergency Contacts, Social Media.
- Secure admin dashboard with full CRUD for pages, posts, events, staff, galleries, downloads, fees, contacts, social links, navigation, and users.
- Media library for logos, photos, videos, PDFs, newsletters, and policies.
- School branding: colors, logo, favicon, dark mode, custom domain support.
- Super admin dashboard with platform statistics, audit logs, and one-click school creation with auto-provisioned admin accounts.
- Multi-tenant isolation: each school has its own data, users, branding, and domain.
- JWT authentication, bcrypt password hashing, role-based access control, audit logs, rate limiting, CSP, and security headers.
- Mobile-responsive, accessible UI with dark and light mode.

## Technology Stack

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS 4 + shadcn/ui v4
- **Backend**: NestJS 10 + Prisma 5 + PostgreSQL 16
- **Reverse Proxy / SSL**: Nginx + Certbot (Let's Encrypt)
- **Containerization**: Docker Compose
- **Authentication**: JWT, bcrypt, Passport, httpOnly cookies
- **Security**: Helmet, CORS, rate limiting, CSP, XSS/CSRF protection, audit logs, RBAC

## Quick Start (Local Development)

### Prerequisites

- Node.js 20
- Docker and Docker Compose
- npm

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

The default `.env.example` is configured for local development (`API_URL=http://localhost:4000`, `STORAGE_BASE_URL=http://localhost:4000`).

### 3. Start PostgreSQL and Redis

```bash
docker compose up -d postgres redis
```

### 4. Run Migrations and Seed the Database

```bash
cd apps/api
npx prisma migrate dev
npx ts-node prisma/seed.ts
cd ../..
```

### 5. Start the Development Servers

In separate terminals:

```bash
# Terminal 1 - API
cd apps/api && npm run dev   # http://localhost:4000

# Terminal 2 - Web
cd apps/web && npm run dev   # http://localhost:3000
```

### 6. Log In

- **Super admin**: `superadmin@eduvision.local` / `SuperAdmin123!` (school slug: `platform`)
- **Demo school admin**: `admin@demo-school.edu` / `SchoolAdmin123!` (school slug: `demo-school`)

> Change all default credentials immediately after first login.

## Production Deployment

For the complete production deployment guide, see [DEPLOYMENT.md](DEPLOYMENT.md).

The short version:

```bash
cp .env.example .env
# edit .env with real secrets and domain
./scripts/deploy.sh
```

Then apply real SSL:

```bash
./scripts/init-ssl.sh yourdomain.com www.yourdomain.com
```

## Environment Variables

Copy `.env.example` to `.env` and configure at minimum:

| Variable | Purpose |
|---|---|
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | Long random string for JWT signing |
| `COOKIE_DOMAIN` | Root domain with leading dot, e.g. `.eduvisionschools.co.za` |
| `STORAGE_BASE_URL` | Public HTTPS domain for uploaded files |
| `API_URL` | Public API base URL |

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full environment reference.

## Project Structure

```
eduvision/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   ├── prisma/
│   │   └── Dockerfile
│   └── web/                 # Next.js frontend
│       ├── src/
│       ├── public/
│       └── Dockerfile
├── nginx/
│   ├── default.conf         # Nginx reverse proxy config
│   └── ssl/                 # SSL certificates
├── scripts/
│   ├── deploy.sh            # One-command production deploy
│   ├── init-selfsigned.sh   # Generate self-signed cert for first boot
│   └── init-ssl.sh          # Obtain Let's Encrypt certificate
├── docker-compose.yml       # Development stack
├── docker-compose.prod.yml  # Production stack
├── .env.example             # Environment template
├── README.md                # This file
├── DEPLOYMENT.md            # Production deployment guide
└── RELEASE_NOTES_v1.0.0.md  # Release notes
```

## Type Checking and Building

```bash
# API
cd apps/api && npx tsc --noEmit

# Web
cd apps/web && npx tsc --noEmit

# Production web build
cd apps/web && npm run build
```

## Backups

See [DEPLOYMENT.md](DEPLOYMENT.md) for automated database and file backup instructions.

## Monitoring and Scaling

The platform is stateless except for PostgreSQL, Redis, and the `uploads` volume. To scale horizontally, move the database and cache to managed services and use S3 for file storage. Details in [DEPLOYMENT.md](DEPLOYMENT.md).

## Future Modules

The architecture supports adding: Parent Portal, Teacher Portal, Learner Portal, Online Admissions, Results, Attendance, Timetable, AI Chatbot, SMS/Email Notifications, Online Payments, Library Management, Hostel Management, and Transport Management.

## License

Copyright © 2026 EduVision. All rights reserved.
