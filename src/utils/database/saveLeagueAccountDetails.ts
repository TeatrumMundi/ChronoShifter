import { PrismaClient } from "@prisma/client";
import { LeagueAccountDetails, LeagueRank } from "@/interfaces/productionTypes";

// Singleton pattern for Prisma client to avoid connection pool issues during development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Saves LeagueAccountDetails to the database if not already present and creates corresponding LeagueAccount.
 * Links to existing RiotAccount or creates one if it doesn't exist.
 * 
 * This function performs a complete database transaction to:
 * 1. Check if LeagueAccountDetails already exists
 * 2. Create LeagueAccountDetails, LeagueRanks, and LeagueAccount
 * 3. Link to existing RiotAccount or create a new one
 * 4. Return the complete data structure with all relations
 * 
 * @param leagueAccountDetails - The League account details to save (summoner info, region, etc.)
 * @param leagueSoloRank - Optional solo queue rank information
 * @param leagueFlexRank - Optional flex queue rank information
 * @returns Promise that resolves to LeagueAccountDetails with all nested relations
 * @throws {Error} When required parameters are missing or database operations fail
 * 
 * @example
 * ```typescript
 * const result = await saveLeagueAccountDetails(
 *   leagueDetails, 
 *   soloRank, 
 *   flexRank
 * );
 * console.log(`Saved account: ${result.accountId}`);
 * ```
 */
export async function saveLeagueAccountDetails(
    leagueAccountDetails: LeagueAccountDetails,
    leagueSoloRank?: LeagueRank,
    leagueFlexRank?: LeagueRank
) {
    // Validate required input parameters
    if (!leagueAccountDetails || !leagueAccountDetails.puuid || !leagueAccountDetails.accountId) {
        throw new Error('LeagueAccountDetails with valid puuid and accountId required');
    }

    try {
        // Use database transaction to ensure data consistency across multiple operations
        return await prisma.$transaction(async (tx) => {
            
            // Step 1: Check if LeagueAccountDetails already exists in database
            // If found, return existing data to avoid duplicates
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

            // Early return if account already exists - no need to create duplicates
            if (existingLeagueAccountDetails) {
                console.log(`LeagueAccountDetails already exists for accountId: ${leagueAccountDetails.accountId}`);
                return existingLeagueAccountDetails;
            }

            // Step 2: Create new LeagueAccountDetails record
            // This contains basic summoner information (level, icon, region, etc.)
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

            // Step 3: Handle LeagueRank creation (for both solo and flex queues)
            // Only create rank records if player is actually ranked (not UNRANKED)
            let soloRankId: string | null = null;
            let flexRankId: string | null = null;

            // Create solo queue rank record if player has solo rank data
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

            // Create flex queue rank record if player has flex rank data
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

            // Step 4: Create LeagueAccount that links details and ranks together
            // This serves as the main League of Legends account record
            const newLeagueAccount = await tx.leagueAccount.create({
                data: {
                    leagueAccountDetailsId: newLeagueAccountDetails.id,
                    leagueSoloRankId: soloRankId,     // null if unranked
                    leagueFlexRankId: flexRankId      // null if unranked
                }
            });

            // Step 5: Handle RiotAccount linking/creation
            // Check if a RiotAccount already exists for this PUUID
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
                // No RiotAccount exists - create minimal RiotAccountDetails and RiotAccount
                // Note: This creates placeholder data that should be updated when proper Riot account data is available
                console.warn(`No RiotAccount found for PUUID: ${leagueAccountDetails.puuid}. Creating minimal RiotAccountDetails.`);
                
                // Create minimal RiotAccountDetails with placeholder values
                await tx.riotAccountDetails.create({
                    data: {
                        puuid: leagueAccountDetails.puuid,
                        gameName: "Unknown",    // Should be updated when real data is available
                        tagLine: "Unknown"      // Should be updated when real data is available
                    }
                });

                // Create RiotAccount that links to both RiotAccountDetails and LeagueAccount
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

            // Step 6: Return complete LeagueAccountDetails with all nested relations
            // This provides the caller with the full data structure including all linked records
            return await tx.leagueAccountDetails.findUnique({
                where: { id: newLeagueAccountDetails.id },
                include: {
                    leagueAccount: {
                        include: {
                            leagueSoloRank: true,           // Include solo queue rank if exists
                            leagueFlexRank: true,           // Include flex queue rank if exists
                            riotAccount: {
                                include: {
                                    riotAccountDetails: true // Include Riot account details
                                }
                            }
                        }
                    }
                }
            });
        });
    } catch (error) {
        // Log detailed error information for debugging
        console.error(`Error saving LeagueAccountDetails for ${leagueAccountDetails.accountId}:`, error);
        throw error; // Re-throw to allow caller to handle the error
    }
}