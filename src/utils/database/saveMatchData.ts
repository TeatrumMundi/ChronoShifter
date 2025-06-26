import { PrismaClient } from "@prisma/client";
import { Match } from "@/interfaces/productionTypes";

const prisma = new PrismaClient();

/**
 * Saves match data including match details and all participants to the database.
 * Participants are automatically linked to RiotAccounts via their PUUID.
 * 
 * @param match - Complete match object with participants and timeline data
 * @returns Promise that resolves to the saved Match record
 * @throws {Error} When required parameters are missing or database operations fail
 * 
 * @example
 * ```typescript
 * const savedMatch = await saveMatchData(matchObject);
 * console.log(`Saved match: ${savedMatch.matchId}`);
 * ```
 */
export async function saveMatchData(match: Match) {
    // Validate required input parameters
    if (!match || !match.matchId) {
        throw new Error('Match with valid matchId required');
    }

    if (!match.participants || match.participants.length === 0) {
        throw new Error('Match must contain participants');
    }

    try {
        // Use database transaction with extended timeout
        return await prisma.$transaction(async (transaction) => {
            
            // Step 1: Check if match already exists in database
            const existingMatch = await transaction.match.findUnique({
                where: { matchId: match.matchId.toString() },
                include: {
                    participants: true
                }
            });

            if (existingMatch) {
                console.log(`Match ${match.matchId} already exists in database`);
                return existingMatch;
            }

            // Step 2: Create new Match record
            const matchDetails = await transaction.match.create({
                data: {
                    matchId: match.matchId.toString(),
                    gameDuration: match.gameDuration,
                    gameCreation: BigInt(match.gameCreation),
                    gameEndTimestamp: BigInt(match.gameEndTimestamp),
                    gameMode: match.gameMode,
                    gameType: match.gameType,
                    queueId: match.queueId,
                    timelineData: JSON.parse(JSON.stringify(match.timelineData))
                }
            });

            // Create missing RiotAccounts for all participants
            const participantPuuids = match.participants.map(p => p.puuid);
            const existingRiotAccounts = await transaction.riotAccount.findMany({
                where: { riotAccountDetailsPuuid: { in: participantPuuids } }
            });

            const existingPuuids = existingRiotAccounts.map(acc => acc.riotAccountDetailsPuuid);
            const missingPuuids = participantPuuids.filter(puuid => !existingPuuids.includes(puuid));

            // Create missing RiotAccountDetails and RiotAccounts
            for (const puuid of missingPuuids) {
                const participant = match.participants.find(p => p.puuid === puuid);
                if (participant) {
                    // Create RiotAccountDetails
                    await transaction.riotAccountDetails.create({
                        data: {
                            puuid: puuid,
                            gameName: participant.riotIdGameName,
                            tagLine: participant.riotIdTagline
                        }
                    });

                    // Create RiotAccount
                    await transaction.riotAccount.create({
                        data: {
                            riotAccountDetailsPuuid: puuid
                        }
                    });
                }
            }

            // Step 3: Create participants in batches to improve performance
            const batchSize = 5; // Process 5 participants at a time
            for (let i = 0; i < match.participants.length; i += batchSize) {
                const batch = match.participants.slice(i, i + batchSize);
                
                await Promise.all(
                    batch.map(async (participant) => {
                        // Extract IDs from objects for the array fields
                        const itemIds = participant.items?.filter(item => item && item.id).map(item => item.id) || [];
                        const runeIds = participant.runes?.filter(rune => rune && rune.id).map(rune => rune.id) || [];
                        
                        // Handle statPerks - could be array or object
                        let statPerkIds: number[] = [];
                        if (participant.statPerks) {
                            const statPerksArray = Array.isArray(participant.statPerks) 
                                ? participant.statPerks 
                                : Object.values(participant.statPerks);
                            statPerkIds = statPerksArray.filter(perk => perk && perk.id).map(perk => perk.id);
                        }

                        // Create the participant - PUUID will automatically link to RiotAccount if it exists
                        await transaction.participant.create({
                            data: {
                                puuid: participant.puuid,
                                participantId: participant.participantId,
                                riotIdGameName: participant.riotIdGameName,
                                riotIdTagline: participant.riotIdTagline,
                                summonerName: participant.summonerName,
                                region: participant.region,
                                activeRegion: participant.activeRegion,
                                teamId: participant.teamId,
                                teamPosition: participant.teamPosition,
                                champLevel: participant.champLevel,
                                kills: participant.kills,
                                deaths: participant.deaths,
                                assists: participant.assists,
                                kda: participant.kda,
                                totalMinionsKilled: participant.totalMinionsKilled,
                                neutralMinionsKilled: participant.neutralMinionsKilled,
                                allMinionsKilled: participant.allMinionsKilled,
                                minionsPerMinute: participant.minionsPerMinute,
                                visionScore: participant.visionScore,
                                visionPerMinute: participant.visionPerMinute,
                                wardsPlaced: participant.wardsPlaced,
                                goldEarned: participant.goldEarned,
                                performanceScore: participant.performanceScore,
                                performancePlacement: participant.performancePlacement,
                                totalHealsOnTeammates: participant.totalHealsOnTeammates,
                                totalDamageShieldedOnTeammates: participant.totalDamageShieldedOnTeammates,
                                totalDamageTaken: participant.totalDamageTaken,
                                totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
                                individualPosition: participant.individualPosition,
                                win: participant.win,
                                champLevelArena: participant.arenaStats?.placement || null,
                                playerSubteamId: participant.arenaStats?.playerSubteamId || null,
                                matchId: matchDetails.matchId,
                                championId: participant.champion.id,
                                summonerSpell1Id: BigInt(participant.summonerSpell1.id),
                                summonerSpell2Id: BigInt(participant.summonerSpell2.id),
                                
                                itemIds: itemIds,
                                runeIds: runeIds,
                                statPerkIds: statPerkIds,                              
                                arenaStats: participant.arenaStats ? JSON.parse(JSON.stringify(participant.arenaStats)) : null
                            }
                        });
                    })
                );
            }

            console.log(`Created new match ${match.matchId} with ${match.participants.length} participants`);
            return matchDetails;
        }, {
            timeout: 15000,
        });
    } catch (error) {
        console.error(`Error saving match data for ${match.matchId}:`, error);
        throw error;
    }
}

/**
 * Saves multiple matches to the database.
 * Processes matches sequentially to avoid database conflicts.
 * 
 * @param matches - Array of Match objects to save
 * @returns Promise that resolves to array of saved Match records
 * @throws {Error} When required parameters are missing or database operations fail
 * 
 * @example
 * ```typescript
 * const savedMatches = await saveMatchHistory(matchArray);
 * console.log(`Saved ${savedMatches.length} matches`);
 * ```
 */
export async function saveMatchHistory(matches: Match[]) {
    if (!matches || matches.length === 0) {
        console.log('No matches to save');
        return [];
    }

    const savedMatches = [];
    
    // Process matches sequentially to avoid potential database conflicts
    for (const match of matches) {
        try {
            const savedMatch = await saveMatchData(match);
            savedMatches.push(savedMatch);
        } catch (error) {
            console.error(`Failed to save match ${match.matchId}:`, error);
            // Continue with next match instead of failing completely
        }
    }

    console.log(`Successfully saved ${savedMatches.length}/${matches.length} matches`);
    return savedMatches;
}