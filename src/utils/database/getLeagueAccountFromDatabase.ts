import { PrismaClient } from "@prisma/client";
import { RiotAccountDetails, LeagueAccountDetails, LeagueRank } from "@/interfaces/productionTypes";

const prisma = new PrismaClient();

/**
 * Retrieves complete League account data from the database by gameName and tagLine.
 * This function checks if the user data already exists in the database to avoid unnecessary API calls.
 * 
 * @param gameName - The game name part of the Riot ID (e.g., "Player" from "Player#EUW")
 * @param tagLine - The tag line part of the Riot ID (e.g., "EUW" from "Player#EUW")
 * @param region - The regional routing value (e.g., "europe", "americas", "asia")
 * @returns Promise that resolves to complete user data or null if not found
 * @throws {Error} When database query fails
 * 
 * @example
 * ```typescript
 * const userData = await getLeagueAccountFromDatabase("PlayerName", "EUW", "europe");
 * if (userData) {
 *   console.log(`Found cached data for ${userData.riotAccountDetails.gameName}`);
 * }
 * ```
 */
export async function getLeagueAccountFromDatabase(
    gameName: string,
    tagLine: string,
    region: string
): Promise<{
    riotAccountDetails: RiotAccountDetails;
    leagueAccountDetails: LeagueAccountDetails;
    leagueSoloRank: LeagueRank;
    leagueFlexRank: LeagueRank;
    activeRegion: string;
} | null> {
    try {
        // Query the database for existing account data
        // We search by gameName, tagLine, and ensure the account has League data for the specified region
        const riotAccountDetails = await prisma.riotAccountDetails.findFirst({
            where: {
                gameName: gameName,
                tagLine: tagLine,
                riotAccount: {
                    leagueAccount: {
                        leagueAccountDetails: {
                            region: region
                        }
                    }
                }
            },
            include: {
                riotAccount: {
                    include: {
                        leagueAccount: {
                            include: {
                                leagueAccountDetails: true,
                                leagueSoloRank: true,
                                leagueFlexRank: true
                            }
                        }
                    }
                }
            }
        });

        // If no data found, return null
        if (!riotAccountDetails || !riotAccountDetails.riotAccount?.leagueAccount) {
            console.log(`No cached data found for ${gameName}#${tagLine} in ${region}`);
            return null;
        }

        const leagueAccount = riotAccountDetails.riotAccount.leagueAccount;
        const leagueAccountDetails = leagueAccount.leagueAccountDetails;

        // Create default ranks if they don't exist
        const defaultSoloRank: LeagueRank = {
            queueType: "RANKED_SOLO_5x5",
            tier: "UNRANKED",
            rank: "",
            leaguePoints: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            hotStreak: false
        };

        const defaultFlexRank: LeagueRank = {
            queueType: "RANKED_FLEX_SR",
            tier: "UNRANKED",
            rank: "",
            leaguePoints: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            hotStreak: false
        };

        console.log(`Found cached data for ${gameName}#${tagLine} in ${region}`);
        return {
            riotAccountDetails: {
                puuid: riotAccountDetails.puuid,
                gameName: riotAccountDetails.gameName,
                tagLine: riotAccountDetails.tagLine
            },
            leagueAccountDetails: {
                id: leagueAccountDetails.id,
                accountId: leagueAccountDetails.accountId,
                puuid: leagueAccountDetails.puuid,
                region: leagueAccountDetails.region,
                activeRegion: leagueAccountDetails.activeRegion,
                profileIconId: leagueAccountDetails.profileIconId,
                revisionDate: Number(leagueAccountDetails.revisionDate),
                summonerLevel: leagueAccountDetails.summonerLevel
            },
            leagueSoloRank: leagueAccount.leagueSoloRank || defaultSoloRank,
            leagueFlexRank: leagueAccount.leagueFlexRank || defaultFlexRank,
            activeRegion: leagueAccountDetails.activeRegion
        };

    } catch (error) {
        console.error(`Error fetching account data from database for ${gameName}#${tagLine}:`, error);
        // Return null instead of throwing to allow fallback to API
        return null;
    }
}

/**
 * Checks if account data exists in database and is recent.
 * This can be used to determine if we should refresh the data with new API calls.
 * 
 * @param gameName - The game name part of the Riot ID
 * @param tagLine - The tag line part of the Riot ID
 * @param region - The regional routing value
 * @param maxAgeHours - Maximum age in hours before data is considered stale (default: 24 hours)
 * @returns Promise that resolves to boolean indicating if recent data exists
 */
export async function hasRecentAccountData(
    gameName: string,
    tagLine: string,
    region: string,
    maxAgeHours: number = 24
): Promise<boolean> {
    try {
        const maxAgeMs = Date.now() - (maxAgeHours * 60 * 60 * 1000);
        
        const recentData = await prisma.riotAccountDetails.findFirst({
            where: {
                gameName: gameName,
                tagLine: tagLine,
                riotAccount: {
                    leagueAccount: {
                        leagueAccountDetails: {
                            region: region,
                            revisionDate: {
                                gte: maxAgeMs
                            }
                        }
                    }
                }
            }
        });

        return !!recentData;
    } catch (error) {
        console.error(`Error checking recent account data for ${gameName}#${tagLine}:`, error);
        return false;
    }
}
