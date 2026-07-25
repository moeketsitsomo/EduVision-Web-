-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');
-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');
-- CreateEnum
CREATE TYPE "NoticeAudience" AS ENUM ('ALL', 'PARENTS', 'TEACHERS', 'LEARNERS', 'STAFF');
-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');
-- CreateEnum
CREATE TYPE "AdmissionStatus" AS ENUM ('PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED', 'WAITLISTED');
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE');
-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'EXPIRED';
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.
ALTER TYPE "UserRole" ADD VALUE 'TEACHER';
ALTER TYPE "UserRole" ADD VALUE 'PARENT';
ALTER TYPE "UserRole" ADD VALUE 'LEARNER';
-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT;
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "category" SET DEFAULT 'general';
-- AlterTable
ALTER TABLE "School" ADD COLUMN     "billingEmail" TEXT,
ADD COLUMN     "licenseKey" TEXT,
ADD COLUMN     "maxStorageMb" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "maxUsers" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "plan" "PlanType" DEFAULT 'BASIC',
ADD COLUMN     "trialEndsAt" TIMESTAMP(3);
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "studentId" TEXT,
ADD COLUMN     "twoFactorBackupCodes" JSONB,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;
-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "grade" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "parentEmail" TEXT,
    "parentPhone" TEXT,
    "gender" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "audience" "NoticeAudience" NOT NULL DEFAULT 'ALL',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "AdmissionApplication" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentFirstName" TEXT NOT NULL,
    "studentLastName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "gradeApplying" TEXT NOT NULL,
    "previousSchool" TEXT,
    "parentName" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "parentPhone" TEXT,
    "address" TEXT,
    "status" "AdmissionStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "documentUrls" JSONB,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdmissionApplication_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT,
    "studentNumber" TEXT,
    "academicYear" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "grade" TEXT,
    "remarks" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT,
    "studentNumber" TEXT,
    "studentName" TEXT,
    "grade" TEXT,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "plan" "PlanType" NOT NULL DEFAULT 'BASIC',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "price" DECIMAL(65,30),
    "billingCycle" "BillingCycle",
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "tax" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "items" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "schoolId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "Student_studentNumber_key" ON "Student"("studentNumber");
-- CreateIndex
CREATE INDEX "Student_schoolId_idx" ON "Student"("schoolId");
-- CreateIndex
CREATE INDEX "Student_parentEmail_idx" ON "Student"("parentEmail");
-- CreateIndex
CREATE UNIQUE INDEX "Student_schoolId_studentNumber_key" ON "Student"("schoolId", "studentNumber");
-- CreateIndex
CREATE INDEX "Notice_schoolId_audience_publishedAt_idx" ON "Notice"("schoolId", "audience", "publishedAt");
-- CreateIndex
CREATE INDEX "Notice_schoolId_isPublished_publishedAt_idx" ON "Notice"("schoolId", "isPublished", "publishedAt");
-- CreateIndex
CREATE INDEX "AdmissionApplication_schoolId_status_submittedAt_idx" ON "AdmissionApplication"("schoolId", "status", "submittedAt");
-- CreateIndex
CREATE INDEX "Result_schoolId_studentNumber_academicYear_term_idx" ON "Result"("schoolId", "studentNumber", "academicYear", "term");
-- CreateIndex
CREATE INDEX "Result_schoolId_studentId_academicYear_term_idx" ON "Result"("schoolId", "studentId", "academicYear", "term");
-- CreateIndex
CREATE INDEX "Attendance_schoolId_date_status_idx" ON "Attendance"("schoolId", "date", "status");
-- CreateIndex
CREATE INDEX "Attendance_schoolId_studentNumber_date_idx" ON "Attendance"("schoolId", "studentNumber", "date");
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_schoolId_key" ON "Subscription"("schoolId");
-- CreateIndex
CREATE INDEX "Subscription_schoolId_status_idx" ON "Subscription"("schoolId", "status");
-- CreateIndex
CREATE INDEX "Subscription_status_endDate_idx" ON "Subscription"("status", "endDate");
-- CreateIndex
CREATE INDEX "Invoice_schoolId_status_dueDate_idx" ON "Invoice"("schoolId", "status", "dueDate");
-- CreateIndex
CREATE INDEX "Invoice_schoolId_paidAt_idx" ON "Invoice"("schoolId", "paidAt");
-- CreateIndex
CREATE UNIQUE INDEX "License_schoolId_key" ON "License"("schoolId");
-- CreateIndex
CREATE UNIQUE INDEX "License_key_key" ON "License"("key");
-- CreateIndex
CREATE INDEX "PasswordResetToken_email_schoolId_idx" ON "PasswordResetToken"("email", "schoolId");
-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");
-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");
-- CreateIndex
CREATE INDEX "Media_uploadedById_idx" ON "Media"("uploadedById");
-- CreateIndex
CREATE UNIQUE INDEX "School_licenseKey_key" ON "School"("licenseKey");
-- CreateIndex
CREATE INDEX "School_subscriptionStatus_idx" ON "School"("subscriptionStatus");
-- CreateIndex
CREATE INDEX "User_studentId_idx" ON "User"("studentId");
-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "AdmissionApplication" ADD CONSTRAINT "AdmissionApplication_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
