/*
  Warnings:

  - A unique constraint covering the columns `[trackerId,mangaId]` on the table `MangaTrackerRelation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coverFilename` to the `MangaTrackerRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latestChapterId` to the `MangaTrackerRelation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MangaTrackerRelation" ADD COLUMN     "coverFilename" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "latestChapterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "MangaTrackerRelation_trackerId_mangaId_key" ON "MangaTrackerRelation"("trackerId", "mangaId");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
