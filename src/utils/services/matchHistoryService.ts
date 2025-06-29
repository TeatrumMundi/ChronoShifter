import { Match } from "@/interfaces/productionTypes";
import {
    getRecentMatchesIDsByPuuid,
    getMatchDetailsByMatchID,
    getMatchTimelineByMatchID
} from "@/utils/fetchLeagueAPI";
import { getPlayerMatches, matchExists, getMultipleMatches } from "../database/GET/getMatch_DB";
import { saveMatchHistory } from "../database/POST/postMatch_DB";

/**
 * Service for managing Match History with intelligent caching and API fallback.
 * 
 * This service provides a unified interface for retrieving match history data
 * with the following logic:
 * 1. If force=true: Always fetch from API and save to DB
 * 2. If force=false: Try DB first, fallback to API if not found, then save to DB
 * 3. Handles match timeline data integration for complete match information
 * 4. Supports pagination through start index and count parameters
 * 
 * @param puuid - Player's unique universal identifier
 * @param region - Regional routing value (europe, americas, asia)
 * @param activeRegion - Platform routing value (euw1, na1, etc.)
 * @param startIndex - Starting index for match history pagination (0-based)
 * @param count - Number of matches to retrieve (max recommended: 100)
 * @param force - Whether to force API fetch regardless of DB status
 * @returns Promise resolving to array of Match objects with complete data
 * 
 * @example
 * ```typescript
 * // Get last 5 matches from cache if available, otherwise API
 * const matches = await getMatchHistory("puuid", "europe", "euw1", 0, 5);
 * 
 * // Force fresh data from API for last 10 matches
 * const freshMatches = await getMatchHistory("puuid", "europe", "euw1", 0, 10, true);
 * 
 * // Get next 20 matches starting from index 20
 * const olderMatches = await getMatchHistory("puuid", "europe", "euw1", 20, 20);
 * ```
 */
