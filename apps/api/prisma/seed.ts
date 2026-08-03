import { PrismaClient, UserRole, SubscriptionStatus, NoticeAudience, AttendanceStatus, MediaType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const platform = await prisma.school.upsert({
    where: { slug: 'platform' },
    update: {},
    create: {
      name: 'EduVision Platform',
      slug: 'platform',
      isActive: true,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      contactEmail: 'admin@eduvision.local',
    },
  });

  const demoSchool = await prisma.school.upsert({
    where: { slug: 'demo-school' },
    update: {},
    create: {
      name: 'Sunrise Primary School',
      slug: 'demo-school',
      primaryColor: '#2563eb',
      secondaryColor: '#1e293b',
      contactEmail: 'info@sunrise-primary.edu',
      contactPhone: '+27 12 345 6789',
      admissionsEmail: 'admissions@sunrise-primary.edu',
      admissionsPhone: '+27 12 345 6790',
      address: '123 School Lane, Pretoria, South Africa',
      websiteTitle: 'Sunrise Primary School',
      metaDescription: 'Excellence in education for every learner.',
      footerText: '© Sunrise Primary School. Nurturing lifelong learners.',
      principalName: 'Mrs Thandi Ndlovu',
      principalMessage: 'Welcome to Sunrise Primary School. We are committed to academic excellence, strong values, and nurturing every child to reach their full potential.',
      mission: 'To provide a safe, inclusive and stimulating environment where every learner can thrive academically, socially and emotionally.',
      vision: 'To be a leading primary school that develops confident, responsible and lifelong learners.',
      values: 'Respect\nResponsibility\nIntegrity\nExcellence\nCompassion',
      history: 'Founded in 1994, Sunrise Primary School has grown from a small community school into a centre of excellence serving learners from Grade R to Grade 7.',
      establishedYear: 1994,
      enrollmentCount: 420,
      teacherCount: 28,
      classroomCount: 18,
      passRate: 96.5,
      facilities: [
        'Modern classrooms with smart boards',
        'Science and computer laboratories',
        'Library and resource centre',
        'Sports fields and netball courts',
        'Music and art rooms',
        'Safe aftercare facility',
      ],
      awards: [
        { year: 2024, title: 'Best Primary School in Region' },
        { year: 2023, title: 'Excellence in Mathematics Award' },
      ],
      officeHours: 'Mon – Fri: 07:30 – 15:30\nSat: 08:00 – 12:00',
      googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14380.0!2d28.2186!3d-25.7479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQ0JzUyLjQiUyAyOMKwMTMnMDcuMCJF!5e0!3m2!1sen!2sza!4v1600000000000',
      locationLat: -25.7479,
      locationLng: 28.2186,
      isActive: true,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      plan: 'BASIC',
      trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.subscription.upsert({
    where: { schoolId: platform.id },
    update: {},
    create: {
      schoolId: platform.id,
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.subscription.upsert({
    where: { schoolId: demoSchool.id },
    update: {},
    create: {
      schoolId: demoSchool.id,
      plan: 'BASIC',
      status: 'ACTIVE',
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  const superAdminEmail = 'superadmin@eduvision.local';
  const existingSuper = await prisma.user.findFirst({
    where: { email: superAdminEmail, schoolId: platform.id },
  });

  if (!existingSuper) {
    const passwordHash = await bcrypt.hash('SuperAdmin123!', 10);
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        passwordHash,
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.SUPER_ADMIN,
        schoolId: platform.id,
        isActive: true,
      },
    });
  }

  const demoAdminEmail = 'admin@demo-school.edu';
  const existingDemoAdmin = await prisma.user.findFirst({
    where: { email: demoAdminEmail, schoolId: demoSchool.id },
  });

  if (!existingDemoAdmin) {
    const passwordHash = await bcrypt.hash('SchoolAdmin123!', 10);
    await prisma.user.create({
      data: {
        email: demoAdminEmail,
        passwordHash,
        firstName: 'School',
        lastName: 'Admin',
        role: UserRole.SCHOOL_ADMIN,
        schoolId: demoSchool.id,
        isActive: true,
      },
    });
  }

  const pages = [
    { slug: 'home', title: 'Home', showInMenu: true, menuOrder: 0, content: 'We are committed to excellence in education and to nurturing every learner to reach their full potential.' },
    { slug: 'about', title: 'About Us', showInMenu: true, menuOrder: 1, content: 'Sunrise Primary School has been serving the Pretoria community for over 30 years with quality, inclusive education.' },
    { slug: 'principal-message', title: "Principal's Message", showInMenu: true, menuOrder: 2, content: 'Welcome to our school. We believe in academic excellence, discipline and strong values.' },
    { slug: 'vision-mission', title: 'Vision & Mission', showInMenu: true, menuOrder: 3, content: '## Vision\nTo be a leading primary school that develops confident, responsible and lifelong learners.\n\n## Mission\nTo provide a safe, inclusive and stimulating environment where every learner can thrive.' },
    { slug: 'history', title: 'School History', showInMenu: true, menuOrder: 4, content: 'Founded in 1994, Sunrise Primary School has grown from a small community school into a centre of excellence.' },
    { slug: 'academics', title: 'Academics', showInMenu: true, menuOrder: 5, content: 'We follow the CAPS curriculum with a strong focus on literacy, numeracy, science and technology.' },
    { slug: 'admissions', title: 'Admissions', showInMenu: true, menuOrder: 6, content: 'Applications for the 2026 academic year are now open. Visit our online admissions portal to apply.' },
    { slug: 'school-fees', title: 'School Fees', showInMenu: true, menuOrder: 7, content: 'Our fees are competitive and transparent. Detailed fee structures are available on the School Fees page.' },
    { slug: 'school-uniform', title: 'School Uniform', showInMenu: true, menuOrder: 8, content: 'Our uniform is available from approved suppliers. Navy blue and white are our school colours.' },
    { slug: 'sports', title: 'Sports', showInMenu: true, menuOrder: 9, content: 'We offer soccer, netball, cricket, athletics and chess. All learners are encouraged to participate.' },
    { slug: 'contact', title: 'Contact Us', showInMenu: true, menuOrder: 10, content: 'Reach us by phone, email or visit the school office during working hours.' },
    { slug: 'emergency', title: 'Emergency Contacts', showInMenu: true, menuOrder: 11, content: 'For emergencies contact the school office or the numbers listed below.' },
    { slug: 'news', title: 'News', showInMenu: true, menuOrder: 12, content: 'Stay updated with events, achievements and announcements.' },
    { slug: 'events', title: 'Events', showInMenu: true, menuOrder: 13, content: 'View our calendar for sports days, parent meetings and cultural events.' },
    { slug: 'gallery', title: 'Gallery', showInMenu: true, menuOrder: 14, content: 'A showcase of school life, events and achievements.' },
    { slug: 'downloads', title: 'Downloads', showInMenu: true, menuOrder: 15, content: 'Access policies, newsletters, fee schedules and forms.' },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { schoolId_slug: { schoolId: demoSchool.id, slug: p.slug } },
      update: { title: p.title, content: p.content, showInMenu: p.showInMenu, menuOrder: p.menuOrder },
      create: { ...p, schoolId: demoSchool.id },
    });
  }

  // Sample posts
  const posts = [
    { title: 'Term 3 Opening Assembly', slug: 'term-3-opening-assembly', summary: 'We welcomed learners back for a productive third term.', content: 'The opening assembly set the tone for a successful term ahead.', category: 'news' },
    { title: 'Learners Excel in Maths Olympiad', slug: 'maths-olympiad-success', summary: 'Our top learners placed in the regional mathematics competition.', content: 'Congratulations to all participants who represented the school with pride.', category: 'news' },
    { title: 'Sports Day 2026', slug: 'sports-day-2026', summary: 'Join us for an exciting day of athletics and team sports.', content: 'Sports Day will include athletics, relays, netball and soccer matches.', category: 'events' },
  ];
  for (const post of posts) {
    await prisma.post.upsert({
      where: { schoolId_slug: { schoolId: demoSchool.id, slug: post.slug } },
      update: { title: post.title, summary: post.summary, content: post.content, category: post.category },
      create: { ...post, schoolId: demoSchool.id, isPublished: true },
    });
  }

  await prisma.staff.deleteMany({ where: { schoolId: demoSchool.id } });
  await prisma.event.deleteMany({ where: { schoolId: demoSchool.id } });
  await prisma.emergencyContact.deleteMany({ where: { schoolId: demoSchool.id } });
  await prisma.socialLink.deleteMany({ where: { schoolId: demoSchool.id } });
  await prisma.schoolFee.deleteMany({ where: { schoolId: demoSchool.id } });
  await prisma.notice.deleteMany({ where: { schoolId: demoSchool.id } });
  await prisma.attendance.deleteMany({ where: { schoolId: demoSchool.id } });
  await prisma.galleryItem.deleteMany({ where: { gallery: { schoolId: demoSchool.id } } });
  await prisma.gallery.deleteMany({ where: { schoolId: demoSchool.id } });
  await prisma.download.deleteMany({ where: { schoolId: demoSchool.id } });
  await prisma.media.deleteMany({ where: { schoolId: demoSchool.id, filename: 'sample-campus.jpg' } });

  // Sample staff
  const staff = [
    { name: 'Mrs Thandi Ndlovu', role: 'Principal', department: 'Leadership', bio: 'Experienced educator and school leader.', email: 'principal@sunrise-primary.edu', order: 1 },
    { name: 'Mr John Mokoena', role: 'Deputy Principal', department: 'Administration', bio: 'Oversees curriculum and assessment.', email: 'deputy@sunrise-primary.edu', order: 2 },
    { name: 'Ms Lerato Smith', role: 'Grade 7 Educator', department: 'Intermediate Phase', bio: 'Passionate about literacy and drama.', email: 'lerato.smith@sunrise-primary.edu', order: 3 },
  ];
  for (const s of staff) {
    const id = `${demoSchool.id}-${s.email}`;
    await prisma.staff.upsert({
      where: { id },
      update: { ...s, schoolId: demoSchool.id, isPublished: true },
      create: { id, ...s, schoolId: demoSchool.id, isPublished: true },
    });
  }

  // Sample events
  const now = new Date();
  const events = [
    { title: 'Parent-Teacher Meeting', description: 'Discuss learner progress with educators.', startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), allDay: false, location: 'School Hall', category: 'meeting' },
    { title: 'Spring Concert', description: 'A celebration of music and culture.', startAt: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), allDay: false, location: 'School Quad', category: 'cultural' },
    { title: 'Term 3 Assessment Week', description: 'Formal assessments for all grades.', startAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), endAt: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000), allDay: true, category: 'academic' },
  ];
  for (const e of events) {
    await prisma.event.create({ data: { ...e, schoolId: demoSchool.id, isPublished: true } });
  }

  // Sample contacts
  const contacts = [
    { name: 'School Office', number: '+27 12 345 6789', type: 'general', label: 'Main line', order: 1 },
    { name: 'Ambulance', number: '10177', type: 'emergency', order: 2 },
    { name: 'Police', number: '10111', type: 'emergency', order: 3 },
  ];
  for (const c of contacts) {
    await prisma.emergencyContact.create({ data: { ...c, schoolId: demoSchool.id } });
  }

  // Sample social links
  const socials = [
    { platform: 'Facebook', url: 'https://facebook.com/sunriseprimary', order: 1 },
    { platform: 'Instagram', url: 'https://instagram.com/sunriseprimary', order: 2 },
  ];
  for (const s of socials) {
    await prisma.socialLink.create({ data: { ...s, schoolId: demoSchool.id } });
  }

  // Sample school fees
  const fees = [
    { grade: 'Grade R', item: 'Tuition', amount: 3500, year: '2026', description: 'Monthly tuition' },
    { grade: 'Grade 1-3', item: 'Tuition', amount: 4200, year: '2026', description: 'Monthly tuition' },
    { grade: 'Grade 4-7', item: 'Tuition', amount: 4800, year: '2026', description: 'Monthly tuition' },
  ];
  for (const f of fees) {
    await prisma.schoolFee.create({ data: { ...f, schoolId: demoSchool.id } });
  }

  // Sample notices
  const notices = [
    { title: 'School Closure - Public Holiday', content: 'The school will be closed on the upcoming public holiday.', audience: NoticeAudience.ALL },
    { title: 'Parent Volunteer Drive', content: 'We are looking for parents to assist with the sports day.', audience: NoticeAudience.PARENTS },
    { title: 'Staff Meeting', content: 'All staff are reminded of the planning meeting on Friday.', audience: NoticeAudience.STAFF },
  ];
  for (const n of notices) {
    await prisma.notice.create({ data: { ...n, schoolId: demoSchool.id, isPublished: true } });
  }

  // Sample students
  const students = [
    { studentNumber: 'SP2026001', firstName: 'Amahle', lastName: 'Dlamini', grade: 'Grade 5', parentEmail: 'parent1@example.com', gender: 'Female', isActive: true },
    { studentNumber: 'SP2026002', firstName: 'Lukhanyo', lastName: 'Mokoena', grade: 'Grade 6', parentEmail: 'parent2@example.com', gender: 'Male', isActive: true },
    { studentNumber: 'SP2026003', firstName: 'Zara', lastName: 'Naidoo', grade: 'Grade 4', parentEmail: 'parent3@example.com', gender: 'Female', isActive: true },
  ];
  for (const s of students) {
    await prisma.student.upsert({
      where: { schoolId_studentNumber: { schoolId: demoSchool.id, studentNumber: s.studentNumber } },
      update: { ...s, schoolId: demoSchool.id },
      create: { ...s, schoolId: demoSchool.id },
    });
  }

  // Sample attendance records for this week
  const demoStudents = await prisma.student.findMany({ where: { schoolId: demoSchool.id } });
  for (const student of demoStudents) {
    await prisma.attendance.create({
      data: {
        schoolId: demoSchool.id,
        studentId: student.id,
        studentNumber: student.studentNumber,
        studentName: `${student.firstName} ${student.lastName || ''}`.trim(),
        grade: student.grade,
        date: new Date(now.setHours(0, 0, 0, 0)),
        status: AttendanceStatus.PRESENT,
      },
    });
  }

  // Sample gallery with placeholder media
  const gallery = await prisma.gallery.create({
    data: { title: 'School Life', description: 'Moments from around the school.', schoolId: demoSchool.id },
  });
  const media = await prisma.media.create({
    data: {
      filename: 'sample-campus.jpg',
      originalName: 'Campus.jpg',
      mimeType: 'image/jpeg',
      size: 1024 * 1024,
      url: 'https://via.placeholder.com/800x600?text=Sunrise+Primary',
      type: MediaType.IMAGE,
      schoolId: demoSchool.id,
    },
  });
  await prisma.galleryItem.create({
    data: { caption: 'Our campus', order: 1, mediaId: media.id, galleryId: gallery.id },
  });

  // Sample download
  await prisma.download.create({
    data: {
      title: 'School Fee Schedule 2026',
      description: 'Detailed fee schedule for the 2026 academic year.',
      category: 'fees',
      fileUrl: 'https://via.placeholder.com/800x600?text=Fee+Schedule',
      schoolId: demoSchool.id,
      mediaId: media.id,
    },
  });

  // Sample subjects
  const subjects = [
    { name: 'English Home Language', code: 'ENG', grade: 'Grade 4-7', category: 'Languages', description: 'Reading, writing, speaking and listening.' },
    { name: 'Mathematics', code: 'MATH', grade: 'Grade 4-7', category: 'Mathematics', description: 'Numbers, operations, patterns, geometry and data handling.' },
    { name: 'Natural Sciences & Technology', code: 'NST', grade: 'Grade 4-7', category: 'Science', description: 'Investigating the natural and technological world.' },
    { name: 'Social Sciences', code: 'SS', grade: 'Grade 4-7', category: 'Humanities', description: 'History and geography.' },
    { name: 'Life Skills', code: 'LS', grade: 'Grade 4-7', category: 'Life Skills', description: 'Creative arts, physical education and personal wellbeing.' },
  ];
  await prisma.subject.deleteMany({ where: { schoolId: demoSchool.id } });
  for (const s of subjects) {
    await prisma.subject.create({ data: { ...s, schoolId: demoSchool.id, order: 0, isPublished: true } });
  }

  // Sample results for demo students
  const term = 'Term 2';
  const year = '2026';
  for (const student of demoStudents) {
    await prisma.result.createMany({
      data: [
        { schoolId: demoSchool.id, studentId: student.id, studentNumber: student.studentNumber, academicYear: year, term, subject: 'English Home Language', score: 78, maxScore: 100, grade: 'B', isPublished: true, publishedAt: new Date() },
        { schoolId: demoSchool.id, studentId: student.id, studentNumber: student.studentNumber, academicYear: year, term, subject: 'Mathematics', score: 82, maxScore: 100, grade: 'A', isPublished: true, publishedAt: new Date() },
        { schoolId: demoSchool.id, studentId: student.id, studentNumber: student.studentNumber, academicYear: year, term, subject: 'Natural Sciences & Technology', score: 74, maxScore: 100, grade: 'B', isPublished: true, publishedAt: new Date() },
      ],
    });

    // Sample homework
    await prisma.homework.create({
      data: {
        schoolId: demoSchool.id,
        studentId: student.id,
        grade: student.grade,
        subject: 'Mathematics',
        title: 'Fractions worksheet',
        description: 'Complete exercises 1-10 on equivalent fractions.',
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Sample parent and learner users
  const parentPassword = await bcrypt.hash('Parent123!', 10);
  const learnerPassword = await bcrypt.hash('Learner123!', 10);

  for (const student of demoStudents) {
    const parentEmail = student.parentEmail || `parent-${student.studentNumber}@example.com`;
    const existingParent = await prisma.user.findFirst({ where: { email: parentEmail, schoolId: demoSchool.id } });
    if (!existingParent) {
      await prisma.user.create({
        data: {
          email: parentEmail,
          passwordHash: parentPassword,
          firstName: 'Parent',
          lastName: `of ${student.firstName}`,
          role: UserRole.PARENT,
          schoolId: demoSchool.id,
          studentId: student.id,
          isActive: true,
        },
      });
    }

    const learnerEmail = `learner-${student.studentNumber}@example.com`;
    const existingLearner = await prisma.user.findFirst({ where: { email: learnerEmail, schoolId: demoSchool.id } });
    if (!existingLearner) {
      await prisma.user.create({
        data: {
          email: learnerEmail,
          passwordHash: learnerPassword,
          firstName: student.firstName,
          lastName: student.lastName,
          role: UserRole.LEARNER,
          schoolId: demoSchool.id,
          studentId: student.id,
          isActive: true,
        },
      });
    }
  }

  console.log('Seed completed with demo data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
