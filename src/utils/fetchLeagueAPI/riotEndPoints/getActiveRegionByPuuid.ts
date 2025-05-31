import { fetchFromRiotAPI } from "./fetchFromRiotAPI";

/**
 * Fetches the active region for a given PUUID from Riot Games API.
 * 
 * @param puuid - Player Universally Unique Identifier
 * @param region - The regional routing value (e.g., "europe", "americas", "asia")
 * @param game - The game identifier (default: "lol" for League of Legends)
 * @returns Promise that resolves to the active region string (e.g., "eun1", "euw1", "na1")
 * @throws {Error} When the API request fails or returns invalid data
 * @throws {Error} When PUUID is not found (404)
 * @throws {Error} When rate limit is exceeded (429)
 * @throws {Error} When API key is invalid or insufficient permissions (403)
 * 
 * @example
 * ```typescript
 * try {
 *   const activeRegion = await getActiveRegionByPuuid("puuid123", "europe", "lol");
 *   console.log(`Active region: ${activeRegion}`);
 * } catch (error) {
 *   console.error("Failed to get active region:", error.message);
 * }
 * ```
 */
export default async function getActiveRegionByPuuid(puuid: string, region: string, game: string = "lol"): Promise<string> {
    // Input validation
    if (!puuid || typeof puuid !== 'string' || puuid.trim().length === 0) {
        throw new Error('PUUID is required and must be a non-empty string');
    }
    
    if (!region || typeof region !== 'string' || region.trim().length === 0) {
        throw new Error('Region is required and must be a non-empty string');
    }
    
    if (!game || typeof game !== 'string' || game.trim().length === 0) {
        throw new Error('Game is required and must be a non-empty string');
    }

    try {
        const response: Response = await fetchFromRiotAPI(
            `https://${region}.api.riotgames.com/riot/account/v1/region/by-game/${game}/by-puuid/${puuid}`
        );

        if (!response.ok) {
            switch (response.status) {
                case 404:
                    throw new Error(`PUUID not found or no active region for game "${game}": ${puuid}`);
                case 429:
                    throw new Error('Rate limit exceeded. Please try again later.');
                case 403:
                    throw new Error('Forbidden: Invalid API key or insufficient permissions.');
                case 400:
                    throw new Error('Bad request: Invalid PUUID, region, or game parameter.');
                case 500:
                    throw new Error('Riot API server error. Please try again later.');
                default:
                    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();
        
        // Validate response structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response data received from Riot API');
        }
        
        if (!data.region || typeof data.region !== 'string') {
            throw new Error('Invalid or missing region in API response');
        }

        return data.region;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Unexpected error while fetching active region: ${String(error)}`);
    }
}