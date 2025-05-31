import { LeagueAccount, LeagueAccountDetails, LeagueRank, MatchDetails } from '@/interfaces/productionTypes';
import getSummonerByPuuid from './riotEndPoints/getSummonerByPuuid';
import getRankedLeagueEntries from './riotEndPoints/getRankedLeagueEntries';
import getRecentMatchesIDsByPuuid from './riotEndPoints/getRecentMatchesIDsByPuuid';
import getMatchDetailsByMatchID from './riotEndPoints/getMatchDetailsByMatchID';

/**
 * Creates a complete LeagueAccount object with summoner details, ranked information, and recent matches.
 * 
 * @param puuid - Player Universally Unique Identifier
 * @param region - The regional routing value (e.g., "europe", "americas", "asia")
 * @param activeRegion - The platform routing value (e.g., "eun1", "euw1", "na1")
 * @returns Promise that resolves to a complete LeagueAccount object
 * @throws {Error} When PUUID is invalid or account not found
 * @throws {Error} When required data cannot be fetched from Riot API
 * 
 * @example
 * ```typescript
 * try {
 *   const account = await createLeagueAccount("puuid123", "europe", "euw1");
 *   console.log(`${account.leagueAccountsDetails.name} - ${account.leagueSoloRank.tier}`);
 * } catch (error) {
 *   console.error("Failed to create league account:", error.message);
 * }
 * ```
 */
export async function createLeagueAccount(puuid: string, region: string, activeRegion: string): Promise<LeagueAccount> {
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
        // Get the League account details (required)
        const leagueAccountsDetails: LeagueAccountDetails = await getSummonerByPuuid(puuid, region, activeRegion);
        
        if (!leagueAccountsDetails) {
            throw new Error(`League account details not found for PUUID: ${puuid}`);
        }

        // Get ranked league entries (optional but important)
        let leagueRanks: LeagueRank[] = [];
        try {
            leagueRanks = await getRankedLeagueEntries(puuid, activeRegion);
        } catch (error) {
            console.warn(`Failed to fetch ranked entries for PUUID ${puuid}:`, error);
            leagueRanks = [];
        }

        // Extract or create default solo queue rank
        const leagueSoloRank: LeagueRank = leagueRanks.find(r => r.queueType === "RANKED_SOLO_5x5") ?? {
            queueType: "RANKED_SOLO_5x5",
            tier: "UNRANKED",
            rank: "",
            leaguePoints: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            hotStreak: false
        };

        // Extract or create default flex queue rank
        const leagueFlexRank: LeagueRank = leagueRanks.find(r => r.queueType === "RANKED_FLEX_SR") ?? {
            queueType: "RANKED_FLEX_SR",
            tier: "UNRANKED",
            rank: "",
            leaguePoints: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            hotStreak: false
        };

        // Get recent match IDs (optional)
        let recentMatchesIDs: string[] = [];
        try {
            recentMatchesIDs = await getRecentMatchesIDsByPuuid(puuid, region, 0, 10);
        } catch (error) {
            console.warn(`Failed to fetch recent matches IDs for PUUID ${puuid}:`, error);
            recentMatchesIDs = [];
        }

        // Fetch match details for each recent match ID (optional)
        const recentMatchesRaw = await Promise.all(
            recentMatchesIDs.map(async (matchId, index) => {
                try {
                    const matchDetails = await getMatchDetailsByMatchID(matchId, region, activeRegion);
                    
                    if (!matchDetails) {
                        console.warn(`No match details returned for match ${matchId}`);
                        return null;
                    }
                    
                    return { matchId, matchDetails };
                } catch (error) {
                    console.warn(`Failed to fetch match details for match ${matchId} (index ${index}):`, error);
                    return null;
                }
            })
        );

        // Filter out any null values from the recent matches
        const recentMatches = recentMatchesRaw.filter((m): m is { matchId: string; matchDetails: MatchDetails } => m !== null);

        // Log summary for debugging
        console.log(`Successfully created LeagueAccount for ${leagueAccountsDetails.accountId || 'Unknown'}: ${recentMatches.length}/${recentMatchesIDs.length} matches loaded`);

        return { 
            leagueAccountsDetails, 
            leagueSoloRank, 
            leagueFlexRank, 
            recentMatches 
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create league account for PUUID ${puuid}: ${error.message}`);
        }
        throw new Error(`Unexpected error while creating league account: ${String(error)}`);
    }
}