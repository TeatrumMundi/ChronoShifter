import { LeagueRank } from "@/interfaces/productionTypes";
import { fetchFromRiotAPI } from "./fetchFromRiotAPI";

/**
 * Fetches ranked league entries for a given PUUID from League of Legends API.
 * 
 * @param puuid - Player Universally Unique Identifier
 * @param activeRegion - The platform routing value (e.g., "eun1", "euw1", "na1")
 * @returns Promise that resolves to an array of LeagueRank objects
 * @throws {Error} When the API request fails or returns invalid data
 * @throws {Error} When PUUID is not found (404)
 * @throws {Error} When rate limit is exceeded (429)
 * @throws {Error} When API key is invalid or insufficient permissions (403)
 * 
 * @example
 * ```typescript
 * try {
 *   const rankedEntries = await getRankedLeagueEntries("puuid123", "euw1");
 *   const soloRank = rankedEntries.find(entry => entry.queueType === "RANKED_SOLO_5x5");
 *   console.log(`Solo rank: ${soloRank?.tier} ${soloRank?.rank}`);
 * } catch (error) {
 *   console.error("Failed to get ranked entries:", error.message);
 * }
 * ```
 */
export default async function getRankedLeagueEntries(puuid: string, activeRegion: string): Promise<LeagueRank[]> {
    // Input validation
    if (!puuid || typeof puuid !== 'string' || puuid.trim().length === 0) {
        throw new Error('PUUID is required and must be a non-empty string');
    }
    
    if (!activeRegion || typeof activeRegion !== 'string' || activeRegion.trim().length === 0) {
        throw new Error('Active region is required and must be a non-empty string');
    }

    try {
        const response: Response = await fetchFromRiotAPI(
            `https://${activeRegion}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`
        );

        if (!response.ok) {
            switch (response.status) {
                case 404:
                    // 404 for ranked entries might mean no ranked games played - return empty array
                    return [];
                case 429:
                    throw new Error('Rate limit exceeded. Please try again later.');
                case 403:
                    throw new Error('Forbidden: Invalid API key or insufficient permissions.');
                case 400:
                    throw new Error('Bad request: Invalid PUUID or region parameter.');
                case 500:
                    throw new Error('Riot API server error. Please try again later.');
                default:
                    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }
        }

        const apiEntries = await response.json();

        // Validate response is an array
        if (!Array.isArray(apiEntries)) {
            throw new Error('Invalid response data: expected array of ranked entries');
        }

        // Map and validate each entry
        return apiEntries.map((entry: LeagueRank, index: number) => {
            // Validate required fields
            if (!entry || typeof entry !== 'object') {
                throw new Error(`Invalid entry data at index ${index}: expected object`);
            }

            if (!entry.queueType || typeof entry.queueType !== 'string') {
                throw new Error(`Invalid queueType at index ${index}: expected non-empty string`);
            }

            if (typeof entry.wins !== 'number' || typeof entry.losses !== 'number') {
                throw new Error(`Invalid wins/losses data at index ${index}: expected numbers`);
            }

            if (typeof entry.leaguePoints !== 'number') {
                throw new Error(`Invalid leaguePoints at index ${index}: expected number`);
            }

            const totalGames = entry.wins + entry.losses;
            const winRate = totalGames > 0 ? Math.round((entry.wins / totalGames) * 100) : 0;

            return {
                queueType: entry.queueType,
                tier: entry.tier || 'UNRANKED',
                rank: entry.rank || '',
                leaguePoints: entry.leaguePoints,
                wins: entry.wins,
                losses: entry.losses,
                winRate,
                hotStreak: Boolean(entry.hotStreak)
            } as LeagueRank;
        });
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Unexpected error while fetching ranked entries: ${String(error)}`);
    }
}
