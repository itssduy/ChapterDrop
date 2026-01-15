/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Tracker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mangadexId` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mangadexId` to the `Cover` table without a default value. This is not possible if the table is not empty.
  - Added the required column `magadexId` to the `MangaTrackerRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "mangadexId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Cover" ADD COLUMN     "mangadexId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MangaTrackerRelation" ADD COLUMN     "magadexId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "discordId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tracker_userId_key" ON "Tracker"("userId");
