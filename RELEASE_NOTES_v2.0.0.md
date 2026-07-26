# EduVision School Website v2.0.0 — Desktop Public App

## Overview

This release transforms `EduVision-Web` into a standalone desktop product for the public school website.

- New `apps/desktop` Electron shell.
- Auto-starts local API (port 4000) and Next.js web server (port 3000).
- Opens the school website in its own application window.
- Blocks admin/CMS routes in the desktop runtime.
- Adds Ubuntu `.desktop` launcher install script and Windows batch starter.
- Updates the public website middleware to disable `/admin` and `/setup` when `DISABLE_ADMIN=true`.

## Repository split

- `EduVision-Web` (this repo) = public school website desktop app.
- `EduVision-Admin` (future repo) = CMS for principals, teachers and admin staff.

## How to run

```bash
docker compose up -d postgres redis
npm install --legacy-peer-deps
npm run build --workspace=@eduvision/api
npm run build --workspace=web
npm run desktop:start
```

## Known limitations

- This branch still contains the legacy CMS source code until it is extracted into `EduVision-Admin`.
- The desktop app currently requires Node.js and PostgreSQL/Redis locally; a fully bundled installer is planned.
- `electron-builder` packaging for `.deb`, `.AppImage` and `.exe` is configured but not yet fully verified.
