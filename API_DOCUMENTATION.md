# EduVision API Documentation

Version 1.2.0

Base URL: `https://yourdomain.com/api`

Authentication: JWT token returned in an `access_token` httpOnly cookie, or sent as `Authorization: Bearer <token>` header.

## Authentication

### POST /auth/login

Login and receive an access token.

**Body:**

```json
{
  "email": "admin@demo-school.edu",
  "password": "SchoolAdmin123!",
  "schoolSlug": "demo-school"
}
```

**Response:**

```json
{
  "access_token": "eyJ...",
  "user": { "id": "...", "email": "...", "role": "SCHOOL_ADMIN" }
}
```

### POST /auth/register

Register a new user (super admin only).

### POST /auth/forgot-password

Request a password reset email.

### POST /auth/reset-password

Reset password using token from email.

### POST /auth/2fa/setup

Enable two-factor authentication. Returns a QR code.

### POST /auth/2fa/verify

Verify a TOTP code during login.

## Tenant Resolution

Public and portal endpoints resolve the school by:

1. `x-school-slug` header
2. `x-school-id` header
3. `?schoolSlug` query parameter
4. `Host` header (first subdomain or custom domain)

## Public Endpoints

### GET /public/site

Returns the full school site payload: school, pages, posts, staff, events, galleries, downloads, contacts, socials, fees, navigation and notices.

### GET /public/notices?audience=...

Returns notices for an optional audience.

### GET /public/calendar

Returns published events.

### GET /public/pages/:slug

Returns a single published page.

### POST /public/admissions

Submit an online admission application.

## Admin CRUD Endpoints

All admin endpoints require a valid JWT and appropriate role.

| Resource | Base Path |
|----------|-----------|
| Schools | `/schools` |
| Users | `/users` |
| Pages | `/pages` |
| Posts | `/posts` |
| Staff | `/staff` |
| Events | `/events` |
| Galleries | `/galleries` |
| Media | `/media` |
| Downloads | `/downloads` |
| Contacts | `/contacts` |
| Social Links | `/socials` |
| School Fees | `/fees` |
| Navigation | `/navigation` |
| Students | `/students` |
| Notices | `/notices` |
| Admissions | `/admissions` |
| Results | `/results` |
| Attendance | `/attendance` |
| Subscriptions | `/subscriptions` |
| Invoices | `/invoices` |
| Licences | `/licenses` |

Each supports standard REST patterns:

- `GET /` — list
- `GET /:id` — retrieve
- `POST /` — create
- `PATCH /:id` — update
- `DELETE /:id` — delete

## Super Admin Endpoints

Require `SUPER_ADMIN` role.

### GET /super-admin/stats

Platform statistics including school, user and invoice counts.

### GET /super-admin/activity

Recent audit log activity.

### GET /super-admin/storage

Storage usage grouped by school and media type.

### GET /super-admin/backups

Backup directory listing and freshness status.

## Health and Monitoring

### GET /health

Basic status check.

### GET /health/detailed

Detailed health: database, Redis, storage and memory.

### GET /metrics

Prometheus metrics.

## Setup

### GET /setup/status

Returns `{ setupRequired: true|false }`.

### POST /setup

Create the platform school and first super admin. Only works when setup is required.

**Body:**

```json
{
  "email": "superadmin@eduvision.local",
  "password": "SuperAdmin123!",
  "firstName": "Super",
  "lastName": "Admin"
}
```

## Leads

### POST /leads

Store a demo request or sales enquiry.

**Body:**

```json
{
  "type": "demo",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "school": "Example Primary",
  "phone": "+27 ...",
  "message": "We are interested in the Premium plan."
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request / validation error |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — invalid subscription, role or tenant |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

## Pagination and Filtering

List endpoints accept standard Prisma-style query parameters where implemented by the service layer. Refer to the controller source for exact supported filters.
