# EduVision School Website v1.5.0 — CMS Planning

## Goal

Make the **EduVision School CMS** a complete administrative and academic management platform while keeping the public School Website as a separate, polished module.

EduVision AI remains a completely separate product and is **not** part of this plan.

---

## Architecture principles

- `EduVision-Web` keeps one repository.
- Public Website (`/`, `/admissions`, `/portal` …) and School CMS (`/admin`) remain logically separated.
- Separate routes, authentication, navigation and user experience.
- CMS features are built behind `/admin` with role-based access.
- Public pages continue to be read-only for visitors; only selected data is published from the CMS.

---

## Priority modules

### 1. Principal Dashboard
- Whole-school KPIs: enrolment, attendance, pass rate, fee collection, staff/learner counts.
- Term-over-term graphs.
- Quick links to pending admissions, unread contact requests, recent notices.

### 2. Teacher Dashboard
- My classes, timetable, attendance registers, homework/tasks, marks entry.
- Learner notices and parent communication.
- Markbook summaries.

### 3. Learner Management
- Learner profile CRUD.
- Parent/guardian linkage.
- Grade/class assignment, roll numbers, documents.
- Promotion/history and withdrawals.

### 4. Staff Management
- Staff directory, roles, departments, subjects taught.
- Contracts, qualifications, leave (basic).
- System users linked to staff.

### 5. Attendance
- Daily class/grade registers.
- Present / absent / late / excused.
- Reports per learner, class and term.
- Attendance notifications to parents.

### 6. Timetable
- Class, teacher, room and subject scheduling.
- Week view, conflict detection.
- Public timetable display on Academics page.

### 7. Assessments
- Create tests, assignments, exams.
- Capture marks per subject/grade.
- Weightings and class averages.

### 8. Report Cards
- Generate term-end report cards.
- Templates per grade.
- PDF export.
- Parent portal download.

### 9. Finance
- Fee structures and invoices.
- Payments, credits, arrears.
- Payment methods and receipts.
- Finance dashboard and reports.

### 10. Library
- Book catalog, authors, categories.
- Borrowings, due dates, returns.
- Fines and reservations.

### 11. Inventory
- Asset register, categories, locations.
- Issue/return tracking.
- Low-stock reports.

### 12. Transport
- Routes, stops, vehicles.
- Learner-route assignments.
- Transport fees.

### 13. Hostel (optional)
- Hostels, rooms, beds.
- Boarder assignments.
- Hostel fees.

### 14. Notifications
- In-app notices by role/grade/class.
- Push notifications via browser (optional).
- Notice templates.

### 15. SMS
- SMS gateway integration (Twilio, Clickatell, Africa's Talking).
- Send to parents/staff/grades.
- SMS history and credit balance.

### 16. Email
- Bulk email to parents/staff.
- Templates (attendance, fees, events).
- Email history and queue.

### 17. Analytics
- Attendance trends.
- Academic performance by subject/class.
- Finance collection rates.
- Admissions funnel.

### 18. Audit Logs
- Track create/update/delete in CMS.
- Filter by user, action, date.
- Export logs.

### 19. Backups
- Automated database and uploads backup.
- Scheduled backups with retention.
- One-click restore (admin).

### 20. Role-Based Permissions
- Granular permissions per role.
- Custom roles for school-specific workflows.
- Permission middleware on API routes.

---

## Proposed phases

### Phase A — Core teaching & learning
- Teacher Dashboard
- Learner Management
- Attendance
- Timetable
- Assessments
- Report Cards

### Phase B — School operations
- Staff Management
- Finance
- Library
- Inventory
- Transport

### Phase C — Communication & governance
- Notifications
- SMS
- Email
- Principal Dashboard
- Analytics
- Audit Logs
- Backups
- Role-Based Permissions
- Hostel (optional)

---

## Technical considerations

- Use existing NestJS/Prisma stack.
- Add new Prisma models as needed (e.g. `Vehicle`, `Route`, `Room`, `Asset`, `Fine`, etc.).
- Keep CMS UI consistent with `resource-config.ts` + generic `admin/[resource]` manager where possible.
- Build dedicated pages where complex UX is needed (timetable, report cards, finance).
- Expose public endpoints for published timetable, notices and report-card download.
- Preserve `EduVision AI` separation; no shared code.

---

## Success criteria

- CMS modules are usable by principals, teachers and admin staff.
- Public website still works and remains performant.
- `npx tsc --noEmit` and `npm run build` pass.
- `npm audit --legacy-peer-deps` reports 0 vulnerabilities.
- Docker Compose stack builds and runs.
- New features have admin navigation, RBAC and basic documentation.
