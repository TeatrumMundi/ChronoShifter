import { fetchFromRiotAPI } from "./fetchFromRiotAPI";

/**
 * Fetches recent match IDs for a given PUUID from League of Legends API.
 * 
 * @param puuid - Player Universally Unique Identifier
 * @param region - The regional routing value (e.g., "europe", "americas", "asia")
 * @param start - The starting index for match history (default: 0)
 * @param count - The number of match IDs to retrieve (default: 20, max: 100)
 * @returns Promise that resolves to an array of match ID strings
 * @throws {Error} When the API request fails or returns invalid data
 * @throws {Error} When PUUID is not found (404)
 * @throws {Error} When rate limit is exceeded (429)
 * @throws {Error} When API key is invalid or insufficient permissions (403)
 * 
 * @example
 * ```typescript
 * try {
 *   const matchIds = await getRecentMatchesIDsByPuuid("puuid123", "europe", 0, 10);
 *   console.log(`Found ${matchIds.length} recent matches`);
 * } catch (error) {
 *   console.error("Failed to get match IDs:", error.message);
 * }
 * ```
 */
export default async function getRecentMatchesIDsByPuuid(
    puuid: string, 
    region: string, 
    start: number = 0, 
    count: number = 20
): Promise<string[]> {
    // Input validation
    if (!puuid || typeof puuid !== 'string' || puuid.trim().length === 0) {
        throw new Error('PUUID is required and must be a non-empty string');
    }
    
    if (!region || typeof region !== 'string' || region.trim().length === 0) {
        throw new Error('Region is required and must be a non-empty string');
    }
    
    if (typeof start !== 'number' || start < 0) {
        throw new Error('Start index must be a non-negative number');
    }
    
    if (typeof count !== 'number' || count < 1 || count > 100) {
        throw new Error('Count must be a number between 1 and 100');
    }

    try {
        const response: Response = await fetchFromRiotAPI(
            `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`
        );

        if (!response.ok) {
            switch (response.status) {
                case 404:
                    throw new Error(`PUUID not found or no matches available: ${puuid}`);
                case 429:
                    throw new Error('Rate limit exceeded. Please try again later.');
                case 403:
                    throw new Error('Forbidden: Invalid API key or insufficient permissions.');
                case 400:
                    throw new Error('Bad request: Invalid PUUID, region, or query parameters.');
                case 500:
                    throw new Error('Riot API server error. Please try again later.');
                default:
                    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }
        }

        const matchIds = await response.json();
        
        // Validate response is an array
        if (!Array.isArray(matchIds)) {
            throw new Error('Invalid response data: expected array of match IDs');
        }
        
        // Validate each match ID is a string
        matchIds.forEach((matchId, index) => {
            if (typeof matchId !== 'string' || matchId.trim().length === 0) {
                throw new Error(`Invalid match ID at index ${index}: expected non-empty string`);
            }
        });

        return matchIds;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Unexpected error while fetching match IDs: ${String(error)}`);
    }
}