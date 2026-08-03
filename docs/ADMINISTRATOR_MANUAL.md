# EduVision School Website — Administrator Manual

## Overview
EduVision School Website is a multi-tenant school website and CMS platform. A single installation can host many schools, each with its own public website, branding, and admin CMS.

This manual is for **school administrators** and **super administrators** who manage schools, users, content and settings.

---

## Logging in

1. Open the public website in a browser.
2. Navigate to `/admin/login` (e.g. `https://localhost/admin/login`).
3. Enter your email and password.
4. Super admins log in on the platform slug (`platform`) or any school.
5. School admins log in on their school's domain or slug.

Default test accounts (change immediately):
- **Super admin:** `superadmin@eduvision.local` / `SuperAdmin123!`
- **School admin:** `admin@demo-school.edu` / `SchoolAdmin123!`

---

## CMS Dashboard

After login you see the School CMS dashboard. It contains:
- Summary cards for students, staff, subjects, admissions, etc.
- Quick navigation to every CMS module.
- Theme toggle and logout.

---

## Public Website Modules

The CMS controls the public school website.

### Pages
- Create/edit pages such as About, Admissions, School Fees, etc.
- Set `slug`, `title`, `content` and `menuOrder`.
- Toggle `isPublished` to hide a page from the public menu.

### News (Posts)
- Write school news articles.
- Use `isPublished` and `publishedAt` to schedule articles.
- A featured image URL can be added for cards.

### Events
- Add sports days, parent meetings and cultural events.
- Set `startAt`, `endAt`, `location` and `allDay`.
- Events appear on the public calendar and events page.

### Staff Directory
- Add teachers, management and support staff.
- Set `department` to group staff on the public About page.
- Upload a `photoUrl` and control `isPublished`.

### Downloads
- Upload PDFs, fee schedules, policies and prospectus documents.
- Use `category` = `policy` or `prospectus` so they appear on the About page.
- Documents can be linked from pages and footers.

### Contacts
- Manage the school's public contact directory.
- Types include `office`, `emergency`, `admissions`, etc.
- These numbers appear on the Contact and Emergency pages.

### Social Links
- Add Facebook, Instagram, X (Twitter), LinkedIn and YouTube links.
- Links appear in the public footer.

### Navigation
- Reorder or hide public menu items.
- `label` is the menu text and `href` is the path.

---

## Admissions

### Public application form
- Parents complete the online admissions form on `/admissions`.
- Submissions appear in **CMS > Admissions Management**.

### Admissions Management dashboard
- View all applications with filters: Pending, Approved, Rejected, Waiting List.
- Search by student name, parent name or grade.
- Update status inline.
- Export the current view to **CSV** (opens in Excel) or **PDF**.
- Add notes to each application.

---

## Contact Requests

- Public visitors submit the Contact form.
- Submissions appear in **CMS > Contact Requests**.
- Mark requests as read/unread and delete spam.
- This module is separate from the school contact directory.

---

## Media Library

- Upload images, videos, documents and audio.
- Assign a `category` during upload (e.g. `Sports`, `2026 Events`).
- Filter by type and category.
- Preview images and videos in the table.
- Copy the public URL or delete files.
- Images are automatically resized and compressed on upload (max 1920 px, JPEG/PNG/WebP/AVIF).

---

## Galleries (Albums)

- Create albums under **CMS > Galleries**.
- Albums can represent years, terms or events.
- The public Gallery page displays albums with cover images.
- Each album shows its media items on a dedicated lightbox view.

---

## Students, Attendance, Results, Timetable, Finance, Library, Communication, Reports

These modules are present in the CMS and are expanded in v1.5.0.
- **Students:** learner profiles and parent links.
- **Attendance:** daily registers per grade/class.
- **Results:** academic results and reports.
- **Timetable:** class and teacher schedules.
- **Finance:** transactions, invoices and fee records.
- **Library:** books, borrowings and catalog.
- **Communication:** internal messages and notices.
- **Reports:** generated school reports.

---

## School Settings & Branding

Go to **CMS > Settings** to configure:
- School name, address, contact phone and email.
- Primary and secondary colours.
- Logo, favicon and banner image URLs.
- Principal name and principal's welcome message.
- Mission, vision, values, history and facilities.
- School statistics (enrolment, teachers, pass rate).
- Office hours and Google Maps embed URL.
- Footer text and social media links.

Uploads use `STORAGE_BASE_URL` (configured in `.env`). In production this should be `https://yourdomain.com` and Nginx must serve the `/uploads` path.

---

## Users & Roles

- **SUPER_ADMIN:** manages the whole platform, schools and subscriptions.
- **SCHOOL_ADMIN:** full control of one school.
- **SCHOOL_STAFF / TEACHER:** limited access to academics, attendance, etc.
- **PARENT / LEARNER:** access the Parent/Learner Portal, not the CMS.

Create users under **CMS > Users**. Link a parent user to a student record for portal access.

---

## Multi-tenancy

Each school is isolated by:
- `Host` header (subdomain), e.g. `demo-school.eduvision.local`.
- `x-school-slug` request header.
- `?schoolSlug=` query parameter.
- `DEFAULT_SCHOOL_SLUG` environment variable for development.

Schools cannot see each other's data.

---

## Common Tasks

### Change the school logo
1. Go to **CMS > Media Library** and upload a logo.
2. Copy the file URL.
3. Go to **CMS > Settings** and paste it into `logoUrl`.
4. Save. Refresh the public website.

### Publish a news article
1. Go to **CMS > News**.
2. Click **New**, fill in title and content.
3. Set `publishedAt` and `isPublished = true`.
4. Save. It appears on the public News page.

### Process an admission application
1. Go to **CMS > Admissions Management**.
2. Click **View** on the application.
3. Change `Status` to `ACCEPTED`, `REJECTED` or `WAITLISTED`.
4. Add notes and save.

### Export admissions
1. Filter and search the admissions list.
2. Click **Export Excel** for a CSV file.
3. Click **Export PDF** to open a printable report.

---

## Security

- Always change default passwords after installation.
- Use HTTPS in production.
- Keep `.env` secrets safe and out of version control.
- The public website cannot access `/admin` without authentication.
- Desktop public builds can set `DISABLE_ADMIN=true` to hide the CMS entirely.

---

## Support

For technical issues, check the **System Health** page (super admins) or review the `logs/` directory.
