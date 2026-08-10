# EduVision School Website — School Setup Guide

Version 1.5.0

This guide walks a school administrator through setting up and managing a professional public school website with no coding.

---

## 1. Choose how to run EduVision

### Option A: Server deployment (recommended for public access)
- Install Docker and Docker Compose on Ubuntu 22.04/24.04.
- Copy `.env.example` to `.env` and edit.
- Run `./scripts/deploy.sh`.
- Nginx with SSL is configured automatically.

### Option B: Desktop application (Ubuntu / Windows)
- Download `EduVision-School-Website-v1.5.0-Production.zip`.
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

# Email (for password reset)
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
5. Save.

The school is now reachable by `https://<slug>.yourdomain.com` or `https://yourdomain.com?schoolSlug=<slug>`.

---

## 5. Add a school admin

1. Go to **Users** while logged in as super admin and viewing the new school.
2. Create a user with:
   - `email`: admin@yourschool.edu
   - `role`: SCHOOL_ADMIN
   - `firstName`, `lastName`
3. Set a temporary password or use the password-reset flow.
4. Log out and log in as the school admin.

---

## 6. Build your public website with the School Website Builder

1. Log in as school admin.
2. Go to **Settings** in the admin sidebar.
3. Use the no-code School Website Builder to update:
   - **Branding:** school name, website title, primary/secondary colours, logo, favicon, banner, Open Graph image, footer text.
   - **Home Page:** hero title and description, hero button text and link, welcome title and message, principal name and message.
   - **About:** established year, history, mission, vision and values.
   - **Academics:** overview, curriculum highlights (one per line), timetable information.
   - **Admissions:** overview, requirements (one per line), required documents, important dates, fee information.
   - **Contact:** general and admissions email/phone, address, office hours, Google Maps embed URL.
   - **Statistics:** learners, teachers, classrooms and pass rate.
   - **Facilities, Departments & Awards:** lists (one per line) and awards (title with optional year in brackets).
   - **Policies:** policies overview text.
4. Save. Every change appears immediately on the public website.

---

## 7. Add public pages

1. Go to **Pages**.
2. Create or edit pages such as:
   - About Us
   - Academics
   - Admissions
   - School Fees
   - School Uniform
   - Sports
   - Contact Us
3. Use `menuOrder` to control menu position.
4. Toggle `showInMenu` to hide internal pages.

---

## 8. Upload media and documents

1. Go to **Media Library**.
2. Upload the school logo, banner, staff photos and event images.
3. Assign categories such as `Leadership`, `Sports`, `2026 Events`.
4. For policies and prospectus, go to **Documents** and upload PDFs.
5. Copy the generated URLs and paste them into Settings, Pages, Posts or Staff records.

---

## 9. Add staff and leadership

1. Go to **Staff**.
2. Add each staff member:
   - Name, role, department, email.
   - Photo URL from the Media Library.
   - Bio.
   - Order and `isPublished`.
3. The public About page groups staff by department and highlights leadership roles.

---

## 10. Configure news, events and galleries

- **News:** write articles under **News**.
- **Events:** add calendar events under **Events**.
- **Galleries:** create albums and ensure the public Gallery page renders them.

---

## 11. Set up admissions

1. Edit the admissions information in **Settings > Admissions**.
2. The `/admissions` page contains the online application form.
3. Submissions are managed in **Admissions**.

---

## 12. Configure navigation and social links

- **Navigation:** add or reorder public menu items.
- **Social Links:** add Facebook, Instagram, YouTube, X and other social media links. They appear in the footer.
- **Contact Directory:** add general, admissions and emergency contact numbers.

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

## 14. Multi-school isolation

Each school has its own:
- Branding, colours, logo and banner.
- Content, pages, posts, events, gallery and staff.
- Contact details and social links.
- Users and settings.

A school administrator can only edit the school they belong to.

---

## 15. Backups

Run `./scripts/backup.sh` daily. It creates:
- PostgreSQL dump.
- `uploads/` archive.
- `.env` backup.

Store backups off-site.

---

## 16. Next steps

- Review the **Administrator Manual** for daily tasks.
- Read the **Technical Architecture Guide** for deployment details.
