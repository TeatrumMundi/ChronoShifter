import { Match, Participant } from "@/interfaces/productionTypes";
import { fetchFromRiotAPI } from "./fetchFromRiotAPI";
import { RawMatchData, RawParticipant } from "@/interfaces/rawTypes";
import { calculatePerformanceScore, extractArenaStats, extractItems, fetchParticipantRunes, getKDA, getMinionsPerMinute } from "@/utils/helpers";
import { getChampionById, getStatPerkById, getSummonerSpellByID } from "@/utils/getLeagueAssets/getLOLObject";

/**
 * Fetches detailed match information by match ID from League of Legends API.
 * 
 * @param matchID - The match ID to fetch details for
 * @param region - The regional routing value (e.g., "europe", "americas", "asia")
 * @param activeRegion - The platform routing value (e.g., "eun1", "euw1", "na1")
 * @returns Promise that resolves to MatchDetails object
 * @throws {Error} When the API request fails or returns invalid data
 * @throws {Error} When match ID is not found (404)
 * @throws {Error} When rate limit is exceeded (429)
 * @throws {Error} When API key is invalid or insufficient permissions (403)
 * 
 * @example
 * ```typescript
 * try {
 *   const matchDetails = await getMatchDetailsByMatchID("EUW1_1234567890", "europe", "euw1");
 *   console.log(`Match duration: ${matchDetails.gameDuration}s`);
 * } catch (error) {
 *   console.error("Failed to get match details:", error.message);
 * }
 * ```
 */
export default async function getMatchDetailsByMatchID(matchID: string, region: string, activeRegion: string): Promise<Match> {
    // Input validation
    if (!matchID || typeof matchID !== 'string' || matchID.trim().length === 0) {
        throw new Error('Match ID is required and must be a non-empty string');
    }
    
    if (!region || typeof region !== 'string' || region.trim().length === 0) {
        throw new Error('Region is required and must be a non-empty string');
    }
    
    if (!activeRegion || typeof activeRegion !== 'string' || activeRegion.trim().length === 0) {
        throw new Error('Active region is required and must be a non-empty string');
    }

    try {
        const response: Response = await fetchFromRiotAPI(
            `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}`
        );

        if (!response.ok) {
            switch (response.status) {
                case 404:
                    throw new Error(`Match not found: ${matchID}`);
                case 429:
                    throw new Error('Rate limit exceeded. Please try again later.');
                case 403:
                    throw new Error('Forbidden: Invalid API key or insufficient permissions.');
                case 400:
                    throw new Error('Bad request: Invalid match ID or region parameter.');
                case 500:
                    throw new Error('Riot API server error. Please try again later.');
                default:
                    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }
        }

        const data: RawMatchData = await response.json();

        // Validate response structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response data received from Riot API');
        }

        if (!data.info || typeof data.info !== 'object') {
            throw new Error('Invalid match info structure in API response');
        }

        if (!Array.isArray(data.info.participants)) {
            throw new Error('Invalid participants data in API response');
        }

        if (data.info.participants.length === 0) {
            throw new Error('No participants found in match data');
        }

        // Validate essential match fields
        if (typeof data.info.gameDuration !== 'number') {
            throw new Error('Invalid game duration in match data');
        }

        const matchDetails: Match = {
            matchId: data.info.gameId,
            gameDuration: data.info.gameDuration,
            gameCreation: data.info.gameCreation,
            gameEndTimestamp: data.info.gameEndTimestamp,
            gameMode: data.info.gameMode,
            gameType: data.info.gameType,
            queueId: data.info.queueId,
            participants: await Promise.all(
                data.info.participants.map(async (participantData: RawParticipant, index: number): Promise<Participant> => {
                    // Validate participant data
                    if (!participantData || typeof participantData !== 'object') {
                        throw new Error(`Invalid participant data at index ${index}`);
                    }

                    if (!participantData.puuid || typeof participantData.puuid !== 'string') {
                        throw new Error(`Invalid PUUID for participant at index ${index}`);
                    }

                    if (typeof participantData.kills !== 'number' ||
                        typeof participantData.deaths !== 'number' ||
                        typeof participantData.assists !== 'number') {
                        throw new Error(`Invalid KDA data for participant at index ${index}`);
                    }

                    try {
                        return {
                            puuid: participantData.puuid,
                            participantId: participantData.participantId,
                            riotIdGameName: participantData.riotIdGameName || '',
                            riotIdTagline: participantData.riotIdTagline || '',
                            summonerName: participantData.summonerName || '',
                            region: region,
                            activeRegion: activeRegion,
                            champLevel: participantData.champLevel || 1,
                            teamId: participantData.teamId,
                            teamPosition: participantData.teamPosition || '',

                            // Stats
                            kills: participantData.kills,
                            deaths: participantData.deaths,
                            assists: participantData.assists,
                            kda: getKDA(participantData.kills, participantData.deaths, participantData.assists),

                            // Minions Info
                            totalMinionsKilled: participantData.totalMinionsKilled || 0,
                            neutralMinionsKilled: participantData.neutralMinionsKilled || 0,
                            allMinionsKilled: (participantData.totalMinionsKilled || 0) + (participantData.neutralMinionsKilled || 0),
                            minionsPerMinute: getMinionsPerMinute(data.info.gameDuration, (participantData.totalMinionsKilled || 0) + (participantData.neutralMinionsKilled || 0)),

                            // Performance Stats
                            visionScore: participantData.visionScore || 0,
                            visionPerMinute: getMinionsPerMinute(data.info.gameDuration, participantData.visionScore || 0),
                            wardsPlaced: participantData.wardsPlaced || 0,
                            goldEarned: participantData.goldEarned || 0,
                            performanceScore: calculatePerformanceScore(participantData, data.info.gameDuration),
                            performancePlacement: 0,

                            totalHealsOnTeammates: participantData.totalHealsOnTeammates || 0,
                            totalDamageShieldedOnTeammates: participantData.totalDamageShieldedOnTeammates || 0,
                            totalDamageTaken: participantData.totalDamageTaken || 0,
                            totalDamageDealtToChampions: participantData.totalDamageDealtToChampions || 0,
                            individualPosition: participantData.individualPosition || '',
                            win: Boolean(participantData.win),

                            summonerSpell1: await getSummonerSpellByID(participantData.summoner1Id),
                            summonerSpell2: await getSummonerSpellByID(participantData.summoner2Id),
                            items: await extractItems(participantData),
                            champion: await getChampionById(participantData.championId),
                            runes: await fetchParticipantRunes(participantData),
                            statPerks: {
                                defense: await getStatPerkById(participantData.perks?.statPerks?.defense),
                                flex: await getStatPerkById(participantData.perks?.statPerks?.flex),
                                offense: await getStatPerkById(participantData.perks?.statPerks?.offense)
                            },
                            arenaStats: await extractArenaStats(participantData),
                        };
                    } catch (participantError) {
                        throw new Error(`Failed to process participant at index ${index}: ${participantError instanceof Error ? participantError.message : String(participantError)}`);
                    }
                })
            ),
            timelineData: []
        };

        // Calculate performance placement after all participants are processed
        matchDetails.participants.sort((a, b) => b.performanceScore - a.performanceScore);
        matchDetails.participants.forEach((participant, index) => {
            participant.performancePlacement = index + 1;
        });

        return matchDetails;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Unexpected error while fetching match details: ${String(error)}`);
    }
}
