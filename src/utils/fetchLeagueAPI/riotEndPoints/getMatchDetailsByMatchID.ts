import { MatchDetails, Participant } from "@/interfaces/productionTypes";
import { fetchFromRiotAPI } from "../fetchFromRiotAPI";
import { RawMatchData, RawParticipant } from "@/interfaces/rawTypes";
import { getKDA, getMinionsPerMinute } from "@/utils/helpers";
import { getChampionById, getStatPerkById, getSummonerSpellByID } from "@/utils/getLeagueAssets/getLOLObject";
import { extractArenaStats, extractItems, fetchParticipantRunes } from "../createLeagueAccount";

/**
 * Fetch match details by match ID.
 */
export async function getMatchDetailsByMatchID(matchID: string, region: string, activeRegion: string): Promise<MatchDetails> {
    const response: Response = await fetchFromRiotAPI(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}`
    );
    const data: RawMatchData = await response.json();

    const matchDetails: MatchDetails = {
        gameDuration: data.info.gameDuration,
        gameCreation: data.info.gameCreation,
        gameEndTimestamp: data.info.gameEndTimestamp,
        gameMode: data.info.gameMode,
        gameType: data.info.gameType,
        queueId: data.info.queueId,
        participants: await Promise.all(
            data.info.participants.map(async (participantData: RawParticipant): Promise<Participant> => {

                return {
                    puuid: participantData.puuid,
                    riotIdGameName: participantData.riotIdGameName,
                    riotIdTagline: participantData.riotIdTagline,
                    summonerName: participantData.summonerName,
                    region: region,
                    activeRegion: activeRegion,
                    champLevel: participantData.champLevel,
                    teamId: participantData.teamId,
                    teamPosition: participantData.teamPosition,

                    // Stats
                    kills: participantData.kills,
                    deaths: participantData.deaths,
                    assists: participantData.assists,
                    kda: getKDA(participantData.kills, participantData.deaths, participantData.assists),

                    // Minions Info
                    totalMinionsKilled: participantData.totalMinionsKilled,
                    neutralMinionsKilled: participantData.neutralMinionsKilled,
                    allMinionsKilled: participantData.totalMinionsKilled + participantData.neutralMinionsKilled,
                    minionsPerMinute: getMinionsPerMinute(data.info.gameDuration, (participantData.totalMinionsKilled + participantData.neutralMinionsKilled)),

                    // Performance Stats
                    visionScore: participantData.visionScore,
                    visionPerMinute: getMinionsPerMinute(data.info.gameDuration, participantData.visionScore),
                    wardsPlaced: participantData.wardsPlaced,
                    goldEarned: participantData.goldEarned,

                    totalHealsOnTeammates: participantData.totalHealsOnTeammates,
                    totalDamageShieldedOnTeammates: participantData.totalDamageShieldedOnTeammates,
                    totalDamageTaken: participantData.totalDamageTaken,
                    totalDamageDealtToChampions: participantData.totalDamageDealtToChampions,
                    individualPosition: participantData.individualPosition,
                    win: participantData.win,

                    summonerSpell1: await getSummonerSpellByID(participantData.summoner1Id),
                    summonerSpell2: await getSummonerSpellByID(participantData.summoner2Id),
                    items: await extractItems(participantData),
                    champion: await getChampionById(participantData.championId),
                    runes: await fetchParticipantRunes(participantData),
                    statPerks: {
                        defense: await getStatPerkById(participantData.perks.statPerks.defense),
                        flex: await getStatPerkById(participantData.perks.statPerks.flex),
                        offense: await getStatPerkById(participantData.perks.statPerks.offense)
                    },
                    arenaStats: await extractArenaStats(participantData),
                    
                    // Timeline data for this participant
                    timelineData: undefined,
                };
            })
        ),
    };

    return matchDetails;
}
