import { createPrismaClient } from "@/utils/helpers";

// Create singleton Prisma client
const prisma = createPrismaClient();

/**
 * Retrieves LeagueAccountDetails from the database by PUUID, region, and active region.
 * Returns the complete LeagueAccountDetails with all nested relations.
 * 
 * @param puuid - The player's unique universal identifier
 * @param region - The region where the account was looked up (Europe, Asia, Americas)
 * @param activeRegion - The specific active region (e.g., euw1, na1, kr, etc.)
 * @returns Promise that resolves to LeagueAccountDetails with all relations, or null if not found
 * @throws {Error} When required parameters are missing or database operations fail
 * 
 */
export async function getLeagueAccountDetailsByPuuid(
    puuid: string,
    region: string,
    activeRegion: string
) {
    // Validate required input parameters
    if (!puuid || !region || !activeRegion) {
        throw new Error('PUUID, region, and activeRegion are required');
    }
    console.log(`🔍 Checking database for League account: ${puuid} in ${region}/${activeRegion}`);

    try {
        // Query the database for LeagueAccountDetails with the specified criteria
        const leagueAccountDetails = await prisma.leagueAccountDetails.findFirst({
            where: {
                puuid: puuid,
                region: region,
                activeRegion: activeRegion
            },
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

        if (leagueAccountDetails) {
            console.log(`✅ Found LeagueAccountDetails for PUUID in database: ${puuid} in ${region}/${activeRegion}\n`);
        } else {
            console.log(`🟡 No LeagueAccountDetails found for PUUID in database: ${puuid} in ${region}/${activeRegion}\n`);
        }

        return leagueAccountDetails;
    } catch (error) {
        console.error(`❌ Error retrieving LeagueAccountDetails for PUUID from database: ${puuid}:`, error);
        throw error;
    }
}