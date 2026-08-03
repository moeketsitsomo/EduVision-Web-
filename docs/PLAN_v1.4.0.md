# EduVision School Website Platform — v1.4.0 Plan

**Goal:** Move from a deployable public website + CMS into a polished, school-ready product with a professional public experience, secure portals, and a richer CMS for staff.

**Scope:** `EduVision-Web` repository only. Public website and School CMS remain in the same application, logically separated by route and authentication. `EduVision AI` remains an independent product and is **not** modified.

---

## 1. Public Website Experience

Focus: make the public site feel like a modern, branded school website that parents and visitors can use on any device.

- **Modern landing page**
  - Hero section with school name, tagline, and quick CTAs.
  - Featured news, upcoming events, and notices.
  - School stats (enrollment, achievements) configurable from CMS.
- **School branding**
  - Upload logo, favicon, and banner images from CMS settings.
  - Color theme picker (primary + accent) applied to public site.
  - Custom fonts and footer/social links.
- **Responsive design**
  - Mobile-first navigation, touch-friendly galleries and calendars.
  - Accessible WCAG 2.1 AA contrast and focus states.
- **Parent / Learner portal**
  - Login by admission/student number or email.
  - Dashboard with notices, calendar, and results (if published).
  - Track online application status.
- **Public modules**
  - About / Principal's Message.
  - News with categories and search.
  - Gallery (albums + lightbox).
  - Calendar (events, holidays, exams).
  - Contact form with email routing.
  - Online admissions with form builder and document uploads.
  - Public notices board.
  - Public results (optional, link to learner portal).

## 2. School CMS Enhancements

Focus: give principals, teachers, and admins the tools to manage school data and publish content to the public site.

- **Role-based access control**
  - Roles: Super Admin, School Admin, Principal, Teacher, Staff, Finance Officer.
  - Permission matrix per module (view, create, edit, delete, publish).
- **Teacher portal**
  - Assigned classes and subjects.
  - Take attendance and enter results per class.
  - View/manage timetable entries.
  - Send notices to classes or parents.
- **Student management**
  - Bulk import/export students (CSV/Excel).
  - Student profiles, guardians, and emergency contacts.
  - Enrollment and class assignment.
- **Attendance**
  - Mark daily attendance by class or subject.
  - Absence reports and parent notifications.
- **Timetable**
  - Visual timetable builder (drag-and-drop preferred, MVP grid).
  - Conflict detection for teachers and rooms.
  - Publish class timetables to the public portal.
- **Results**
  - Define grading scales and terms.
  - Enter results by class/subject with bulk entry.
  - Generate report cards (PDF).
  - Publish results to learner/parent portal on schedule.
- **Library**
  - Catalog books, authors, categories, and copies.
  - Borrow/return tracking with due dates and overdue notifications.
- **Finance**
  - Fee structures and invoices.
  - Record payments and generate receipts (PDF).
  - Outstanding balances and reminders.
- **Communication**
  - Send SMS/email notices to parents, learners, or staff.
  - Templates and scheduled sends.
  - Delivery status log.
- **Reports**
  - Attendance, results, finance, and enrollment reports.
  - Filter by term, class, date range.
  - Export to PDF/CSV.

## 3. Desktop & Installer Improvements

- **macOS .dmg** installer.
- **Auto-updater** for `.AppImage`, `.deb`, `.exe` and `.dmg`.
- **Offline indicator** in the desktop window when services are not ready.
- **Tray icon** with quick start/stop services and open window.
- **Installer signing** guidance for Windows (code-sign cert) and macOS (notarization).

## 4. Business & Operations

- **Subscription tiers**
  - Free trial, Basic, Standard, Premium.
  - Feature matrix per tier (e.g., number of students, modules enabled).
- **Payments**
  - Integrate payment gateway (Stripe/PayPal) for subscriptions and school fees.
  - Automated invoicing and renewal reminders.
- **Licensing**
  - Per-school license keys.
  - Grace period and expired-license handling.
- **Backups & monitoring**
  - Backup/restore UI in admin dashboard.
  - Automated health checks and email alerts.

## 5. Non-Functional

- **Testing**
  - End-to-end tests for critical flows (admissions, login, CRUD, public site).
  - Unit tests for API services.
- **Performance**
  - Public page caching, image optimization, CDN support.
  - Database query review and index tuning.
- **Security**
  - Dependency audit and update cadence.
  - Rate limiting, input sanitization, and CSP headers.
- **Documentation**
  - Updated `USER_MANUAL.pdf`, `ADMINISTRATOR_GUIDE.pdf`, `INSTALLATION_GUIDE.pdf`.
  - API documentation generated from Swagger.
- **Localization**
  - i18n groundwork for English + one additional language (e.g., Afrikaans or Zulu).

---

## Suggested v1.4.0 Development Order

1. Public website branding and responsive landing page.
2. Parent / learner portal with authentication.
3. Teacher role and teacher dashboard.
4. Results and attendance modules with portal publishing.
5. Communication (SMS/email) and notices.
6. Finance payments and receipts.
7. Desktop auto-updater and macOS `.dmg`.
8. E2E test suite and documentation refresh.

---

## Notes

- No work on `EduVision AI`.
- No split of `EduVision-Web` into separate repositories.
- All CMS and public website code stays inside `EduVision-Web`.
