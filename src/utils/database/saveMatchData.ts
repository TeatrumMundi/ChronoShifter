import { PrismaClient } from "@prisma/client";
import { Match } from "@/interfaces/productionTypes";

const prisma = new PrismaClient();

/**
 * Saves match data including match details and all participants to the database.
 * Participants are automatically linked to RiotAccounts via their PUUID.
 * Items, runes, stat perks, and arena stats are stored as proper relational objects.
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
                    queueId: match.queueId
                }
            });

            // Create timeline data separately if it exists
            if (match.timelineData) {
                try {
                    await transaction.matchTimeline.create({
                        data: {
                            matchId: matchDetails.matchId,
                            timelineData: JSON.parse(JSON.stringify(match.timelineData))
                        }
                    });
                } catch (timelineError) {
                    console.warn(`Failed to create timeline data for match ${match.matchId}:`, timelineError);
                }
            }

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
                        // Create arena stats if present and valid
                        let arenaStatsId: string | null = null;
                        if (participant.arenaStats && 
                            participant.arenaStats.placement !== undefined && 
                            participant.arenaStats.playerSubteamId !== undefined) {
                            try {
                                const arenaStats = await transaction.arenaStats.create({
                                    data: {
                                        placement: participant.arenaStats.placement,
                                        playerSubteamId: participant.arenaStats.playerSubteamId
                                    }
                                });
                                arenaStatsId = arenaStats.id;

                                // Create arena stats augments if present
                                if (participant.arenaStats.augments && 
                                    Array.isArray(participant.arenaStats.augments) && 
                                    participant.arenaStats.augments.length > 0) {
                                    
                                    const validAugments = participant.arenaStats.augments.filter(augment => augment && augment.id);
                                    
                                    // First, ensure all augments exist in the database
                                    for (const augment of validAugments) {
                                        try {
                                            await transaction.augment.upsert({
                                                where: { id: augment.id },
                                                update: {}, // Don't update if exists
                                                create: {
                                                    id: augment.id,
                                                    apiName: augment.apiName || '',
                                                    calculations: augment.calculations || {},
                                                    dataValues: augment.dataValues || {},
                                                    desc: augment.desc || '',
                                                    iconLarge: augment.iconLarge || '',
                                                    iconSmall: augment.iconSmall || '',
                                                    name: augment.name || '',
                                                    rarity: augment.rarity || 0,
                                                    tooltip: augment.tooltip || ''
                                                }
                                            });
                                        } catch (augmentUpsertError) {
                                            console.warn(`Failed to upsert augment ${augment.id}:`, augmentUpsertError);
                                        }
                                    }

                                    // Now create the arena stats augments
                                    await Promise.all(
                                        validAugments.map(async (augment, index) => {
                                            try {
                                                await transaction.arenaStatsAugment.create({
                                                    data: {
                                                        arenaStatsId: arenaStats.id,
                                                        augmentId: augment.id,
                                                        position: index
                                                    }
                                                });
                                            } catch (arenaStatsAugmentError) {
                                                console.warn(`Failed to create arena stats augment for augment ${augment.id}:`, arenaStatsAugmentError);
                                            }
                                        })
                                    );
                                }
                            } catch (arenaError) {
                                console.warn(`Failed to create arena stats for participant ${participant.puuid}:`, arenaError);
                                arenaStatsId = null;
                            }
                        }

                        // Create the participant - PUUID will automatically link to RiotAccount if it exists
                        const createdParticipant = await transaction.participant.create({
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
                                matchId: matchDetails.matchId,
                                championId: participant.champion.id,
                                summonerSpell1Id: BigInt(participant.summonerSpell1.id),
                                summonerSpell2Id: BigInt(participant.summonerSpell2.id),
                                arenaStatsId: arenaStatsId
                            }
                        });

                        // Create participant items with position tracking
                        if (participant.items && Array.isArray(participant.items) && participant.items.length > 0) {
                            try {
                                const validItems = participant.items.filter(item => item && item.id);
                                
                                // First, ensure all items exist in the database
                                for (const item of validItems) {
                                    try {
                                        await transaction.item.upsert({
                                            where: { id: item.id },
                                            update: {}, // Don't update if exists
                                            create: {
                                                id: item.id,
                                                name: item.name || '',
                                                description: item.description || '',
                                                active: item.active ?? true,
                                                inStore: item.inStore ?? true,
                                                from: item.from || null,
                                                to: item.to || null,
                                                categories: item.categories || null,
                                                maxStacks: item.maxStacks || 1,
                                                price: item.price || 0,
                                                priceTotal: item.priceTotal || 0,
                                                iconPath: item.iconPath || ''
                                            }
                                        });
                                    } catch (itemUpsertError) {
                                        console.warn(`Failed to upsert item ${item.id}:`, itemUpsertError);
                                    }
                                }

                                // Now create the participant items
                                await Promise.all(
                                    validItems.map(async (item, index) => {
                                        try {
                                            await transaction.participantItem.create({
                                                data: {
                                                    participantId: createdParticipant.id,
                                                    itemId: item.id,
                                                    position: index
                                                }
                                            });
                                        } catch (participantItemError) {
                                            console.warn(`Failed to create participant item for item ${item.id}:`, participantItemError);
                                        }
                                    })
                                );
                            } catch (itemError) {
                                console.warn(`Failed to create items for participant ${participant.puuid}:`, itemError);
                            }
                        }

                        // Create participant runes with slot tracking
                        if (participant.runes && Array.isArray(participant.runes) && participant.runes.length > 0) {
                            try {
                                await Promise.all(
                                    participant.runes
                                        .filter(rune => rune && rune.id)
                                        .map(async (rune, index) => {
                                            await transaction.participantRune.create({
                                                data: {
                                                    participantId: createdParticipant.id,
                                                    runeId: rune.id,
                                                    slot: index
                                                }
                                            });
                                        })
                                );
                            } catch (runeError) {
                                console.warn(`Failed to create runes for participant ${participant.puuid}:`, runeError);
                            }
                        }

                        // Create participant stat perks with position tracking
                        if (participant.statPerks) {
                            try {
                                const statPerksArray = Array.isArray(participant.statPerks) 
                                    ? participant.statPerks 
                                    : Object.values(participant.statPerks);
                                
                                const validStatPerks = statPerksArray.filter(perk => perk && perk.id);
                                
                                if (validStatPerks.length > 0) {
                                    // First, ensure all stat perks exist in the database
                                    for (const perk of validStatPerks) {
                                        try {
                                            await transaction.statPerk.upsert({
                                                where: { id: perk.id },
                                                update: {}, // Don't update if exists
                                                create: {
                                                    id: perk.id,
                                                    name: perk.name || '',
                                                    desc: perk.desc || '',
                                                    longDesc: perk.longDesc || '',
                                                    path: perk.path || ''
                                                }
                                            });
                                        } catch (statPerkUpsertError) {
                                            console.warn(`Failed to upsert stat perk ${perk.id}:`, statPerkUpsertError);
                                        }
                                    }

                                    // Now create the participant stat perks
                                    await Promise.all(
                                        validStatPerks.map(async (perk, index) => {
                                            try {
                                                await transaction.participantStatPerk.create({
                                                    data: {
                                                        participantId: createdParticipant.id,
                                                        statPerkId: perk.id,
                                                        position: index
                                                    }
                                                });
                                            } catch (participantStatPerkError) {
                                                console.warn(`Failed to create participant stat perk for perk ${perk.id}:`, participantStatPerkError);
                                            }
                                        })
                                    );
                                }
                            } catch (statPerkError) {
                                console.warn(`Failed to create stat perks for participant ${participant.puuid}:`, statPerkError);
                            }
                        }
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