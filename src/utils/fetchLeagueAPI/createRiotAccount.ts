import { LeagueAccount, RiotAccount, RiotAccountDetails } from "@/interfaces/productionTypes";
import { createLeagueAccount } from "./createLeagueAccount";
import getAccountByRiotID from "./riotEndPoints/getAccountByRiotID";
import getActiveRegionByPuuid from "./riotEndPoints/getActiveRegionByPuuid";
import { saveRiotAccountDetails } from "@/utils/database/saveRiotAccountDetails";

/**
 * Creates a complete RiotAccount object for a given Riot ID.
 * 
 * This function fetches the Riot account details using the provided Riot ID,
 * determines the active region for League of Legends, and creates a complete
 * account object with both Riot account details and League-specific information.
 * The Riot account details are also saved to the database.
 * 
 * @param tagLine - The tag line part of the Riot ID (e.g., "1234" from "PlayerName#1234")
 * @param gameName - The game name part of the Riot ID (e.g., "PlayerName" from "PlayerName#1234")
 * @param region - The region to search in (e.g., "europe", "asia", "americas")
 * @returns Promise that resolves to a RiotAccount object containing both riot account details and league account information
 * @throws {Error} When any of the required parameters are missing, empty, or invalid
 * @throws {Error} When no account is found with the provided Riot ID in the specified region
 * @throws {Error} When there's an issue with API calls or account creation
 * 
 * @example
 * ```typescript
 * try {
 *   const riotAccount = await createRiotAccount("1234", "PlayerName", "europe");
 *   console.log(`Created account for ${riotAccount.riotAccountDetails.gameName}#${riotAccount.riotAccountDetails.tagLine}`);
 * } catch (error) {
 *   console.error("Failed to create riot account:", error.message);
 * }
 * ```
 */
export async function createRiotAccount(tagLine: string, gameName: string, region: string): Promise<RiotAccount> {
    // Input validation
    if (!tagLine || typeof tagLine !== 'string' || tagLine.trim().length === 0) {
        throw new Error('Tag line is required and must be a non-empty string');
    }
    if (!gameName || typeof gameName !== 'string' || gameName.trim().length === 0) {
        throw new Error('Game name is required and must be a non-empty string');
    }
    if (!region || typeof region !== 'string' || region.trim().length === 0) {
        throw new Error('Region is required and must be a non-empty string');
    }

    try {
        // Fetch Riot account details from API
        const riotAccountDetails: RiotAccountDetails = await getAccountByRiotID(tagLine, gameName, region);

        if (!riotAccountDetails) {
            throw new Error(`Riot account not found for ${gameName}#${tagLine} in region ${region}`);
        }
        if (!riotAccountDetails.puuid || typeof riotAccountDetails.puuid !== 'string') {
            throw new Error('Invalid PUUID received from Riot account details');
        }

        // Save Riot account details to database
        const dbAccount = await saveRiotAccountDetails(riotAccountDetails);
        console.log(`Riot account details saved to database for PUUID: ${dbAccount.puuid}`);

        // Get the active region for the account
        const activeRegion: string = await getActiveRegionByPuuid(riotAccountDetails.puuid, region);

        if (!activeRegion || typeof activeRegion !== 'string') {
            throw new Error(`Failed to determine active region for PUUID: ${riotAccountDetails.puuid}`);
        }

        // Create League account information
        const leagueAccount: LeagueAccount = await createLeagueAccount(riotAccountDetails.puuid, region, activeRegion);

        if (!leagueAccount) {
            throw new Error('Failed to create League account details');
        }

        // Log successful account creation
        console.log(`Successfully created RiotAccount for ${gameName}#${tagLine} in ${activeRegion}`);

        return {
            riotAccountDetails,
            leagueAccount
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create Riot account for ${gameName}#${tagLine}: ${error.message}`);
        }
        throw new Error(`Unexpected error while creating Riot account: ${String(error)}`);
    }
}