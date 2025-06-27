/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "RiotAccount" (
    "id" SERIAL NOT NULL,
    "riotAccountDetailsPuuid" TEXT NOT NULL,
    "leagueAccountId" TEXT,

    CONSTRAINT "RiotAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiotAccountDetails" (
    "puuid" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,

    CONSTRAINT "RiotAccountDetails_pkey" PRIMARY KEY ("puuid")
);

-- CreateTable
CREATE TABLE "LeagueAccount" (
    "id" TEXT NOT NULL,
    "leagueAccountDetailsId" TEXT NOT NULL,
    "leagueSoloRankId" TEXT,
    "leagueFlexRankId" TEXT,

    CONSTRAINT "LeagueAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueAccountDetails" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "activeRegion" TEXT NOT NULL,
    "profileIconId" INTEGER NOT NULL,
    "revisionDate" BIGINT NOT NULL,
    "summonerLevel" INTEGER NOT NULL,

    CONSTRAINT "LeagueAccountDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueRank" (
    "id" TEXT NOT NULL,
    "queueType" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "leaguePoints" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "winRate" INTEGER NOT NULL,
    "hotStreak" BOOLEAN NOT NULL,

    CONSTRAINT "LeagueRank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "matchId" TEXT NOT NULL,
    "gameDuration" INTEGER NOT NULL,
    "gameCreation" BIGINT NOT NULL,
    "gameEndTimestamp" BIGINT NOT NULL,
    "gameMode" TEXT NOT NULL,
    "gameType" TEXT NOT NULL,
    "queueId" INTEGER NOT NULL,
    "timelineData" JSONB,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("matchId")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "participantId" INTEGER NOT NULL,
    "riotIdGameName" TEXT NOT NULL,
    "riotIdTagline" TEXT NOT NULL,
    "summonerName" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "activeRegion" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "teamPosition" TEXT NOT NULL,
    "champLevel" INTEGER NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "kda" TEXT NOT NULL,
    "totalMinionsKilled" INTEGER NOT NULL,
    "neutralMinionsKilled" INTEGER NOT NULL,
    "allMinionsKilled" INTEGER NOT NULL,
    "minionsPerMinute" DOUBLE PRECISION NOT NULL,
    "visionScore" INTEGER NOT NULL,
    "visionPerMinute" DOUBLE PRECISION NOT NULL,
    "wardsPlaced" INTEGER NOT NULL,
    "goldEarned" INTEGER NOT NULL,
    "performanceScore" DOUBLE PRECISION NOT NULL,
    "performancePlacement" INTEGER NOT NULL,
    "totalHealsOnTeammates" INTEGER NOT NULL,
    "totalDamageShieldedOnTeammates" INTEGER NOT NULL,
    "totalDamageTaken" INTEGER NOT NULL,
    "totalDamageDealtToChampions" INTEGER NOT NULL,
    "individualPosition" TEXT NOT NULL,
    "win" BOOLEAN NOT NULL,
    "champLevelArena" INTEGER,
    "playerSubteamId" INTEGER,
    "matchId" TEXT NOT NULL,
    "championId" TEXT NOT NULL,
    "summonerSpell1Id" BIGINT NOT NULL,
    "summonerSpell2Id" BIGINT NOT NULL,
    "itemIds" INTEGER[],
    "runeIds" INTEGER[],
    "statPerkIds" INTEGER[],
    "arenaStatsId" TEXT,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArenaStats" (
    "id" TEXT NOT NULL,
    "placement" INTEGER NOT NULL,
    "playerSubteamId" INTEGER NOT NULL,

    CONSTRAINT "ArenaStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantItem" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ParticipantItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantRune" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "runeId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,

    CONSTRAINT "ParticipantRune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantStatPerk" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "statPerkId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ParticipantStatPerk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArenaStatsAugment" (
    "id" TEXT NOT NULL,
    "arenaStatsId" TEXT NOT NULL,
    "augmentId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ArenaStatsAugment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Champion" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" JSONB NOT NULL,
    "skins" JSONB NOT NULL,
    "lore" TEXT NOT NULL,
    "blurb" TEXT NOT NULL,
    "allytips" TEXT[],
    "enemytips" TEXT[],
    "tags" TEXT[],
    "partype" TEXT NOT NULL,
    "info" JSONB NOT NULL,
    "stats" JSONB NOT NULL,
    "spells" JSONB NOT NULL,
    "passive" JSONB NOT NULL,
    "recommended" TEXT[],

    CONSTRAINT "Champion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SummonerSpell" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "summonerLevel" INTEGER NOT NULL,
    "cooldown" INTEGER NOT NULL,
    "gameModes" JSONB NOT NULL,
    "iconPath" TEXT NOT NULL,

    CONSTRAINT "SummonerSpell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "inStore" BOOLEAN NOT NULL,
    "from" JSONB,
    "to" JSONB,
    "categories" JSONB,
    "maxStacks" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "priceTotal" INTEGER NOT NULL,
    "iconPath" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuneTree" (
    "id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slots" JSONB NOT NULL,

    CONSTRAINT "RuneTree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rune" (
    "id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "longDesc" TEXT NOT NULL,
    "runeTreeId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL,

    CONSTRAINT "Rune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatPerk" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "longDesc" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "StatPerk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Augment" (
    "id" INTEGER NOT NULL,
    "apiName" TEXT NOT NULL,
    "calculations" JSONB NOT NULL,
    "dataValues" JSONB NOT NULL,
    "desc" TEXT NOT NULL,
    "iconLarge" TEXT NOT NULL,
    "iconSmall" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rarity" INTEGER NOT NULL,
    "tooltip" TEXT NOT NULL,

    CONSTRAINT "Augment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RiotAccount_riotAccountDetailsPuuid_key" ON "RiotAccount"("riotAccountDetailsPuuid");

-- CreateIndex
CREATE UNIQUE INDEX "RiotAccount_leagueAccountId_key" ON "RiotAccount"("leagueAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueAccount_leagueAccountDetailsId_key" ON "LeagueAccount"("leagueAccountDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueAccountDetails_accountId_key" ON "LeagueAccountDetails"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueAccountDetails_puuid_key" ON "LeagueAccountDetails"("puuid");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_arenaStatsId_key" ON "Participant"("arenaStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantItem_participantId_position_key" ON "ParticipantItem"("participantId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantRune_participantId_slot_key" ON "ParticipantRune"("participantId", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantStatPerk_participantId_position_key" ON "ParticipantStatPerk"("participantId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ArenaStatsAugment_arenaStatsId_position_key" ON "ArenaStatsAugment"("arenaStatsId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Champion_key_key" ON "Champion"("key");

-- CreateIndex
CREATE UNIQUE INDEX "RuneTree_key_key" ON "RuneTree"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Rune_key_key" ON "Rune"("key");

-- AddForeignKey
ALTER TABLE "RiotAccount" ADD CONSTRAINT "RiotAccount_riotAccountDetailsPuuid_fkey" FOREIGN KEY ("riotAccountDetailsPuuid") REFERENCES "RiotAccountDetails"("puuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiotAccount" ADD CONSTRAINT "RiotAccount_leagueAccountId_fkey" FOREIGN KEY ("leagueAccountId") REFERENCES "LeagueAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueAccount" ADD CONSTRAINT "LeagueAccount_leagueAccountDetailsId_fkey" FOREIGN KEY ("leagueAccountDetailsId") REFERENCES "LeagueAccountDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueAccount" ADD CONSTRAINT "LeagueAccount_leagueSoloRankId_fkey" FOREIGN KEY ("leagueSoloRankId") REFERENCES "LeagueRank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueAccount" ADD CONSTRAINT "LeagueAccount_leagueFlexRankId_fkey" FOREIGN KEY ("leagueFlexRankId") REFERENCES "LeagueRank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "RiotAccount"("riotAccountDetailsPuuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_championId_fkey" FOREIGN KEY ("championId") REFERENCES "Champion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_summonerSpell1Id_fkey" FOREIGN KEY ("summonerSpell1Id") REFERENCES "SummonerSpell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_summonerSpell2Id_fkey" FOREIGN KEY ("summonerSpell2Id") REFERENCES "SummonerSpell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_arenaStatsId_fkey" FOREIGN KEY ("arenaStatsId") REFERENCES "ArenaStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantItem" ADD CONSTRAINT "ParticipantItem_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantItem" ADD CONSTRAINT "ParticipantItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantRune" ADD CONSTRAINT "ParticipantRune_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantRune" ADD CONSTRAINT "ParticipantRune_runeId_fkey" FOREIGN KEY ("runeId") REFERENCES "Rune"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantStatPerk" ADD CONSTRAINT "ParticipantStatPerk_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantStatPerk" ADD CONSTRAINT "ParticipantStatPerk_statPerkId_fkey" FOREIGN KEY ("statPerkId") REFERENCES "StatPerk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArenaStatsAugment" ADD CONSTRAINT "ArenaStatsAugment_arenaStatsId_fkey" FOREIGN KEY ("arenaStatsId") REFERENCES "ArenaStats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArenaStatsAugment" ADD CONSTRAINT "ArenaStatsAugment_augmentId_fkey" FOREIGN KEY ("augmentId") REFERENCES "Augment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rune" ADD CONSTRAINT "Rune_runeTreeId_fkey" FOREIGN KEY ("runeTreeId") REFERENCES "RuneTree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
