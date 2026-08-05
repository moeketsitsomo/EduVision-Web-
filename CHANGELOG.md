# Changelog

All notable changes to the EduVision School Website Platform are documented in this file.

## [1.4.1] — Desktop Startup Reliability

### Fixed

- Desktop app now reliably detects Docker installation, Docker daemon state and Docker Compose availability before attempting startup.
- Desktop startup waits explicitly for PostgreSQL, Redis, API health (`http://localhost:4000/health`) and web server (`http://localhost:3000`) before opening the main window.
- Improved error reporting with clear messages for: Docker not installed, Docker daemon not running, Docker Compose missing, port conflicts, `docker compose up` failures, PostgreSQL/Redis/API/web startup failures and timeout reasons.
- Desktop `main.js` now captures and logs stdout/stderr from Docker Compose and surfaces the actual failure cause to the user.
- Removed broken Node-services fallback in packaged builds; Docker is required and reported clearly when unavailable.
- Health checks use `127.0.0.1` explicitly to avoid IPv6 resolution issues.
- Removed unused `electron-is-dev` dependency from the desktop package.

## [1.4.0] — Professional Public School Website (Production Ready)

### Added

- New `contact-messages` CMS module with `GET`, `PATCH` (mark read), `POST` and `DELETE` endpoints.
- Dedicated **Admissions Management** dashboard with status filters (Pending, Approved, Rejected, Waiting List), search, inline status updates, notes and CSV / PDF export.
- `category` field on `Media` with migration, API filter and media library category selection.
- Video preview support and category filtering in the **Media Library**.
- Server-side image compression on upload using `sharp` (max 1920 px, JPEG/PNG/WebP/AVIF).
- Administrator Manual, School Setup Guide, Parent User Guide, Teacher User Guide and Technical Architecture Guide.

### Changed

- `.env.example` and `.env` now default `STORAGE_BASE_URL` to `http://localhost:4000` for local development with clear production guidance.
- All `https://localhost` media URLs in the demo database were migrated to `http://localhost:4000/uploads/...` so uploads display correctly.
- Removed `via.placeholder.com` references and replaced placeholder downloads with real policy/prospectus documents.
- New public-facing `apps/web` pages: professional home page, about school, academics, admissions, news & events, gallery and contact.
- Public multi-school branding with configurable primary/secondary colours, logo, banner, footer text, social links and contact information.
- Large animated hero banner, principal’s welcome message, mission/vision/values, animated school statistics, featured news, upcoming events, school achievements and call-to-action buttons on the home page.
- About school page with history, at-a-glance stats, facilities, awards/achievements, staff directory grouped by department and school management tab.
- Academics page with subjects, curriculum, timetable information and academic calendar events.
- Admissions page with online application form, requirements, required documents, school fees and admissions office contact.
- Parent / Learner Portal with secure login, learner information, dashboard overview cards, notifications, attendance donut chart, results bar chart, reports, notices, homework and report-card download.
- News & Events listing, individual news article pages, gallery page and contact page with Google Maps integration.
- Media Centre with photo/video gallery, album covers, year-based grouping, lightbox preview and lazy-loaded images.
- School Information sections: staff directory, departments, policies/prospectus downloads, governing body and emergency contacts.
- `Subject` module with NestJS CRUD and admin resource manager.
- `ContactMessage` model and `POST /public/contact` endpoint for public contact form submissions.
- `POST /public/admissions` endpoint for online admission applications.
- Admin settings page extended to edit all public website / branding fields, including logo uploader and colour theme fields.
- `loading.tsx`, `error.tsx` and `not-found.tsx` pages for better UX.
- `generateMetadata` on the home page for SEO with Open Graph image support.
- CSS animations (`fade-in-up`, `fade-in`) and a `CountUp` component for animated statistics.
- Prisma schema extended with public website fields (`mission`, `vision`, `values`, `history`, `facilities`, `awards`, `officeHours`, `googleMapsUrl`, etc.).

### Changed

- Modernised UI/UX across public pages: improved responsive spacing, typography, card hover effects, shadows, icons and mobile navigation.
- Refreshed `Header`, `Footer` and `PublicNav` with active link highlighting, social icons, quick links and emergency contact sections.
- `PublicShell` applies per-school branding variables to all public pages.
- Public navigation cleaned to a fixed set of core links with mobile sheet and overflow handling.
- Contact form and admissions form styled with success states.
- CMS admin navigation remains separate from the public website.

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
