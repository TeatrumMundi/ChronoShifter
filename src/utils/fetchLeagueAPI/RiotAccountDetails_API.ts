import { RiotAccountDetails } from "@/interfaces/productionTypes";
import { fetchFromRiotAPI } from "./fetchFromRiotAPI";

/**
 * Fetches Riot account details by Riot ID (gameName#tagLine) from the Riot API.
 * This is a pure API function with no database operations.
 * 
 * @param tagLine - The tag line part of the Riot ID (e.g., "EUW" from "Player#EUW")
 * @param gameName - The game name part of the Riot ID (e.g., "Player" from "Player#EUW")
 * @param region - The regional routing value (e.g., "europe", "americas", "asia")
 * @returns Promise that resolves to RiotAccountDetails object
 * @throws {Error} When the API request fails or returns invalid data
 * @throws {Error} When account is not found (404)
 * @throws {Error} When rate limit is exceeded (429)
 * 
 * @example
 * ```typescript
 * const account = await getAccountByRiotID("EUW", "PlayerName", "europe");
 * console.log(account.puuid);
 * ```
 */
export default async function getAccountByRiotID(
    tagLine: string, 
    gameName: string, 
    region: string
): Promise<RiotAccountDetails> {
    try {
        console.log(`📡 Fetching account data from API for ${gameName}#${tagLine}`);
        const response: Response = await fetchFromRiotAPI(
            `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`
        );

        if (!response.ok) {
            switch (response.status) {
                case 404:
                    throw new Error(`Account not found: ${gameName}#${tagLine}`);
                case 429:
                    throw new Error('Rate limit exceeded. Please try again later.');
                case 403:
                    throw new Error('Forbidden: Invalid API key or insufficient permissions.');
                case 500:
                    throw new Error('Riot API server error. Please try again later.');
                default:
                    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();
        
        // Validate that we received the expected data structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response data received from Riot API');
        }

        return data as RiotAccountDetails;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Unexpected error while fetching account data: ${String(error)}`);
    }
}