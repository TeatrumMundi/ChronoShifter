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
        console.log(`� Match History Request: ${count} matches (start: ${startIndex}) for ${puuid.slice(0, 8)}... [${force ? 'FORCE' : 'CACHE'}]`);
        
        let matches: Match[] = [];

        // Step 1: Try to get from database if not forcing API call
        if (!force) {
            const dbMatches = await getPlayerMatches(puuid, startIndex + count, false);
            
            if (dbMatches && dbMatches.length > startIndex) {
                const paginatedMatches = dbMatches.slice(startIndex, startIndex + count);
                
                if (paginatedMatches.length === count) {
                    console.log(`✅ Serving ${paginatedMatches.length} matches from cache`);
                    return paginatedMatches;
                } else {
                    console.log(`🟡 Cache incomplete (${paginatedMatches.length}/${count}), fetching from API`);
                }
            }
        }

        // Step 2: Fetch from API if not found in database or if forced
        const matchIds = await getRecentMatchesIDsByPuuid(puuid, region, startIndex, count);
        
        if (!matchIds || matchIds.length === 0) {
            console.log(`🟡 No recent matches found`);
            return [];
        }

        // Step 3: Check which matches already exist in database (unless forcing)
        let matchesToFetch = matchIds;
        let existingMatches: Match[] = [];

        if (!force) {
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

            if (existingMatchIds.length > 0) {
                existingMatches = await getMultipleMatches(existingMatchIds, true);
                console.log(`� ${existingMatchIds.length} matches from cache, ${matchesToFetch.length} from API`);
            }
        } else {
            console.log(`🔄 Force refresh: fetching all ${matchIds.length} matches from API`);
        }

        // Step 4: Fetch missing matches from API
        let newMatches: Match[] = [];
        if (matchesToFetch.length > 0) {
            newMatches = await Promise.all(
                matchesToFetch.map(async (matchId) => {
                    try {
                        // Fetch match details and timeline data in parallel
                        const [matchDetails, timelineData] = await Promise.all([
                            getMatchDetailsByMatchID(matchId, region, activeRegion),
                            getMatchTimelineByMatchID(matchId, region)
                        ]);
                        
                        if (!matchDetails) {
                            return null;
                        }
                        
                        // Create complete Match object with integrated timeline data
                        return {
                            ...matchDetails,
                            timelineData: timelineData || []
                        };
                    } catch {
                        return null;
                    }
                })
            ).then(results => results.filter((match): match is Match => match !== null));

            // Step 5: Save new matches to database
            if (newMatches.length > 0) {
                try {
                    await saveMatchHistory(newMatches);
                } catch (saveError) {
                    console.error(`❌ Failed to save matches:`, saveError);
                }
            }
        }

        // Step 6: Combine and sort all matches
        matches = [...existingMatches, ...newMatches];
        matches.sort((a, b) => b.gameCreation - a.gameCreation);
        matches = matches.slice(0, count);

        console.log(`✅ Retrieved ${matches.length} matches (${existingMatches.length} cached + ${newMatches.length} new)`);
        return matches;

    } catch (error) {
        console.error(`❌ Match history error:`, error);
        
        // If this was a forced call and it failed, try to return cached data as fallback
        if (force) {
            try {
                const fallbackMatches = await getPlayerMatches(puuid, startIndex + count, true);
                if (fallbackMatches && fallbackMatches.length > startIndex) {
                    const paginatedFallback = fallbackMatches.slice(startIndex, startIndex + count);
                    console.log(`💾 Fallback: ${paginatedFallback.length} cached matches`);
                    return paginatedFallback;
                }
            } catch {
                // Fallback failed, will throw original error
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
        console.log(`🎯 Single match request: ${matchId} [${force ? 'FORCE' : 'CACHE'}]`);
        
        // Step 1: Try database first if not forcing
        if (!force) {
            const dbMatch = await getMultipleMatches([matchId], true);
            if (dbMatch && dbMatch.length > 0) {
                console.log(`✅ Serving match from cache`);
                return dbMatch[0] || null;
            }
        }

        // Step 2: Fetch from API
        const [matchDetails, timelineData] = await Promise.all([
            getMatchDetailsByMatchID(matchId, region, activeRegion),
            getMatchTimelineByMatchID(matchId, region)
        ]);
        
        if (!matchDetails) {
            console.log(`🟡 Match not found`);
            return null;
        }
        
        // Create complete match object
        const match = {
            ...matchDetails,
            timelineData: timelineData || []
        };

        // Step 3: Save to database
        try {
            await saveMatchHistory([match]);
        } catch (saveError) {
            console.error(`❌ Save failed:`, saveError);
        }

        return match;

    } catch (error) {
        console.error(`❌ Single match error:`, error);
        
        // Fallback to database if force call failed
        if (force) {
            try {
                const fallbackMatch = await getMultipleMatches([matchId], true);
                if (fallbackMatch && fallbackMatch.length > 0) {
                    console.log(`💾 Fallback: cached match`);
                    return fallbackMatch[0] || null;
                }
            } catch {
                // Fallback failed, will throw original error
            }
        }

        throw error;
    }
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
        
        return { existing, missing };
    } catch (error) {
        console.error(`❌ Batch check error:`, error);
        throw error;
    }
}
