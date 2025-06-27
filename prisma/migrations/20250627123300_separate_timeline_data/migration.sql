/*
  Warnings:

  - You are about to drop the column `timelineData` on the `Match` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE "MatchTimeline" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "timelineData" JSONB NOT NULL,

    CONSTRAINT "MatchTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchTimeline_matchId_key" ON "MatchTimeline"("matchId");

-- Migrate existing timeline data to new table
INSERT INTO "MatchTimeline" ("id", "matchId", "timelineData")
SELECT gen_random_uuid(), "matchId", "timelineData"
FROM "Match"
WHERE "timelineData" IS NOT NULL;

-- AlterTable - Drop the old column after data migration
ALTER TABLE "Match" DROP COLUMN "timelineData";

-- AddForeignKey
ALTER TABLE "MatchTimeline" ADD CONSTRAINT "MatchTimeline_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;
