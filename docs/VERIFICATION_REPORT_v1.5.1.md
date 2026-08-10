# Verification Report — EduVision School Website v1.5.1

**Date:** 2026-08-10
**Test environment:** Ubuntu 22.04, Docker 27.4.1, Node 20, PostgreSQL 16, Redis 7
**Package tested:** `eduvision-desktop_1.5.1_amd64.deb`

## Root Cause of v1.5.0 Failure

A clean installation started the web and API services, but `GET /public/site` returned `403` with `School tenant not found or inactive.` because the previous `demo-school` seed was removed and no first-run mechanism created an active `School` record. Without an active tenant, the public website, admin login and all `/public/*` endpoints failed.

## Fix Summary

- Added a public first-run wizard (`/setup`) and `SetupController` (`GET /setup/status`, `POST /setup`, `POST /setup/upload`).
- `TenantService.resolveFromRequest` now falls back to `DEFAULT_SCHOOL_SLUG` or the first active school.
- Public middleware returns `{ setupRequired: true }` when no active school exists.
- Web middleware redirects public routes to `/setup` until a school is created.
- Admin login no longer requires a school slug for single-school setups.
- `SchoolsService.update` clears the API cache so public site changes are live.

## Clean-Install Test Results

| Step | Result |
|------|--------|
| Install `.deb` with `dpkg -i` | Passed |
| Launch `eduvision-desktop` | Passed |
| Docker images built automatically | Passed |
| PostgreSQL started and became healthy | Passed |
| Redis became ready | Passed |
| API `/health` returned `{"status":"ok"}` | Passed |
| Web server responded on port 3000 | Passed |
| First-run `/setup` screen displayed | Passed |
| Create school via `POST /setup` | Passed |
| `/` returned public website (no 403) | Passed |
| Admin login via `/admin/login` | Passed |
| School Website Builder (`/admin/settings`) loaded | Passed |
| Update school name and colour | Passed |
| Public website reflected changes immediately | Passed |

## API Endpoint Verification

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /public/site` | 200 | Returns active school data after setup |
| `GET /public/notices` | 200 | Empty array when no notices exist |
| `GET /public/calendar` | 200 | Empty array when no events exist |
| `GET /public/pages/:slug` | 404 when page does not exist | Correct behaviour; 200 once a page is created |

## TypeScript / Build Verification

- `npx tsc --noEmit` passed in `apps/api`.
- `npx tsc --noEmit` passed in `apps/web`.
- `npm run build` passed for `@eduvision/api`.
- `npm run build` passed for `web`.
- Docker Compose desktop stack built and ran successfully on a fresh volume.

## Conclusion

The v1.5.1 clean-install first-run flow works end-to-end. The product now creates the active school tenant through a no-code wizard and the public website reflects admin changes immediately.
