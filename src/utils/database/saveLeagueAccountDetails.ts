import { PrismaClient } from "@prisma/client";
import { LeagueAccountDetails, LeagueRank } from "@/interfaces/productionTypes";

const prisma = new PrismaClient();

export async function saveLeagueAccountDetails(
    leagueAccountDetails: LeagueAccountDetails,
    leagueSoloRank?: LeagueRank,
    leagueFlexRank?: LeagueRank
) {
    if (!leagueAccountDetails || !leagueAccountDetails.puuid || !leagueAccountDetails.accountId) {
        throw new Error('LeagueAccountDetails with valid puuid and accountId required');
    }

    try {
        return await prisma.$transaction(async (tx) => {
            // Check if LeagueAccountDetails already exists
            const existingLeagueAccountDetails = await tx.leagueAccountDetails.findUnique({
                where: { accountId: leagueAccountDetails.accountId },
                include: {
                    leagueAccount: {
                        include: {
                            riotAccount: {
                                include: {
                                    riotAccountDetails: true
                                }
                            }
                        }
                    }
                }
            });

            if (existingLeagueAccountDetails) {
                console.log(`LeagueAccountDetails already exists for accountId: ${leagueAccountDetails.accountId}`);
                return existingLeagueAccountDetails;
            }

            // Create LeagueAccountDetails
            const newLeagueAccountDetails = await tx.leagueAccountDetails.create({
                data: {
                    accountId: leagueAccountDetails.accountId,
                    puuid: leagueAccountDetails.puuid,
                    region: leagueAccountDetails.region,
                    activeRegion: leagueAccountDetails.activeRegion,
                    profileIconId: leagueAccountDetails.profileIconId,
                    revisionDate: leagueAccountDetails.revisionDate,
                    summonerLevel: leagueAccountDetails.summonerLevel
                }
            });

            // Handle LeagueRanks (create or find existing)
            let soloRankId: string | null = null;
            let flexRankId: string | null = null;

            if (leagueSoloRank && leagueSoloRank.tier !== "UNRANKED") {
                const soloRank = await tx.leagueRank.create({
                    data: {
                        queueType: leagueSoloRank.queueType,
                        tier: leagueSoloRank.tier,
                        rank: leagueSoloRank.rank,
                        leaguePoints: leagueSoloRank.leaguePoints,
                        wins: leagueSoloRank.wins,
                        losses: leagueSoloRank.losses,
                        winRate: leagueSoloRank.winRate,
                        hotStreak: leagueSoloRank.hotStreak
                    }
                });
                soloRankId = soloRank.id;
            }

            if (leagueFlexRank && leagueFlexRank.tier !== "UNRANKED") {
                const flexRank = await tx.leagueRank.create({
                    data: {
                        queueType: leagueFlexRank.queueType,
                        tier: leagueFlexRank.tier,
                        rank: leagueFlexRank.rank,
                        leaguePoints: leagueFlexRank.leaguePoints,
                        wins: leagueFlexRank.wins,
                        losses: leagueFlexRank.losses,
                        winRate: leagueFlexRank.winRate,
                        hotStreak: leagueFlexRank.hotStreak
                    }
                });
                flexRankId = flexRank.id;
            }

            // Create LeagueAccount
            const newLeagueAccount = await tx.leagueAccount.create({
                data: {
                    leagueAccountDetailsId: newLeagueAccountDetails.id,
                    leagueSoloRankId: soloRankId,
                    leagueFlexRankId: flexRankId
                }
            });

            // Check if RiotAccount exists for this PUUID
            let riotAccount = await tx.riotAccount.findFirst({
                where: {
                    riotAccountDetailsPuuid: leagueAccountDetails.puuid
                },
                include: {
                    riotAccountDetails: true
                }
            });

            // If RiotAccount exists, link it to the new LeagueAccount
            if (riotAccount) {
                await tx.riotAccount.update({
                    where: { id: riotAccount.id },
                    data: { leagueAccountId: newLeagueAccount.id }
                });
                console.log(`Linked existing RiotAccount (${riotAccount.id}) to new LeagueAccount (${newLeagueAccount.id})`);
            } else {
                // Create a minimal RiotAccountDetails if it doesn't exist
                console.warn(`No RiotAccount found for PUUID: ${leagueAccountDetails.puuid}. Creating minimal RiotAccountDetails.`);
                
                await tx.riotAccountDetails.create({
                    data: {
                        puuid: leagueAccountDetails.puuid,
                        gameName: "Unknown",
                        tagLine: "Unknown"
                    }
                });

                riotAccount = await tx.riotAccount.create({
                    data: {
                        riotAccountDetailsPuuid: leagueAccountDetails.puuid,
                        leagueAccountId: newLeagueAccount.id
                    },
                    include: {
                        riotAccountDetails: true
                    }
                });

                console.log(`Created new RiotAccount (${riotAccount.id}) and linked to LeagueAccount (${newLeagueAccount.id})`);
            }

            return await tx.leagueAccountDetails.findUnique({
                where: { id: newLeagueAccountDetails.id },
                include: {
                    leagueAccount: {
                        include: {
                            leagueSoloRank: true,
                            leagueFlexRank: true,
                            riotAccount: {
                                include: {
                                    riotAccountDetails: true
                                }
                            }
                        }
                    }
                }
            });
        });
    } catch (error) {
        console.error(`Error saving LeagueAccountDetails for ${leagueAccountDetails.accountId}:`, error);
        throw error;
    }
}