export async function getMatchHistory(
    puuid: string,
    region: string,
    activeRegion: string,
    startIndex: number = 0,
    count: number = 20,
    force: boolean = false
): Promise<Match[]> {
    // Input validation
    if (!puuid || !region || !activeRegion) {
        throw new Error('PUUID, region, and activeRegion are required');
    }
    
    if (startIndex < 0) {
        throw new Error('Start index must be non-negative');
    }
    
    if (count <= 0 || count > 100) {
        throw new Error('Count must be between 1 and 100');
    }

    try {
        let matches: Match[] = [];

        // Step 1: Try to get from database if not forcing API call
        if (!force) {
            console.log(`🔍 Checking database for ${count} matches starting at index ${startIndex} for PUUID: ${puuid}`);
            
            // Get player matches from database
            const dbMatches = await getPlayerMatches(puuid, startIndex + count, false);
            
            if (dbMatches && dbMatches.length > startIndex) {
                // Apply pagination to database results
                const paginatedMatches = dbMatches.slice(startIndex, startIndex + count);
                
                if (paginatedMatches.length === count) {
                    console.log(`✅ Found ${paginatedMatches.length} matches in database for PUUID: ${puuid}`);
                    
                    // Convert database format to Match interface format
                    matches = await convertDatabaseMatchesToInterface(paginatedMatches);
                    return matches;
                } else {
                    console.log(`🟡 Database only has ${paginatedMatches.length} matches (requested ${count}), falling back to API`);
                }
            } else {
                console.log(`🟡 No matches found in database for PUUID: ${puuid}, fetching from API`);
            }
        } else {
            console.log(`🔄 Force refresh enabled - fetching fresh data from API for PUUID: ${puuid}`);
        }

        // Step 2: Fetch from API if not found in database or if forced
        console.log(`🌐 Fetching match history from API: ${count} matches starting at index ${startIndex}`);
        
        // Get match IDs from API
        const matchIds = await getRecentMatchesIDsByPuuid(puuid, region, startIndex, count);
        
        if (!matchIds || matchIds.length === 0) {
            console.log(`🟡 No match IDs returned from API for PUUID: ${puuid}`);
            return [];
        }

        console.log(`📋 Retrieved ${matchIds.length} match IDs from API`);

        // Step 3: Check which matches already exist in database (unless forcing)
        let matchesToFetch = matchIds;
        let existingMatches: Match[] = [];

        if (!force) {
            console.log(`🔍 Checking which of ${matchIds.length} matches already exist in database`);
            
            // Check existence in parallel
            const existenceChecks = await Promise.all(
                matchIds.map(async (matchId) => ({
                    matchId,
                    exists: await matchExists(matchId)
                }))
            );

            const existingMatchIds = existenceChecks
                .filter(check => check.exists)
                .map(check => check.matchId);
                
            matchesToFetch = existenceChecks
                .filter(check => !check.exists)
                .map(check => check.matchId);

            console.log(`💾 Found ${existingMatchIds.length} matches in database, need to fetch ${matchesToFetch.length} from API`);

            // Get existing matches from database
            if (existingMatchIds.length > 0) {
                const dbExistingMatches = await getMultipleMatches(existingMatchIds, true);
                existingMatches = await convertDatabaseMatchesToInterface(dbExistingMatches);
            }
        }

        // Step 4: Fetch missing matches from API
        let newMatches: Match[] = [];
        if (matchesToFetch.length > 0) {
            console.log(`🌐 Fetching ${matchesToFetch.length} matches from API`);
            
            newMatches = await Promise.all(
                matchesToFetch.map(async (matchId, index) => {
                    try {
                        // Fetch match details and timeline data in parallel
                        const [matchDetails, timelineData] = await Promise.all([
                            getMatchDetailsByMatchID(matchId, region, activeRegion),
                            getMatchTimelineByMatchID(matchId, region)
                        ]);
                        
                        if (!matchDetails) {
                            console.warn(`⚠️ No match details returned for match ${matchId}`);
                            return null;
                        }
                        
                        if (!timelineData || timelineData.length === 0) {
                            console.warn(`⚠️ No timeline data returned for match ${matchId}`);
                            return null;
                        }
                        
                        // Create complete Match object with integrated timeline data
                        const completeMatch: Match = {
                            ...matchDetails,
                            timelineData: timelineData
                        };
                        
                        return completeMatch;
                    } catch (error) {
                        console.warn(`❌ Failed to fetch match data for match ${matchId} (index ${index}):`, error);
                        return null;
                    }
                })
            ).then(results => results.filter((match): match is Match => match !== null));

            console.log(`✅ Successfully fetched ${newMatches.length} matches from API`);

            // Step 5: Save new matches to database
            if (newMatches.length > 0) {
                console.log(`💾 Saving ${newMatches.length} new matches to database`);
                try {
                    await saveMatchHistory(newMatches);
                    console.log(`✅ Successfully saved ${newMatches.length} matches to database`);
                } catch (saveError) {
                    console.error(`❌ Failed to save matches to database:`, saveError);
                    console.log(`📤 Returning API data despite save failure`);
                }
            }
        }

        // Step 6: Combine and sort all matches
        matches = [...existingMatches, ...newMatches];
        
        // Sort by game creation time (newest first) to maintain proper order
        matches.sort((a, b) => b.gameCreation - a.gameCreation);
        
        // Apply final pagination in case we got more than requested
        matches = matches.slice(0, count);

        console.log(`✅ Returning ${matches.length} matches for PUUID: ${puuid}`);
        return matches;

    } catch (error) {
        console.error(`❌ Error in getMatchHistory for PUUID ${puuid}:`, error);
        
        // If this was a forced call and it failed, try to return cached data as fallback
        if (force) {
            console.log(`🔄 Force call failed, attempting to retrieve cached data for PUUID: ${puuid}`);
            try {
                const fallbackMatches = await getPlayerMatches(puuid, startIndex + count, true);
                if (fallbackMatches && fallbackMatches.length > startIndex) {
                    const paginatedFallback = fallbackMatches.slice(startIndex, startIndex + count);
                    console.log(`💾 Returning ${paginatedFallback.length} cached matches as fallback`);
                    return await convertDatabaseMatchesToInterface(paginatedFallback);
                }
            } catch (fallbackError) {
                console.error(`❌ Fallback retrieval also failed for PUUID: ${puuid}:`, fallbackError);
            }
        }

        throw error;
    }
}

/**
 * Gets a single match by ID with intelligent caching.
 * 
 * @param matchId - The match ID to retrieve
 * @param region - Regional routing value (europe, americas, asia)  
 * @param activeRegion - Platform routing value (euw1, na1, etc.)
 * @param force - Whether to force API fetch regardless of DB status
 * @returns Promise resolving to Match object or null if not found
 */
