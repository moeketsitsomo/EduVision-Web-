# EduVision School Website — Technical Architecture Guide

## Products

EduVision consists of three independent products:

1. **EduVision AI** — separate repository; offline AI learning, books, OCR, AI tutor, quizzes.
2. **EduVision School Website** (`EduVision-Web` repository) — public website + parent/learner portal.
3. **EduVision School CMS** (`EduVision-Web` repository) — administrative system for staff.

`EduVision-Web` contains both the School Website and School CMS in one repository but they are logically separated by route, authentication and navigation.

---

## Repository layout

```
EduVision-Web
├── apps/
│   ├── api/                 # NestJS API
│   ├── web/                 # Next.js 15 public website + CMS
│   └── desktop/             # Electron desktop launcher
├── nginx/                   # Nginx reverse-proxy config
├── scripts/                 # Deploy, backup, restore, SSL helpers
├── docker-compose.yml       # Development / desktop stack
├── docker-compose.prod.yml # Production stack
└── docs/                    # User and technical guides
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS 4, shadcn/ui |
| API | NestJS 11, Prisma 5, PostgreSQL 16, Redis 7 |
| Auth | JWT access tokens, role-based guards |
| Storage | Local filesystem (`uploads/`) or AWS S3-compatible |
| Desktop | Electron with Docker Compose auto-start |
| Proxy | Nginx with SSL (production) |

---

## Logical separation

| Concern | Public Website | School CMS |
|---------|----------------|------------|
| Routes | `/`, `/about`, `/admissions` ... | `/admin` and `/admin/*` |
| Auth | Optional parent/learner login on `/portal/login` | School admin/teacher login on `/admin/login` |
| Entry layout | `PublicShell` with school nav | `Shell` with CMS sidebar |
| Data fetch | `fetchSite()` + public endpoints | `apiFetch()` + authenticated endpoints |
| Multi-tenancy | Resolved by `Host`, `x-school-slug` or `?schoolSlug` | Same tenant resolution plus JWT role check |

The desktop public build can set `DISABLE_ADMIN=true` to redirect `/admin` and `/setup` to `/`.

---

## Multi-tenancy

The API `TenantMiddleware` resolves a school from:
1. `Host` subdomain, e.g. `demo-school.localhost`.
2. `x-school-slug` header.
3. `?schoolSlug=<slug>` query parameter.
4. `DEFAULT_SCHOOL_SLUG` environment variable.

All Prisma queries are scoped to the resolved `schoolId`.

---

## Authentication

- `POST /auth/login` returns a JWT access token.
- Token payload contains `sub`, `email`, `role`, `schoolId`.
- `JwtAuthGuard` validates the token.
- `RolesGuard` checks the `Roles` decorator against `UserRole`.
- CMS routes are protected.
- Public pages read from the tenant without a token.

---

## Storage

Local storage places files under `uploads/<schoolId>/<folder>/<uuid>.<ext>`.
The API returns URLs built from `STORAGE_BASE_URL`.

In production:
- Set `STORAGE_BASE_URL=https://yourdomain.com`.
- Nginx serves `/uploads` from the `uploads` volume.
- Or use S3 by setting `STORAGE_TYPE=s3` and the AWS keys.

Images are compressed on upload (max 1920 px, JPEG/PNG/WebP/AVIF) using `sharp`.

---

## Database

Prisma schema includes models for:
- `School`, `User`, `Student`, `Staff`, `Subject`, `Page`, `Post`, `Event`, `Gallery`, `GalleryItem`, `Media`, `Download`, `ContactMessage`, `AdmissionApplication`, `Notice`, `Attendance`, `Result`, `TimetableEntry`, `Book`, `Borrowing`, `FinanceTransaction`, `Communication`, `Report`, `Invoice`, `Subscription` and audit tables.

Migrations are in `apps/api/prisma/migrations/` and applied with `prisma migrate deploy`.

---

## API structure

| Module | Route | Purpose |
|--------|-------|---------|
| Public | `/public/*` | Unauthenticated public website data |
| Portal | `/portal/*` | Parent/learner authenticated data |
| Auth | `/auth/*` | Login, password reset, 2FA |
| Schools | `/schools` | School CRUD |
| Users | `/users` | User management |
| Students | `/students` | Learner records |
| Staff | `/staff` | Staff directory |
| Subjects | `/subjects` | Subject catalog |
| Pages | `/pages` | CMS pages |
| Posts | `/posts` | News |
| Events | `/events` | Calendar |
| Galleries | `/galleries` | Albums |
| Media | `/media` | File uploads |
| Downloads | `/downloads` | Documents |
| Contacts | `/contacts` | School contact directory |
| Contact Messages | `/contact-messages` | Public contact form submissions |
| Admissions | `/admissions` | Applications |
| Attendance | `/attendance` | Registers |
| Results | `/results` | Marks |
| Timetable | `/timetable` | Schedules |
| Library | `/library` | Books and borrowings |
| Finance | `/finance` | Transactions |
| Communication | `/communication` | Messages |
| Reports | `/reports` | Generated reports |
| Subscriptions | `/subscriptions` | Billing |
| Audit Logs | `/audit-logs` | Audit trail |
| Super Admin | `/super-admin/*` | Platform health and licensing |

---

## Desktop application

`apps/desktop/src/main.js`:
- Displays a splash screen.
- Checks API and web health on `localhost`.
- Starts PostgreSQL, Redis, API and web via `docker-compose.desktop.yml` if services are not running.
- Injects `x-school-slug` header for every request.
- Loads `http://localhost:3000` in an Electron window.
- Disables `/admin` when `DISABLE_ADMIN=true`.

Installers are built with `electron-builder`:
- Ubuntu `.deb`
- Linux `.AppImage`
- Windows `.exe`

---

## Deployment modes

### Development
```bash
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

### Production Docker
```bash
cp .env.example .env
# edit .env
./scripts/deploy.sh
```

### Desktop
```bash
npm run desktop:build
# installers appear in apps/desktop/dist/
```

---

## Environment variables

Key variables are documented in `.env.example`. Important ones:
- `DATABASE_URL`, `REDIS_URL`
- `API_PORT`, `WEB_PORT`
- `API_URL`, `NEXT_PUBLIC_API_URL`
- `STORAGE_BASE_URL`, `STORAGE_TYPE`
- `JWT_SECRET`, `TOTP_SECRET`
- `EMAIL_*`
- `DEFAULT_SCHOOL_SLUG`

---

## Scaling

- Run multiple API container replicas behind Nginx.
- Use managed PostgreSQL and Redis.
- Use S3-compatible object storage for files.
- Cache public site data in Redis (60 seconds by default).
- Offload image optimization to Next.js built-in image endpoint or a CDN.

---

## Security

- `helmet` and CORS configuration in the API.
- `express-rate-limit` and NestJS `Throttler` for brute-force protection.
- Role-based access control on every CMS endpoint.
- Prisma queries scoped by `schoolId`.
- Audit interceptor logs writes.
- `.env` secrets are never committed.

---

## Monitoring

- `/health` returns `{"status":"ok"}`.
- `/health/detailed` returns database, Redis and storage status (super admin).
- Prometheus metrics are exposed for scraping.
- Logs are written to `logs/`.

---

## Upgrading

1. Back up the database and `uploads/`.
2. Pull the new release.
3. Run `npm install --legacy-peer-deps`.
4. Run `npm run db:migrate`.
5. Run `npm run build` for both `apps/api` and `apps/web`.
6. Restart services.

---

## Further reading

- `ADMINISTRATOR_MANUAL.md`
- `SCHOOL_SETUP_GUIDE.md`
- `PARENT_USER_GUIDE.md`
- `TEACHER_USER_GUIDE.md`
