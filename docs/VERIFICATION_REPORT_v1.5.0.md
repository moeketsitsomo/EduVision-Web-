# EduVision School Website v1.5.0 — Verification Report

Date: 2026-08-09
Version: 1.5.0

## 1. Build Verification

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` in `apps/api` | Passed |
| `npx tsc --noEmit` in `apps/web` | Passed |
| `npm run build --workspace=@eduvision/api` | Passed |
| `npm run build --workspace=web` | Passed |
| `npm run desktop:build` (Linux .deb + AppImage) | Passed |
| `npx electron-builder --win` (Windows .exe) | Passed |

## 2. Desktop Installer Verification

- Package: `eduvision-desktop_1.5.0_amd64.deb`
- Install command: `sudo dpkg -i eduvision-desktop_1.5.0_amd64.deb`
- Install path: `/opt/EduVision-School-Website/`
- Executable: `/usr/bin/eduvision-desktop`

### Clean-start test

1. Removed previous package and user data.
2. Installed the `.deb`.
3. Ran `eduvision-desktop`.
4. The splash screen appeared and automatically:
   - verified Docker installation,
   - built the `migrations`, `api` and `web` Docker images,
   - started PostgreSQL, Redis, migrations, API and web containers,
   - waited for `/health` and `http://localhost:3000` to respond,
   - opened the school website window.

### Health checks

- `curl http://127.0.0.1:4000/health` returned `{"status":"ok"}`.
- `curl -I http://127.0.0.1:3000` returned `HTTP/1.1 200 OK`.

## 3. Application Scope Verification

- EduVision AI was not modified and is not part of this repository.
- ERP/CMS modules (students, results, attendance, timetable, library, borrowings, finance, communication, reports, subscriptions, invoices, licences) are no longer imported into the API module graph and are hidden from the school admin UI.
- The school admin dashboard only exposes public-website resources and the new School Website Builder in **Settings**.
- Multi-tenant isolation remains: each school has its own branding, content, users and data.

## 4. Public Website Coverage

The public website includes:

- Home page with hero, welcome message, statistics, principal message, mission/vision/values, latest news, upcoming events, awards, staff preview, subjects and gallery preview.
- About page with history, at-a-glance statistics, mission/vision/values, facilities, staff directory, policies/prospectus and awards.
- Academics page with subjects, curriculum and timetable information.
- Admissions page with online application form, requirements, documents, dates, fees and contact details.
- News, Events, Gallery, Contact, Calendar and Notices pages.
- Responsive layout, SEO metadata, Google Maps integration and school branding.

## 5. No-Code Admin Dashboard Coverage

The School Website Builder in `/admin/settings` allows a school administrator to edit:

- School name, website title, colours, logo, favicon, banner, Open Graph image and footer text.
- Hero title/description, hero CTA button, welcome title/message and principal message.
- About: established year, history, mission, vision, values.
- Academics overview, curriculum highlights and timetable information.
- Admissions overview, requirements, required documents, important dates and fee information.
- Contact details, address, office hours and Google Maps URL.
- Statistics (learners, teachers, classrooms, pass rate).
- Facilities, departments, awards and policies overview.

All fields are saved to the `School` record and appear immediately on the public website.

## 6. Signatures

SHA-256 checksums are provided in `SHA256SUMS.txt`.