export async function getSingleMatch(
    matchId: string,
    region: string,
    activeRegion: string,
    force: boolean = false
): Promise<Match | null> {
    if (!matchId || !region || !activeRegion) {
        throw new Error('Match ID, region, and activeRegion are required');
    }

    try {
        let match: Match | null = null;

        // Step 1: Try database first if not forcing
        if (!force) {
            console.log(`🔍 Checking database for match: ${matchId}`);
            
            const dbMatch = await getMultipleMatches([matchId], true);
            if (dbMatch && dbMatch.length > 0) {
                console.log(`✅ Found match ${matchId} in database`);
                const convertedMatches = await convertDatabaseMatchesToInterface(dbMatch);
                return convertedMatches[0] || null;
            }
        } else {
            console.log(`🔄 Force refresh enabled for match: ${matchId}`);
        }

        // Step 2: Fetch from API
        console.log(`🌐 Fetching match ${matchId} from API`);
        
        const [matchDetails, timelineData] = await Promise.all([
            getMatchDetailsByMatchID(matchId, region, activeRegion),
            getMatchTimelineByMatchID(matchId, region)
        ]);
        
        if (!matchDetails) {
            console.log(`🟡 Match ${matchId} not found in API`);
            return null;
        }
        
        if (!timelineData || timelineData.length === 0) {
            console.warn(`⚠️ No timeline data for match ${matchId}`);
        }
        
        // Create complete match object
        match = {
            ...matchDetails,
            timelineData: timelineData || []
        };

        // Step 3: Save to database
        console.log(`💾 Saving match ${matchId} to database`);
        try {
            await saveMatchHistory([match]);
            console.log(`✅ Successfully saved match ${matchId} to database`);
        } catch (saveError) {
            console.error(`❌ Failed to save match ${matchId} to database:`, saveError);
        }

        return match;

    } catch (error) {
        console.error(`❌ Error getting match ${matchId}:`, error);
        
        // Fallback to database if force call failed
        if (force) {
            try {
                const fallbackMatch = await getMultipleMatches([matchId], true);
                if (fallbackMatch && fallbackMatch.length > 0) {
                    console.log(`💾 Returning cached match ${matchId} as fallback`);
                    const convertedMatches = await convertDatabaseMatchesToInterface(fallbackMatch);
                    return convertedMatches[0] || null;
                }
            } catch (fallbackError) {
                console.error(`❌ Fallback failed for match ${matchId}:`, fallbackError);
            }
        }

        throw error;
    }
}

/**
 * Helper function to convert database match objects to the Match interface format.
 * This handles any necessary data transformations between database and interface formats.
 */
async function convertDatabaseMatchesToInterface(dbMatches: Array<Record<string, unknown>>): Promise<Match[]> {
    return dbMatches.map(dbMatch => {
        // Convert database format to Match interface
        // Handle bigint conversions and structure differences
        return {
            matchId: parseInt(dbMatch.matchId as string) || 0,
            gameDuration: dbMatch.gameDuration,
            gameCreation: Number(dbMatch.gameCreation),
            gameEndTimestamp: Number(dbMatch.gameEndTimestamp),
            gameMode: dbMatch.gameMode,
            gameType: dbMatch.gameType,
            queueId: dbMatch.queueId,
            participants: dbMatch.participants || [],
            // Include timeline data if available
            timelineData: (dbMatch.timeline && typeof dbMatch.timeline === 'object' && dbMatch.timeline !== null)
                ? JSON.parse((dbMatch.timeline as { timelineData: string }).timelineData)
                : []
        } as Match;
    });
}

/**
 * Batch operation to check which matches exist in database.
 * Useful for optimizing API calls when you have multiple match IDs.
 * 
 * @param matchIds - Array of match IDs to check
 * @returns Promise resolving to object with existing and missing match IDs
 */
export async function batchCheckMatchExistence(matchIds: string[]) {
    if (!matchIds || matchIds.length === 0) {
        return { existing: [], missing: [] };
    }

    try {
        const existenceChecks = await Promise.all(
            matchIds.map(async (matchId) => ({
                matchId,
                exists: await matchExists(matchId)
            }))
        );

        const existing = existenceChecks
            .filter(check => check.exists)
            .map(check => check.matchId);
            
        const missing = existenceChecks
            .filter(check => !check.exists)
            .map(check => check.matchId);

        console.log(`📊 Batch check complete: ${existing.length} existing, ${missing.length} missing`);
        
        return { existing, missing };
    } catch (error) {
        console.error(`❌ Error in batch check:`, error);
        throw error;
    }
}
