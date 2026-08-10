# EduVision School Website + Admin Dashboard — Administrator Guide

Version 1.5.0

This guide is for platform owners and school administrators who manage the EduVision School Website product.

## 1. Product Overview

EduVision School Website is a professional, multi-tenant public school website with a no-code administration dashboard. Each school gets its own branding, content, staff, news, events, gallery and contact details. School administrators can manage everything through forms and uploaders without coding.

## 2. Super Admin Access

Login at `/admin/login` with the super admin account created during setup or the first-run wizard. The super admin can create schools and platform-wide users.

## 3. System Health Dashboard

Navigate to **System Health** from the admin sidebar to view:

- API and database status
- Redis connectivity
- Storage disk usage
- Memory and CPU load averages
- Backup status and age
- Storage usage per school and per media type

## 4. Creating and Managing Schools

### Create a School

1. Go to **Super Admin**.
2. Click **New School**.
3. Enter the school name, slug, contact details and colours.
4. Optionally create an admin account for the school.
5. Save. The school's website and dashboard are provisioned immediately.

### Manage Schools

- Suspend or reactivate schools from the school list.
- Schools are isolated by tenant. Data from one school is never visible to another.

## 5. School Admin Dashboard

School administrators see a simplified dashboard with only public-website resources:

- **Subjects** — list grades and subjects offered.
- **Pages** — create custom public pages.
- **News** — publish school news articles.
- **Events** — add calendar events.
- **Staff** — add staff and leadership profiles.
- **Galleries** — create photo and video albums.
- **Documents** — upload policies, prospectus and forms.
- **Contacts** — manage contact directory entries.
- **Contact Requests** — view messages submitted through the public contact form.
- **Social Links** — add social media links for the footer.
- **Navigation** — control public menu items.
- **Users** — create school admin and parent accounts.
- **Admissions** — review and update online admission applications.
- **Settings** — the School Website Builder for branding and all public content.

## 6. Media Library

1. Go to **Media Library**.
2. Upload images, videos and documents.
3. Organise by category or album.
4. Copy URLs and paste them into Settings, Pages, Staff or Galleries.

## 7. Storage and Backups

### Storage Reporting

- **System Health > Storage Usage** shows total usage, usage per school and usage per media type.
- Each school has a `maxStorageMb` limit.

### Backup Status

- The backup service is run automatically by the `backup` Docker container once per day.
- It dumps the PostgreSQL database and archives the `uploads` directory.
- **System Health > Backups** lists recent backups, sizes and age.
- Backups older than `BACKUP_RETENTION_DAYS` are removed automatically.

### Manual Backup and Restore

Run the backup script manually:

```bash
docker compose -f docker-compose.prod.yml exec backup backup.sh
```

Restore a database backup:

```bash
cd /backups
zcat eduvision-db-DATE.sql.gz | psql -h localhost -U eduvision -d eduvision
```

Restore uploads:

```bash
cd /
tar -xzf /backups/eduvision-uploads-DATE.tar.gz
```

## 8. User and Role Management

- Super admins can view and edit all users from the **Users** module.
- School admins only see and manage users in their own school.
- Roles:
  - `SUPER_ADMIN` — full platform access
  - `SCHOOL_ADMIN` — manage one school's public website
  - `PARENT` — optional portal access

## 9. Monitoring and Alerts

- The `/health` endpoint returns a basic status.
- The `/health/detailed` endpoint returns database, Redis, storage and memory checks.
- Prometheus metrics are available at `/metrics`.
- Configure external uptime monitoring to poll `/health`.

## 10. Security

- HTTPS with TLS 1.2+
- Passwords hashed with bcrypt
- JWT authentication in httpOnly cookies
- Role-based access control
- Helmet security headers
- Rate limiting on login and general API
- File type and size validation on uploads
- SQL injection protection via Prisma ORM
- XSS protection through output encoding
- CSRF protection through same-site cookies and origin checks

## 11. Scaling

- Run multiple API replicas behind Nginx for horizontal scaling.
- Use an external Redis instance for shared caching.
- Use S3-compatible storage for media to remove local disk dependency.
