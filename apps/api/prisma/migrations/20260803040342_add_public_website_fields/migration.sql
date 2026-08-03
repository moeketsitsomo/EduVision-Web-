-- AlterTable
ALTER TABLE "School" ADD COLUMN     "admissionsEmail" TEXT,
ADD COLUMN     "admissionsPhone" TEXT,
ADD COLUMN     "awards" JSONB,
ADD COLUMN     "bannerImageUrl" TEXT,
ADD COLUMN     "classroomCount" INTEGER,
ADD COLUMN     "enrollmentCount" INTEGER,
ADD COLUMN     "establishedYear" INTEGER,
ADD COLUMN     "facilities" JSONB,
ADD COLUMN     "footerText" TEXT,
ADD COLUMN     "googleMapsUrl" TEXT,
ADD COLUMN     "history" TEXT,
ADD COLUMN     "locationLat" DOUBLE PRECISION,
ADD COLUMN     "locationLng" DOUBLE PRECISION,
ADD COLUMN     "mission" TEXT,
ADD COLUMN     "officeHours" TEXT,
ADD COLUMN     "passRate" DOUBLE PRECISION,
ADD COLUMN     "principalMessage" TEXT,
ADD COLUMN     "principalName" TEXT,
ADD COLUMN     "teacherCount" INTEGER,
ADD COLUMN     "values" TEXT,
ADD COLUMN     "vision" TEXT;

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "grade" TEXT,
    "description" TEXT,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homework" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT,
    "grade" TEXT,
    "subject" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Homework_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subject_schoolId_order_idx" ON "Subject"("schoolId", "order");

-- CreateIndex
CREATE INDEX "Subject_schoolId_grade_idx" ON "Subject"("schoolId", "grade");

-- CreateIndex
CREATE INDEX "Homework_schoolId_grade_idx" ON "Homework"("schoolId", "grade");

-- CreateIndex
CREATE INDEX "Homework_schoolId_studentId_idx" ON "Homework"("schoolId", "studentId");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
