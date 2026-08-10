# EduVision School Website v1.5.0 — Release Notes

**Release Date:** 2026-08-09

**Product:** EduVision School Website + School Website Administration Dashboard

## Overview

v1.5.0 refocuses the product on a professional, easy-to-manage public school website with a simple no-code admin dashboard. Full ERP/CMS modules have been removed from the school-facing experience and will be considered for a separate future product. EduVision AI remains an independent product and is not included in this repository.

## What's New

### Public Website

- Hero, welcome message and principal message are now controlled from the School Website Builder.
- Academics page draws curriculum highlights and timetable information from school settings.
- Admissions page draws requirements, required documents, important dates and fee information from school settings.
- Open Graph image is configurable for social sharing.
- Removed the public Portal link from the main navigation.

### No-Code School Website Builder

A redesigned `/admin/settings` page now groups all website controls into simple sections:

- Branding
- Logo, Favicon & Banner
- Home Page
- About the School
- Academics
- Admissions
- Contact Information
- School Statistics
- Facilities, Departments & Awards
- Policies & Documents

Administrators can type, paste, upload and save. No HTML, CSS, GitHub, terminal or database access is required.

### Admin Dashboard Simplification

- Removed ERP/CMS resources from the school admin sidebar and dashboard.
- Retained public-website resources: Subjects, Pages, News, Events, Staff, Galleries, Documents, Contacts, Contact Requests, Social Links, Navigation, Users and Admissions.
- Updated dashboard icons to match the reduced resource set.

### API Simplification

- Removed module imports for students, results, attendance, timetable, library, borrowings, finance, communication, reports, subscriptions, invoices, licences, audit logs and leads from `apps/api/src/app.module.ts`.
- Removed the global `AuditInterceptor` and `SubscriptionGuard` providers so school websites are not blocked by subscription or audit state.
- Added new content fields to the `School` Prisma model and generated the corresponding migration.
- Extended `UpdateSchoolDto` to accept the new website-builder fields.

### Desktop Installers

- Linux `.deb` and `.AppImage`.
- Windows `.exe` NSIS installer.
- Admin dashboard is available at `http://localhost:3000/admin` in the desktop build.
- Fixed `Failed to fetch site: 403` when the desktop window loaded `127.0.0.1` by resolving IP addresses to the default school slug.
- All installers include the updated Docker Compose package and source.

## Verification

- `npx tsc --noEmit` passed in `apps/api` and `apps/web`.
- `npm run build` passed for both apps.
- Desktop `.deb` installed and launched end-to-end on a clean-equivalent Ubuntu system.
- PostgreSQL, Redis, API (`/health`) and web (`http://localhost:3000`) all started automatically.

## Multi-Tenancy

Each school continues to have isolated branding, content, staff, news, events, gallery, documents, contacts, social links and settings. A school administrator cannot modify another school's website.

## Known Limitations

- Full ERP/CMS features (student management, attendance, timetable, finance, library, etc.) are intentionally not exposed in this release.
- The desktop app requires Docker; it is not a standalone binary.

## Download

- Production ZIP: included in this release.
- Installers: `.deb`, `.AppImage`, `.exe`.

## Upgrade Notes

If upgrading from v1.4.x, run migrations with:

```bash
docker compose -f docker-compose.prod.yml up -d migrations
```

or let the desktop app run migrations automatically on first launch.
