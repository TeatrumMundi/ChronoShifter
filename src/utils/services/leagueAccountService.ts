import { LeagueAccountDetails, LeagueRank } from "@/interfaces/productionTypes";
import getSummonerByPuuid from "@/utils/fetchLeagueAPI/LeagueAccountDetails_API";
import { saveLeagueAccountDetails, } from "@/utils/database/POST/postLeagueAccountDetails_DB";
import { getLeagueAccountDetailsByPuuid } from "../database/GET/getLeagueAccountDetails";

/**
 * Service for managing League Account Details with intelligent caching.
 * 
 * This service provides a unified interface for retrieving League account details
 * with the following logic:
 * 1. If force=true: Always fetch from API and save to DB
 * 2. If force=false: Try DB first, fallback to API if not found, then save to DB
 * 3. Handles rank data integration for complete account information
 * 
 * @param puuid - Player's unique universal identifier
 * @param region - Regional routing value (europe, americas, asia)
 * @param activeRegion - Platform routing value (euw1, na1, etc.)
 * @param force - Whether to force API fetch regardless of DB status
 * @param leagueSoloRank - Optional solo queue rank data to save with account
 * @param leagueFlexRank - Optional flex queue rank data to save with account
 * @returns Promise resolving to LeagueAccountDetails with all relations
 * 
 * @example
 * ```typescript
 * // Get from cache if available, otherwise API
 * const account = await getLeagueAccountDetails(puuid, "europe", "euw1");
 * 
 * // Force fresh data from API
 * const freshAccount = await getLeagueAccountDetails(puuid, "europe", "euw1", true);
 * 
 * // Include rank data
 * const accountWithRanks = await getLeagueAccountDetails(
 *   puuid, "europe", "euw1", false, soloRank, flexRank
 * );
 * ```
 */
export async function getLeagueAccountDetails(
    puuid: string,
    region: string,
    activeRegion: string,
    force: boolean = false,
    leagueSoloRank?: LeagueRank,
    leagueFlexRank?: LeagueRank
): Promise<LeagueAccountDetails> {
    // Input validation
    if (!puuid || !region || !activeRegion) {
        throw new Error('PUUID, region, and activeRegion are required');
    }

    try {
        let leagueAccountDetails: LeagueAccountDetails | null = null;
        let fromDatabase = false;

        // Step 1: Try to get from database if not forcing API call
        if (!force) {
            // Attempt to retrieve from database
            const dbResult = await getLeagueAccountDetailsByPuuid(puuid, region, activeRegion);

            if (dbResult) {
                fromDatabase = true;
                // Convert bigint to number for revisionDate to match interface
                const convertedResult: LeagueAccountDetails = {
                    ...dbResult,
                    revisionDate: Number(dbResult.revisionDate)
                };
                return convertedResult;
            }
        } else { console.log(`🔄 Force refresh enabled - fetching fresh data from API for PUUID: ${puuid}`); }

        // Step 2: Fetch from API if not found in database or if forced
        const apiLeagueAccountDetails = await getSummonerByPuuid(puuid, region, activeRegion);
        
        if (!apiLeagueAccountDetails) { throw new Error(`Failed to fetch League account details from API for PUUID: ${puuid}`); }

        leagueAccountDetails = apiLeagueAccountDetails;

        // Step 3: Save to database (for new accounts or forced updates)
        if (!fromDatabase || force) {
            console.log(`💾 Saving League account to database for PUUID: ${puuid}`);
            
            try {
                const savedLeagueAccountDetails = await saveLeagueAccountDetails(
                    leagueAccountDetails,
                    leagueSoloRank,
                    leagueFlexRank
                );

                if (savedLeagueAccountDetails) {
                    console.log(`✅ Successfully saved League account to database for PUUID: ${puuid}`);
                    
                    // Convert bigint to number for revisionDate to match interface
                    const convertedSavedResult: LeagueAccountDetails = {
                        ...savedLeagueAccountDetails,
                        revisionDate: Number(savedLeagueAccountDetails.revisionDate)
                    };
                    return convertedSavedResult;
                } else {
                    console.warn(`⚠️ Save operation returned null for PUUID: ${puuid}, returning API data`);
                    return leagueAccountDetails;
                }
            } catch (saveError) {
                console.error(`❌ Failed to save League account to database for PUUID: ${puuid}:`, saveError);
                console.log(`📤 Returning API data despite save failure for PUUID: ${puuid}`);
                return leagueAccountDetails;
            }
        }

        return leagueAccountDetails;

    } catch (error) {
        console.error(`❌ Error in getLeagueAccountDetails for PUUID ${puuid}:`, error);
        
        // If this was a forced call and it failed, try to return cached data as fallback
        if (force) {
            console.log(`🔄 Force call failed, attempting to retrieve cached data for PUUID: ${puuid}`);
            try {
                const fallbackResult = await getLeagueAccountDetailsByPuuid(puuid, region, activeRegion);
                if (fallbackResult) {
                    console.log(`💾 Returning cached data as fallback for PUUID: ${puuid}`);
                    
                    // Convert bigint to number for revisionDate to match interface
                    const convertedFallbackResult: LeagueAccountDetails = {
                        ...fallbackResult,
                        revisionDate: Number(fallbackResult.revisionDate)
                    };
                    return convertedFallbackResult;
                }
            } catch (fallbackError) {
                console.error(`❌ Fallback retrieval also failed for PUUID: ${puuid}:`, fallbackError);
            }
        }

        throw error;
    }
}