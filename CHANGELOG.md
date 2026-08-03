# Changelog

All notable changes to the EduVision School Website Platform are documented in this file.

## [1.3.1] — Desktop Packaging Fix

### Fixed

- Desktop `.deb` installer now installs into `/opt/EduVision-School-Website/` (no spaces) so the launcher and `.desktop` `Exec` path work correctly.
- Set `linux.executableName` to `eduvision-desktop` and `.desktop` `Name` to `EduVision School Website` for a clean application menu entry.
- Rebuilt `.deb`, `.AppImage` and `.exe` installers for v1.3.1.

## [1.3.0] — Desktop Public App

### Added

- New `apps/desktop` Electron shell for the public school website.
- Auto-start local API (port 4000) and Next.js web server (port 3000).
- Standalone application window with desktop menu and icon.
- Ubuntu `.desktop` entry installer (`scripts/desktop-install-ubuntu.sh`).
- Windows batch starter (`scripts/desktop-start.bat`).
- `DISABLE_ADMIN` middleware that redirects `/admin`, `/setup`, etc. to `/` when running the public desktop build.
- Electron `session` default `x-school-slug` header for tenant resolution.
- `postbuild` step to copy static assets into Next.js standalone output.

### Changed

- `EduVision-Web` continues to contain both the public website and the School CMS; they are logically separated by route and authentication.
- Added CMS modules for Timetable, Library, Finance, Communication and Reports.
- Added Prisma models and API endpoints for `TimetableEntry`, `Book`, `Borrowing`, `FinanceTransaction`, `Communication` and `Report`.
- Added admin resource configuration for new CMS modules with navigation and dashboard cards.
- Improved desktop app: splash screen, EduVision icon/branding, Docker Compose auto-start for PostgreSQL/Redis/API, and one-click launch.
- Added Linux `.AppImage` and `.deb` installers plus Windows `.exe` installer.

## [1.2.0] — Launch Readiness

### Added

- First-run setup wizard at `/setup` for new installations.
- System Health dashboard at `/admin/health` with database, Redis, storage and memory checks.
- Storage usage reporting by school and media type.
- Backup status reporting with age, size and freshness checks.
- Redis-backed cache service with public endpoint caching.
- Marketing site with landing page, pricing page, demo request and contact sales pages.
- Lead capture API (`/api/leads`) for demo and sales enquiries.
- Expanded demo seed dataset: pages, posts, staff, events, contacts, socials, fees, notices, students, attendance, gallery and downloads.
- Additional database indexes for performance.

### Changed

- Replaced `bcrypt` with `bcryptjs` to remove native dependency vulnerabilities.
- Upgraded NestJS packages to v11 and Express to v5.
- Updated `next.config.mjs` to disable `poweredByHeader` and browser source maps.
- Lazy-load images and improve accessibility labels.

### Fixed

- Resolved all `npm audit` vulnerabilities to 0 known issues.
- Updated Dockerfiles to use `npm ci --legacy-peer-deps`.
- Fixed Nginx routing for `/public/` and protected `/uploads/private/`.

## [1.1.0] — Commercial Features

### Added

- Real file uploads to local storage or S3-compatible services.
- Daily automated backups for PostgreSQL and uploads.
- Password reset via SMTP.
- TOTP two-factor authentication.
- Audit logging for every administrator action.
- Production error logging with Winston.
- School modules: Students, Notices, Online Admissions, Results, Attendance and School Calendar.
- Portals: Parent, Teacher and Learner.
- Business modules: Subscriptions, Licences, Invoices, Trials and Expired Subscription handling.
- Provider deployment guides for Ubuntu, DigitalOcean, Hetzner, AWS and Azure.

### Changed

- Improved security headers and rate limiting.
- Hardened file upload validation.

## [1.0.0] — Foundation

### Added

- Multi-tenant public school website.
- Secure admin dashboard with full CRUD for pages, posts, events, staff, media, downloads, fees, contacts, socials and navigation.
- Super Admin dashboard to create and manage schools.
- JWT authentication with role-based access control.
- PostgreSQL database with Prisma ORM.
- Docker Compose production stack with Nginx and self-signed SSL.
- Initial README and deployment documentation.
