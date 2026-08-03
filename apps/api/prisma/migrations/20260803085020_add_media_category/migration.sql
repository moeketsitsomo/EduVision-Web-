-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "category" TEXT;

-- CreateIndex
CREATE INDEX "Media_schoolId_category_idx" ON "Media"("schoolId", "category");
