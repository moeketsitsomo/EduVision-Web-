# EduVision School Website — School Setup Guide

This guide walks a new school through initial setup from a fresh EduVision installation.

---

## 1. Choose how to run EduVision

### Option A: Docker (recommended for schools with an Ubuntu server)
- Install Docker and Docker Compose.
- Copy `.env.example` to `.env` and edit.
- Run `./scripts/deploy.sh`.
- Nginx with SSL is configured automatically.

### Option B: Desktop application (Windows / Ubuntu)
- Download `EduVision-School-Website-v1.4.1-Production.zip`.
- Install the `.deb`, `.AppImage` or `.exe`.
- Launch **EduVision School Website** from the applications menu or desktop.
- The app auto-starts PostgreSQL, Redis, API and web services via Docker.

### Option C: Manual installation
- Install Node.js 20, PostgreSQL 16 and Redis.
- Configure `.env` with `DATABASE_URL` and `REDIS_URL`.
- Run `npm install --legacy-peer-deps`, `npm run db:migrate`, `npm run build` and start the services.

---

## 2. Initial environment configuration

Copy `.env.example` to `.env` and set at minimum:

```bash
# Database
DATABASE_URL=postgresql://eduvision:your-db-password@localhost:5432/eduvision?schema=public

# API & web
API_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com
API_PORT=4000
WEB_PORT=3000

# Storage
STORAGE_BASE_URL=https://yourdomain.com
STORAGE_LOCAL_ROOT=uploads

# JWT (generate long random strings)
JWT_SECRET=change-me-to-a-long-random-string
TOTP_SECRET=change-me-to-a-32-char-secret-for-2fa

# Email (for password reset and notifications)
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM=noreply@yourdomain.com

# Default school for development
DEFAULT_SCHOOL_SLUG=your-school
```

---

## 3. Run the platform for the first time

### Docker
```bash
./scripts/deploy.sh
```

The script builds images, runs migrations and seeds a super admin and demo school.

### First-time setup wizard
If the database is empty, open `https://yourdomain.com/setup` and create:
- Platform super admin account.
- First school.

---

## 4. Create your school

1. Log in as super admin at `/admin/login`.
2. Go to **Super Admin > Schools**.
3. Click **New**.
4. Fill in:
   - `name` — school name.
   - `slug` — unique URL slug.
   - `isActive` — true.
   - `subscriptionStatus` — ACTIVE.
   - `plan` — BASIC, STANDARD or ENTERPRISE.
5. Save.

The school is now reachable by `https://<slug>.yourdomain.com` or `https://yourdomain.com?schoolSlug=<slug>`.

---

## 5. Add a school admin

1. Go to **CMS > Users** while logged in as super admin and viewing the new school.
2. Create a user with:
   - `email`: admin@yourschool.edu
   - `role`: SCHOOL_ADMIN
   - `firstName`, `lastName`
3. Set a temporary password or use the password-reset flow.
4. Log out and log in as the school admin.

---

## 6. Configure school branding

1. Log in as school admin.
2. Go to **CMS > Settings**.
3. Set:
   - `websiteTitle`
   - `primaryColor` and `secondaryColor`
   - `logoUrl` and `bannerImageUrl`
   - `footerText`
   - `principalName` and `principalMessage`
   - `mission`, `vision`, `values`
   - `history`, `enrollmentCount`, `teacherCount`, `classroomCount`, `passRate`
   - `facilities` (one per line) and `awards` (year and title)
   - `contactPhone`, `contactEmail`, `admissionsPhone`, `admissionsEmail`
   - `address`, `officeHours`, `googleMapsUrl`
4. Save and refresh the public website.

---

## 7. Add public pages

1. Go to **CMS > Pages**.
2. Create or edit:
   - About Us
   - School History
   - Academics
   - Admissions
   - School Fees
   - School Uniform
   - Sports
   - Contact Us
   - News
   - Events
   - Gallery
3. Use `menuOrder` to control menu position.
4. Toggle `showInMenu` to hide internal pages.

---

## 8. Upload media and documents

1. Go to **CMS > Media Library**.
2. Upload the school logo, banner, staff photos and event images.
3. Assign categories such as `Leadership`, `Sports`, `2026 Events`.
4. For policies and prospectus, go to **CMS > Downloads** and upload documents.
5. Use the public URLs in Settings, Pages and Posts.

---

## 9. Add staff and leadership

1. Go to **CMS > Staff**.
2. Add each staff member:
   - Name, role, department, email.
   - Photo URL from the Media Library.
   - Bio.
   - Order and `isPublished`.
3. The public About page groups staff by department and highlights leadership roles.

---

## 10. Configure news, events and galleries

- **News:** write articles under **CMS > News**.
- **Events:** add calendar events under **CMS > Events**.
- **Galleries:** create albums and ensure the public Gallery page renders them.

---

## 11. Set up admissions

1. Edit the public **Admissions** page with your requirements and fees.
2. The `/admissions` page contains the online application form.
3. Submissions are managed in **CMS > Admissions Management**.

---

## 12. Parent/Learner Portal

1. Create parents and learners under **CMS > Users**.
2. For parents, set `role = PARENT` and link to the learner via `studentId` if needed.
3. For learners, set `role = LEARNER` and `studentNumber`.
4. Parents log in at `/portal/login` to view notices, calendar, attendance, homework and reports.

---

## 13. Domain and SSL

### With Docker and Nginx
- Update `nginx/default.conf` with your domain.
- Run `./scripts/ssl.sh` to generate or renew Let's Encrypt certificates.
- Set `COOKIE_DOMAIN=.yourdomain.com` so subdomains share auth.

### Desktop application
- The desktop app runs on `http://localhost:3000`.
- For Internet access, publish the web container behind Nginx with SSL.

---

## 14. Backups

Run `./scripts/backup.sh` daily. It creates:
- PostgreSQL dump.
- `uploads/` archive.
- `.env` backup.

Store backups off-site.

---

## 15. Next steps

- Review the **Administrator Manual** for daily tasks.
- Share the **Parent User Guide** and **Teacher User Guide** with users.
- Read the **Technical Architecture Guide** for deployment details.
