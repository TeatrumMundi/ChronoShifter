import { RiotAccountDetails } from "@/interfaces/productionTypes";
import { getRiotAccountDetailsByNameAndTag, saveRiotAccountDetails } from "../database/RiotAccountDetails_DB";
import getAccountByRiotIDFromAPI from "../fetchLeagueAPI/RiotAccountDetails_API";

/**
 * Service layer for managing Riot Account data with database caching.
 * Handles the logic of when to use cache vs API calls.
 * 
 * @param tagLine - The tag line part of the Riot ID (e.g., "EUW" from "Player#EUW")
 * @param gameName - The game name part of the Riot ID (e.g., "Player" from "Player#EUW") 
 * @param region - The regional routing value (e.g., "europe", "americas", "asia")
 * @param forceUpdate - If true, forces API call; if false, tries database first, then API if not found
 * @returns Promise that resolves to RiotAccountDetails object
 * @throws {Error} When the API request fails or returns invalid data
 * @throws {Error} When account is not found (404)
 * @throws {Error} When rate limit is exceeded (429)
 * 
 * @example
 * ```typescript
 * // Try database first, fallback to API
 * const account = await getRiotAccountDetails("EUW", "PlayerName", "europe", false);
 * 
 * // Force API call and save to database
 * const freshAccount = await getRiotAccountDetails("EUW", "PlayerName", "europe", true);
 * ```
 */
export async function getRiotAccountDetails(
    tagLine: string,
    gameName: string, 
    region: string,
    forceUpdate: boolean = false
): Promise<RiotAccountDetails> {
    try {
        // If not forcing update, try to get from database first
        if (!forceUpdate) {
            try {
                const cachedAccount = await getRiotAccountDetailsByNameAndTag(gameName, tagLine, region);
                if (cachedAccount) {
                    return cachedAccount;
                }
            } catch (dbError) {
                console.warn('❌ Database lookup failed, proceeding with API call:', dbError);
            }
        }

        // Fetch from API (either forced or not found in database)
        console.log(`📡 Fetching account data from API for ${gameName}#${tagLine}`);
        const accountDetails = await getAccountByRiotIDFromAPI(tagLine, gameName, region);


        try {
            await saveRiotAccountDetails(accountDetails);
            console.log(`💾 Saved account data to database for ${gameName}#${tagLine}`);
        } catch (saveError) { console.warn('❌ Failed to save account data to database:', saveError);}
        
        return accountDetails;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Unexpected error while fetching account data: ${String(error)}`);
    }
}
