# EduVision School Website Platform — Release Notes v1.2.1

**Release date:** 2026-07-25

## Overview

Patch release v1.2.1 fixes the Docker port configuration so the Next.js web container always listens on port 3000 while the NestJS API remains on port 4000, regardless of any shared `.env` variables.

## Fixes

- Replaced the single `PORT` environment variable with separate `API_PORT` (default 4000) and `WEB_PORT` (default 3000).
- Updated `apps/api/src/main.ts` to read `API_PORT` first, with `PORT` as a fallback, and default to 4000.
- Updated `docker-compose.prod.yml` to set `PORT` per service from `API_PORT`/`WEB_PORT` and to derive the internal `API_URL` from `API_PORT`.
- Updated `.env.example` and `.env` to use `API_PORT` and `WEB_PORT`.
- Updated `DEPLOYMENT.md` environment variable reference table.
- Bumped `package.json` versions to `1.2.1`.

## Verification

- `npx tsc --noEmit` passes in `apps/api` and `apps/web`.
- `npm run build` passes in both apps.
- Docker Compose production stack builds and starts.
- Confirmed `eduvision-api-1` container has `PORT=4000` and `eduvision-web-1` has `PORT=3000`.
- `/api/health`, public site, admin login and multi-tenant routing verified.

## Upgrade Notes

If upgrading from v1.2.0:

```bash
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

Review `.env.example` and update your `.env` to use `API_PORT` and `WEB_PORT` instead of `PORT`.
