import { PrismaClient, UserRole, SubscriptionStatus } from '@prisma/client';
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
      address: '123 School Lane, Pretoria, South Africa',
      websiteTitle: 'Sunrise Primary School',
      metaDescription: 'Excellence in education for every learner.',
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
    { slug: 'home', title: 'Home', showInMenu: true, menuOrder: 0, content: '# Welcome to our school' },
    { slug: 'about', title: 'About Us', showInMenu: true, menuOrder: 1, content: '## About our school' },
    { slug: 'principal-message', title: "Principal's Message", showInMenu: true, menuOrder: 2, content: '## A message from the principal' },
    { slug: 'vision-mission', title: 'Vision & Mission', showInMenu: true, menuOrder: 3, content: '## Vision and Mission' },
    { slug: 'history', title: 'School History', showInMenu: true, menuOrder: 4, content: '## Our History' },
    { slug: 'academics', title: 'Academics', showInMenu: true, menuOrder: 5, content: '## Academics' },
    { slug: 'admissions', title: 'Admissions', showInMenu: true, menuOrder: 6, content: '## Admissions Information' },
    { slug: 'school-fees', title: 'School Fees', showInMenu: true, menuOrder: 7, content: '## School Fees' },
    { slug: 'school-uniform', title: 'School Uniform', showInMenu: true, menuOrder: 8, content: '## School Uniform' },
    { slug: 'sports', title: 'Sports', showInMenu: true, menuOrder: 9, content: '## Sports' },
    { slug: 'contact', title: 'Contact Us', showInMenu: true, menuOrder: 10, content: '## Contact Us' },
    { slug: 'emergency', title: 'Emergency Contacts', showInMenu: true, menuOrder: 11, content: '## Emergency Contacts' },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { schoolId_slug: { schoolId: demoSchool.id, slug: p.slug } },
      update: {},
      create: { ...p, schoolId: demoSchool.id },
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
