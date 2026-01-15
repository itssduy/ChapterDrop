/*
  Warnings:

  - A unique constraint covering the columns `[mangadexId]` on the table `Manga` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mangadexId` to the `Manga` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Manga" ADD COLUMN     "mangadexId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Manga_mangadexId_key" ON "Manga"("mangadexId");
