/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Epaper` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Epaper" ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Epaper_slug_key" ON "Epaper"("slug");

-- CreateIndex
CREATE INDEX "Epaper_isPublished_publishedAt_idx" ON "Epaper"("isPublished", "publishedAt");
