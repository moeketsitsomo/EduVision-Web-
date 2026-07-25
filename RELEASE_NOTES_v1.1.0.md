# EduVision v1.1.0 Release Notes

**Release Date:** 2026-07-25

## Summary
EduVision v1.1.0 adds the commercial features required to deploy the platform to real schools: production file uploads, automated backups, password reset, two-factor authentication, audit/error logging, school and business modules, subscription enforcement, and provider-specific deployment guides.

## High Priority Infrastructure
- **Real file uploads** for logos, photos, PDFs, newsletters, policies, gallery images and videos with local or S3-compatible storage (AWS S3, DigitalOcean Spaces, MinIO, Wasabi, Azure Blob).
- **Automated daily database backups** with `pg_dump`, gzip compression, uploads archive, and retention cleanup.
- **Password reset via email** with secure hashed tokens and SMTP configuration.
- **Two-factor authentication (TOTP)** for Super Admin and any admin user, with QR code setup.
- **Audit logs** for every administrator action, including IP and user agent.
- **Production error logging** with Winston (`error.log` / `combined.log`) and a global exception filter.
- **Security hardening**: Helmet, CORS, rate limiting, bcrypt, role-based access, tenant isolation, and subscription/expired account enforcement.
- **Performance optimization**: compression, Redis-ready cache wiring, Prometheus `/metrics` endpoint, and Nginx static file serving.
- **Database migration scripts**: Prisma migration `20260725071514_phase2` plus `scripts/migrate.sh` for production.
- **Automated health monitoring**: `/health` and `/metrics` endpoints and production backup service.

## School Modules
- **Online Admissions**: public admission form and admin application management.
- **Parent / Teacher / Learner Portal**: role-based portal with notices, calendar, results and attendance.
- **School Notices**: targeted notices by audience (All, Parents, Teachers, Learners, Staff).
- **School Calendar**: public calendar from the events module.
- **Results Portal**: results management with publication control.
- **Attendance Module**: daily attendance tracking per learner.
- **Students** module with parent contact linking.

## Business Modules
- **Subscription management** with plans, billing cycles, auto-renew and trial handling.
- **School license management** with seat counts and validity dates.
- **Billing and invoicing** with tax, status and due dates.
- **Trial accounts** created automatically for every new school.
- **Expired subscription handling** enforced at login, in admin APIs, and on public sites.

## Deployment
Added provider-specific deployment guides:
- Ubuntu Server
- DigitalOcean (including Spaces)
- Hetzner Cloud (including Storage Box backups)
- AWS (RDS + S3)
- Azure (PostgreSQL Flexible Server + Blob Storage)

See `docs/deployment/` and `DEPLOYMENT.md` for full instructions.

## Migration
Run `npx prisma migrate deploy` or `./scripts/migrate.sh` against the production database before starting the v1.1.0 services.

## Known Limitations
- Payment gateway integration is not yet implemented; invoices are generated manually and paid status is tracked in the dashboard.
- SMS notifications are stubbed; email notifications work via SMTP.
- Advanced timetable and AI chatbot are planned for v1.2.0.

## Verification
- `npx tsc --noEmit` passes in `apps/api` and `apps/web`.
- `npm run build` passes in `apps/web`.
- Production Docker stack builds and starts.
- Multi-tenant public sites, admin CRUD, media uploads, auth, 2FA and subscriptions verified.
