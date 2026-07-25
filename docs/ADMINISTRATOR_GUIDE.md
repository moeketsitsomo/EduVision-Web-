# EduVision School Website Platform — Administrator Guide

Version 1.2.0

This guide is for platform owners and super administrators who manage the EduVision system and onboard schools.

## 1. Super Admin Access

Login at `/admin/login` with the super admin account created during setup or the first-run wizard. The default super admin email and password are configured during installation.

## 2. System Health Dashboard

Navigate to **System Health** from the admin sidebar to view:

- API and database status
- Redis connectivity
- Storage disk usage
- Memory and CPU load averages
- Backup status and age
- Storage usage per school and per media type

## 3. Creating and Managing Schools

### Create a School

1. Go to **Super Admin**.
2. Click **New School**.
3. Enter the school name, slug, contact details, colours and plan.
4. Optionally create an admin account for the school.
5. Save. The school's website and dashboard are provisioned immediately.

### Manage Schools

- Suspend or reactivate schools from the school list.
- Schools are isolated by tenant. Data from one school is never visible to another.

## 4. Subscriptions, Licences and Billing

### Subscriptions

- Each school has a subscription with a plan, status and billing cycle.
- Statuses: Active, Trial, Suspended, Cancelled, Expired.
- When a subscription expires, the school website returns a subscription-inactive message.

### Invoices

- Create invoices for schools with line items, due date and tax.
- Mark invoices as Sent, Paid, Overdue or Cancelled.

### Licences

- Generate licence keys for enterprise or offline activation.
- Link licences to schools and set seat limits and expiry dates.

## 5. Storage and Backups

### Storage Reporting

- **System Health > Storage Usage** shows total usage, usage per school and usage per media type.
- Each school has a `maxStorageMb` limit. Schools approaching their limit should upgrade or delete old media.

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

## 6. User and Role Management

- Super admins can view and edit all users from the **Users** module.
- Roles:
  - `SUPER_ADMIN` — full platform access
  - `SCHOOL_ADMIN` — manage one school
  - `SCHOOL_STAFF` — manage content and media
  - `TEACHER` — results and attendance
  - `PARENT` and `LEARNER` — portal access

## 7. Audit Logs

Every mutating API request is recorded in the audit log with:

- Action and entity
- User ID and school ID
- IP address and user agent
- Timestamp

View recent activity from the **Super Admin** dashboard or query the `AuditLog` table directly.

## 8. Monitoring and Alerts

- The `/health` endpoint returns a basic status.
- The `/health/detailed` endpoint returns database, Redis, storage and memory checks.
- Prometheus metrics are available at `/metrics`.
- Configure external uptime monitoring to poll `/health`.

## 9. Security

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

## 10. Lead Management

Demo requests and sales enquiries submitted through `/demo` and `/contact` are stored in `uploads/private/leads/`. Access to this directory is blocked by Nginx.

## 11. Scaling

- Run multiple API replicas behind Nginx for horizontal scaling.
- Use an external Redis instance for shared caching.
- Use S3-compatible storage for media to remove local disk dependency.
- Use a managed PostgreSQL service for database scaling.

## 12. Troubleshooting

| Issue | Solution |
|-------|----------|
| School cannot log in | Verify subscription status and user `isActive` flag. |
| API returns 403 for public site | Check school slug, custom domain or `subscriptionStatus`. |
| Backups not appearing | Ensure the `backup` container is running and `BACKUP_DIR` is writable. |
| Redis errors | Verify `REDIS_URL` and that the Redis container is healthy. |

## 13. Maintenance Windows

- Apply migrations during low-traffic windows.
- Restart containers one at a time when scaling behind a load balancer.
- Test restores on a staging environment before production.
