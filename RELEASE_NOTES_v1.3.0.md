# EduVision School Website Platform v1.3.0 — Desktop Public App

## Overview

This release adds an optional Electron desktop launcher for the public school website while keeping the public website and School CMS together in the `EduVision-Web` repository.

- New `apps/desktop` Electron shell.
- Auto-starts local API (port 4000) and Next.js web server (port 3000).
- Opens the school website in its own application window.
- Disables admin/CMS routes in the desktop runtime (`DISABLE_ADMIN=true`).
- Adds Ubuntu `.desktop` launcher install script and Windows batch starter.
- Updates the public website middleware to redirect `/admin` and `/setup` when `DISABLE_ADMIN=true`.

## Repository layout

`EduVision-Web` continues to contain both:

- Public Website (parents, learners, visitors, marketing)
- School CMS (admin, teachers, staff)

The two sections are logically separated by route and authentication. Visitors cannot access the CMS without logging in.

`EduVision AI` remains a separate, independent product.

## How to run the desktop app

```bash
# Start PostgreSQL and Redis
docker compose up -d postgres redis

# Install dependencies
npm install --legacy-peer-deps

# Build the API and web app
npm run build --workspace=@eduvision/api
npm run build --workspace=web

# Launch the desktop public app
npm run desktop:start
```

## How to install the desktop entry (Ubuntu)

```bash
npm run desktop:install
```

This creates `~/.local/share/applications/eduvision-school-website.desktop` so the app appears in the applications menu.

## Known limitations

- The desktop app currently requires Node.js and PostgreSQL/Redis locally; a fully bundled installer is planned.
- `electron-builder` packaging for `.deb`, `.AppImage` and `.exe` is configured but not yet fully verified.

## New in this update

- Added CMS modules for Timetable, Library, Finance, Communication and Reports.
- Added Prisma models and REST endpoints for `TimetableEntry`, `Book`, `Borrowing`, `FinanceTransaction`, `Communication` and `Report`.
- Added admin dashboard cards, navigation icons and generic CRUD screens for the new modules.
