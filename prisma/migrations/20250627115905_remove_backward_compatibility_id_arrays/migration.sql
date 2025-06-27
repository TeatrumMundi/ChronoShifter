/*
  Warnings:

  - You are about to drop the column `champLevelArena` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `itemIds` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `playerSubteamId` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `runeIds` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `statPerkIds` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "champLevelArena",
DROP COLUMN "itemIds",
DROP COLUMN "playerSubteamId",
DROP COLUMN "runeIds",
DROP COLUMN "statPerkIds";
