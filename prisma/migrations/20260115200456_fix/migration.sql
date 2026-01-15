/*
  Warnings:

  - You are about to drop the column `magadexId` on the `MangaTrackerRelation` table. All the data in the column will be lost.
  - Added the required column `mangadexId` to the `MangaTrackerRelation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MangaTrackerRelation" DROP COLUMN "magadexId",
ADD COLUMN     "mangadexId" TEXT NOT NULL;
