# EduVision School Website v1.5.0 Scope Audit

## Product direction

`EduVision School Website` becomes a **professional public school website** with a **simple, no-code school admin dashboard**.

- **Public Website**: Home, About, Academics, Admissions, News, Events, Gallery, Contact, Parent/Learner portal, responsive design, SEO, multi-school branding.
- **School Admin Dashboard**: Graphical control of branding, home page, about, academics, staff, news, events, gallery, admissions, documents, contact, website settings.
- **Out of scope for this product**: full School ERP/CMS (learner management, attendance, timetable, assessments, report cards, full finance, library borrowing, transport, hostel, analytics, audit logs, backups, role-based permissions).
- **EduVision AI remains completely separate** and must not be merged into this repository.

This audit lists the current v1.4.2 modules and the recommended action for each.

---

## Backend API modules (`apps/api/src`)

| Module | Current purpose | Recommendation | Notes |
|--------|-----------------|----------------|-------|
| `schools` | School CRUD, tenant settings, public branding data | **Keep & extend** | Core to multi-school and admin settings. Add home-page fields as needed. |
| `auth` | Login, JWT, guards | **Keep** | Required for admin and portal login. Simplify to admin/staff/parent roles; remove 2FA complexity if not essential for public website. |
| `users` | User CRUD with roles `SUPER_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `PARENT`, `LEARNER` | **Simplify / keep minimal** | Keep for admin authentication. Hide `TEACHER` and `SCHOOL_STAFF` roles from school admin UI; use only `SCHOOL_ADMIN` and `PARENT`. Remove `LEARNER` account management. |
| `students` | Full learner records | **Disable / remove** | Out of scope. Parent portal can reference a lightweight `Student` read model if required for reports. |
| `subjects` | Academic subjects | **Keep** | Admin dashboard can manage subjects for Academics page. |
| `pages` | Custom pages (About, Policies, Prospectus) | **Keep & extend** | Use for About, Admissions info, Documents/Prospectus pages. |
| `posts` | News | **Keep** | Required for News & homepage featured news. |
| `events` | Events calendar | **Keep** | Required for Events & homepage featured events. |
| `staff` | Staff directory | **Keep** | Required for Staff/Leadership pages. |
| `galleries` | Photo albums | **Keep & merge with media** | Gallery/Media centre. |
| `media` | Uploads, images, videos | **Keep** | Required for logo, banner, gallery. |
| `downloads` | Downloadable documents (PDF) | **Keep** | Required for prospectus, policies, documents. |
| `contacts` | School contact directory | **Keep** | School contact info for footer/contact page. |
| `socials` | Social media links | **Keep** | Footer social links. |
| `navigation` | Menu items | **Keep** | Website navigation builder. |
| `contact-messages` | Public contact form submissions | **Keep** | Admin dashboard "Contact Requests" module. |
| `notices` | School notices | **Simplify / optional** | Can be used for parent portal notices; otherwise remove if Posts/Events cover it. |
| `admissions` | Admission applications + dashboard | **Keep simplified** | Retain public application form and a read-only/status management dashboard. Remove full CRM-like features. |
| `fees` | School fees table | **Remove** | Out of scope for public-website admin. If fees must be listed, store as text in `School` or `Page`. |
| `results` | Learner results | **Remove** | Out of scope. |
| `attendance` | Attendance records | **Remove** | Out of scope. |
| `timetable` | Timetable entries | **Remove** | Out of scope. |
| `library` | Books catalog | **Remove** | Out of scope. |
| `borrowings` | Library circulation | **Remove** | Out of scope. |
| `finance` | Income/expense transactions | **Remove** | Out of scope. |
| `communication` | SMS/email/announcements | **Remove** | Out of scope. |
| `reports` | Report generator | **Remove** | Out of scope. |
| `subscriptions` | SaaS billing plans | **Disable for school admin / keep super-admin only** | Multi-school accounts need billing, but not in the school website admin dashboard. |
| `invoices` | Billing invoices | **Disable for school admin / keep super-admin only** | Same as subscriptions. |
| `licenses` | License keys | **Disable for school admin / keep super-admin only** | Same as subscriptions. |
| `audit-logs` | Activity logging | **Disable / remove** | Out of scope; can be kept as internal logging only. |
| `super-admin` | Platform super-admin | **Keep** | Manage schools, subscriptions, licenses. Not part of school admin dashboard. |
| `tenant` | Multi-school tenant middleware | **Keep** | Core to multi-school routing. |
| `storage` | File uploads, S3/local | **Keep** | Required for media. |
| `public` | Public website data endpoints | **Keep & extend** | Home, About, Academics, Admissions, News, Events, Gallery, Contact. |
| `portal` | Parent/learner portal | **Simplify / keep minimal** | Keep login, notices, calendar, homework, report downloads only if already implemented. Remove full academic/finance management. |
| `setup` | First-run school setup | **Keep** | Simplify to essential school info. |
| `leads` | Sales lead capture | **Remove** | Redundant with `contact-messages`. |
| `email` | Email sending | **Remove** | Out of scope; only keep SMTP for contact notifications if needed. |
| `cache` | Redis cache | **Keep** | Infrastructure. |
| `logger` | Error logging | **Keep** | Infrastructure. |

---

## Prisma models (`apps/api/prisma/schema.prisma`)

| Model | Recommendation | Notes |
|-------|------------------|-------|
| `School` | **Keep & extend** | Add fields for hero title, hero description, CTA, featured news/events if not already present. |
| `User` | **Simplify** | Keep `SUPER_ADMIN` and `SCHOOL_ADMIN` plus a lightweight `PARENT` account. Remove `TEACHER`/`LEARNER` if portal does not need them. |
| `Student` | **Remove / read-only** | Out of scope. If parent portal needs student lookup, keep a minimal read model with name and grade only. |
| `Page` | **Keep** | Custom public pages. |
| `Post` | **Keep** | News. |
| `Staff` | **Keep** | Staff directory. |
| `Event` | **Keep** | Events. |
| `Gallery` / `GalleryItem` | **Keep** | Gallery albums and items. |
| `Media` | **Keep** | Media library. |
| `Download` | **Keep** | Documents/downloads. |
| `EmergencyContact` | **Keep** | School contact directory. |
| `SocialLink` | **Keep** | Social links. |
| `SchoolFee` | **Remove** | Replace with text in `School` or `Page` if fee listing needed. |
| `NavigationItem` | **Keep** | Menu builder. |
| `ContactMessage` | **Keep** | Contact requests. |
| `Notice` | **Optional** | Simplify or remove. |
| `AdmissionApplication` | **Keep simplified** | Application form and status. |
| `Result` | **Remove** | Out of scope. |
| `Attendance` | **Remove** | Out of scope. |
| `Subscription` | **Keep super-admin only** | Remove from school admin dashboard. |
| `Invoice` | **Keep super-admin only** | Remove from school admin dashboard. |
| `License` | **Keep super-admin only** | Remove from school admin dashboard. |
| `PasswordResetToken` | **Keep** | Required for auth. |
| `TimetableEntry` | **Remove** | Out of scope. |
| `Book` / `Borrowing` | **Remove** | Out of scope. |
| `FinanceTransaction` | **Remove** | Out of scope. |
| `Communication` | **Remove** | Out of scope. |
| `Report` | **Remove** | Out of scope. |
| `Subject` | **Keep** | Academics. |
| `Homework` | **Optional / simplify** | Keep only if parent portal needs it; otherwise remove. |
| `AuditLog` | **Internal only** | Remove from UI; keep table for debugging. |

---

## Admin dashboard (`apps/web/src/app/admin`)

| Resource | Recommendation | Notes |
|----------|------------------|-------|
| Dashboard | **Keep** | Show counts for website content only (Pages, Posts, Events, Staff, Galleries, Media, Downloads, Contact Requests, Admissions). Remove ERP cards. |
| Settings | **Keep & restructure** | Single-page branding/site builder: school name, logo, favicon, colors, banner, slogan, footer, contact info, social links, SEO, hero, principal message, stats, mission/vision/values/history, Google Maps. |
| Media Library | **Keep** | Upload/delete images and videos, categories, albums. |
| Pages | **Keep** | About, Admissions info, Policies, Prospectus, custom pages. |
| Posts | **Keep** | News with publish/unpublish and images. |
| Events | **Keep** | Events calendar. |
| Staff | **Keep** | Staff profiles. |
| Galleries | **Keep** | Photo albums; merge with Media if possible. |
| Downloads | **Keep** | Documents/prospectus/policies. |
| Subjects | **Keep** | Academics. |
| Contact Requests | **Keep** | `contact-messages` resource. |
| Contacts | **Keep** | School contact directory. |
| Social Links | **Keep** | Footer social links. |
| Navigation | **Keep** | Menu builder. |
| Users | **Simplify** | Only create/reset admin accounts and parent accounts. |
| Students | **Remove** | Out of scope. |
| Results | **Remove** | Out of scope. |
| Attendance | **Remove** | Out of scope. |
| Timetable | **Remove** | Out of scope. |
| Library | **Remove** | Out of scope. |
| Borrowings | **Remove** | Out of scope. |
| Finance | **Remove** | Out of scope. |
| Communication | **Remove** | Out of scope. |
| Reports | **Remove** | Out of scope. |
| Fees | **Remove** | Out of scope. |
| Subscriptions / Invoices / Licenses | **Remove from school admin** | Keep only under super-admin. |
| Notices | **Remove or merge** | Use Posts/Events instead. |
| Admissions | **Keep simplified** | Manage public admissions applications only. |

---

## Public website (`apps/web/src/app`)

| Page | Status | Notes |
|------|--------|-------|
| `/` Home | **Keep** | Use `School` settings for hero, stats, principal message, featured news/events. |
| `/about` | **Keep** | School description, mission, vision, values, history. |
| `/academics` | **Keep** | Subjects and programmes. |
| `/admissions` | **Keep** | Admission info + online application. |
| `/news` and `/news/[slug]` | **Keep** | News. |
| `/events` | **Keep** | Events. |
| `/gallery` | **Keep** | Media gallery. |
| `/contact` | **Keep** | Contact form + school contact info. |
| `/calendar` | **Keep** | Events calendar. |
| `/notices` | **Optional** | Remove if not used. |
| `/portal` | **Simplify** | Parent/learner notices, calendar, homework, report downloads if kept; otherwise remove. |
| `/pricing`, `/demo`, `/setup` | **Review** | Keep only if still relevant; `/setup` is for first-run. |
| Admin routes under `/admin` | **Keep** | Separate auth and layout. |

---

## Recommended implementation order for v1.5.0

1. **Settings / site builder** — consolidate all school branding and home-page fields into one no-code dashboard.
2. **Media library** — complete upload, delete, categories, albums, image optimization.
3. **Pages / Admissions info** — allow editing About, Admissions requirements, policies/prospectus via `Page` and `School` fields.
4. **News, Events, Staff, Subjects, Gallery** — refine existing resource managers.
5. **Contact requests** — keep and polish.
6. **Remove/disabled modules** — remove `students`, `results`, `attendance`, `timetable`, `library`, `borrowings`, `finance`, `communication`, `reports`, `fees`, `notices` from the school admin UI and navigation. Keep API endpoints only if parent portal needs them; otherwise mark deprecated and hide.
7. **Super-admin cleanup** — move `subscriptions`, `invoices`, `licenses`, `audit-logs` to super-admin only.
8. **Polish and responsive testing** across all public pages.

---

## Files likely to change

- `apps/web/src/components/admin/resource-config.ts` — remove ERP resources, add/extend website-admin fields.
- `apps/web/src/components/admin/shell.tsx` — hide removed resources from navigation.
- `apps/web/src/app/admin/page.tsx` — dashboard cards for website content only.
- `apps/web/src/app/admin/settings/page.tsx` — expand into the site builder.
- `apps/api/prisma/schema.prisma` — remove or deprecate ERP models; extend `School` for home-page fields.
- `apps/api/src/app.module.ts` — remove ERP modules or guard them for super-admin.
- `apps/api/src/**/*.module.ts` and `*.controller.ts` — disable or remove routes for removed modules.
- `apps/web/src/app/portal/**` — simplify to parent/learner-only features.

---

## Summary

- **Keep**: `schools`, `auth` (simplified), `users` (simplified), `subjects`, `pages`, `posts`, `events`, `staff`, `galleries`, `media`, `downloads`, `contacts`, `socials`, `navigation`, `contact-messages`, `admissions` (simplified), `public`, `tenant`, `storage`, `setup`, `super-admin`, `cache`, `logger`.
- **Simplify**: `users`, `notices`, `portal`, `admissions`.
- **Remove or hide from school admin**: `students`, `results`, `attendance`, `timetable`, `library`, `borrowings`, `finance`, `communication`, `reports`, `fees`, `subscriptions`, `invoices`, `licenses`, `audit-logs`, `leads`, `email`.
- **Never touch**: `EduVision AI` (separate repository/product).
