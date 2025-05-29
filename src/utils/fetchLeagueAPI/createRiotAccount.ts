import { LeagueAccount, RiotAccount, RiotAccountDetails } from "@/interfaces/productionTypes";
import { createLeagueAccount, getAccountByRiotID, getActiveRegionByPuuid } from "./createLeagueAccount";

/**
 * Error thrown when invalid parameters are provided to createRiotAccount function.
 */
export class InvalidParametersError extends Error {
    constructor(message: string = "Invalid parameters provided") {
        super(message);
        this.name = "InvalidParametersError";
    }
}

/**
 * Error thrown when a Riot account is not found.
 */
export class RiotAccountNotFoundError extends Error {
    constructor(tagLine: string, gameName: string) {
        super(`Riot account not found for ${gameName}#${tagLine}`);
        this.name = "RiotAccountNotFoundError";
    }
}

/**
 * Creates a complete RiotAccount object for a given Riot ID.
 * 
 * This function fetches the Riot account details using the provided Riot ID,
 * determines the active region for League of Legends, and creates a complete
 * account object with both Riot account details and League-specific information.
 * 
 * @param tagLine - The tag line part of the Riot ID (e.g., "1234" from "PlayerName#1234")
 * @param gameName - The game name part of the Riot ID (e.g., "PlayerName" from "PlayerName#1234")
 * @param region - The region to search in (e.g., "europe", "asia", "americas")
 * 
 * @returns A Promise that resolves to a RiotAccount object containing both riot account details and league account information
 * 
 * @throws {InvalidParametersError} When any of the required parameters are missing, empty, or invalid
 * @throws {RiotAccountNotFoundError} When no account is found with the provided Riot ID in the specified region
 * @throws {Error} When there's an issue with API calls or account creation
 */
export async function createRiotAccount(tagLine: string, gameName: string, region: string): Promise<RiotAccount> {
    // Input validation
    if (!tagLine?.trim() || !gameName?.trim() || !region?.trim()) {
        throw new InvalidParametersError("All parameters (tagLine, gameName, region) must be non-empty strings");
    }

    try {
        // Fetch Riot account details
        const riotAccountDetails: RiotAccountDetails = await getAccountByRiotID(tagLine, gameName, region);
        
        if (!riotAccountDetails) {
            throw new RiotAccountNotFoundError(tagLine, gameName);
        }

        // Get the active region for the account
        const activeRegion: string = await getActiveRegionByPuuid(riotAccountDetails.puuid, region);

        // Create League account information
        const leagueAccount: LeagueAccount = await createLeagueAccount(riotAccountDetails.puuid, region, activeRegion);

        return { 
            riotAccountDetails, 
            leagueAccount 
        };
    } catch (error) {
        // Re-throw known errors
        if (error instanceof InvalidParametersError || error instanceof RiotAccountNotFoundError) {
            throw error;
        }
        
        // Wrap unknown errors
        throw new Error(`Failed to create Riot account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}