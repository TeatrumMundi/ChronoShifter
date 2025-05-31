import { LeagueAccountDetails } from "@/interfaces/productionTypes";
import { fetchFromRiotAPI } from "./fetchFromRiotAPI";

/**
 * Fetches League of Legends summoner account details by PUUID.
 * 
 * @param puuid - Player Universally Unique Identifier
 * @param region - The regional routing value (e.g., "europe", "americas", "asia")
 * @param activeRegion - The platform routing value (e.g., "eun1", "euw1", "na1")
 * @returns Promise that resolves to LeagueAccountDetails object
 * @throws {Error} When the API request fails or returns invalid data
 * @throws {Error} When PUUID is not found (404)
 * @throws {Error} When rate limit is exceeded (429)
 * @throws {Error} When API key is invalid or insufficient permissions (403)
 * 
 * @example
 * ```typescript
 * try {
 *   const summoner = await getSummonerByPuuid("puuid123", "europe", "euw1");
 *   console.log(`Summoner level: ${summoner.summonerLevel}`);
 * } catch (error) {
 *   console.error("Failed to get summoner:", error.message);
 * }
 * ```
 */
export default async function getSummonerByPuuid(puuid: string, region: string, activeRegion: string): Promise<LeagueAccountDetails> {
    // Input validation
    if (!puuid || typeof puuid !== 'string' || puuid.trim().length === 0) {
        throw new Error('PUUID is required and must be a non-empty string');
    }
    
    if (!region || typeof region !== 'string' || region.trim().length === 0) {
        throw new Error('Region is required and must be a non-empty string');
    }
    
    if (!activeRegion || typeof activeRegion !== 'string' || activeRegion.trim().length === 0) {
        throw new Error('Active region is required and must be a non-empty string');
    }

    try {
        const response: Response = await fetchFromRiotAPI(
            `https://${activeRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`
        );

        if (!response.ok) {
            switch (response.status) {
                case 404:
                    throw new Error(`Summoner not found for PUUID: ${puuid}`);
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

        const data = await response.json();
        
        // Validate response structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response data received from Riot API');
        }
        
        // Validate essential summoner data
        if (!data.id || !data.puuid || typeof data.summonerLevel !== 'number') {
            throw new Error('Invalid summoner data structure received from API');
        }

        return {
            ...data,
            region,
            activeRegion
        } as LeagueAccountDetails;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Unexpected error while fetching summoner data: ${String(error)}`);
    }
}