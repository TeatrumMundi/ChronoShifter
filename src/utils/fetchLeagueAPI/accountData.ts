import {ArenaStats, LeagueAccount, LeagueAccountDetails, LeagueRank, MatchDetails, Participant, RiotAccount, RiotAccountDetails, RunePage, RuneSelection, RuneStyle} from '@/interfaces/productionTypes';
import {fetchFromRiotAPI} from './fetchFromRiotAPI';
import { RawMatchData, RawParticipant } from '@/interfaces/rawTypes';

async function getAccountByRiotID(tagLine: string, gameName: string, region: string): Promise<RiotAccountDetails>{
    const response : Response = await fetchFromRiotAPI(
        `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`
    );
    return await response.json() as Promise<RiotAccountDetails>;
}

async function getSummonerByPuuid(puuid: string, server: string): Promise<LeagueAccountDetails>{
    const response : Response = await fetchFromRiotAPI(
        `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`
    );
    return await response.json() as Promise<LeagueAccountDetails>;
}

async function getActiveRegionByPuuid(puuid: string, region: string, game: string = "lol"): Promise<string>{
    const response: Response = await fetchFromRiotAPI(
        `https://${region}.api.riotgames.com/riot/account/v1/region/by-game/${game}/by-puuid/${puuid}`
    );
    const data = await response.json();
    return data.region;
}

async function getRankedLeagueEntries(puuid: string, activeRegion: string): Promise<LeagueRank[]> {
    const response: Response = await fetchFromRiotAPI(
        `https://${activeRegion}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`
    );

    const apiEntries = await response.json();

    return apiEntries.map((entry: LeagueRank) => ({
        queueType: entry.queueType,
        tier: entry.tier,
        rank: entry.rank,
        leaguePoints: entry.leaguePoints,
        wins: entry.wins,
        losses: entry.losses,
        winRate: (entry.wins + entry.losses > 0) ? Math.round((entry.wins / (entry.wins + entry.losses)) * 100) : 0,
        hotStreak: entry.hotStreak
    }));
}

async function getRecentMatchesIDsByPuuid(puuid: string, region: string, start: number = 0, number: number = 20) : Promise<string[]>
{
    const response: Response = await fetchFromRiotAPI(
        `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${number}`
    )
    return await response.json() as Promise<string[]>;
}

async function getMatchDetailsByMatchID(matchID: string, region: string): Promise<MatchDetails> {
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
        participants: data.info.participants.map((participantData: RawParticipant): Participant => {
            // Zbuduj tablicę itemów
            const items: number[] = [];
            for (let i = 0; i <= 6; i++) {
                const itemValue = participantData[`item${i}` as keyof RawParticipant] as number;
                items.push(itemValue);
            }

            // Zbuduj arenaStats
            const arenaStats: ArenaStats = {
                placement: participantData.placement ?? 0,
                augments: [
                    participantData.playerAugment1,
                    participantData.playerAugment2,
                    participantData.playerAugment3,
                    participantData.playerAugment4,
                ].filter(aug => aug !== 0 && aug !== undefined) as number[],
                playerSubteamId: participantData.playerSubteamId ?? 0,
            };

            // Zbuduj runePage (upewnij się, że perks istnieje)
            const runePage: RunePage = {
                statPerks: {
                    defense: participantData.perks?.statPerks?.defense ?? 0,
                    flex: participantData.perks?.statPerks?.flex ?? 0,
                    offense: participantData.perks?.statPerks?.offense ?? 0,
                },
                styles: (participantData.perks?.styles ?? []).map((styleData: RuneStyle): RuneStyle => ({
                    description: styleData.description,
                    selections: (styleData.selections ?? []).map((selectionData: RuneSelection): RuneSelection => ({
                        perk: selectionData.perk,
                        var1: selectionData.var1,
                        var2: selectionData.var2,
                        var3: selectionData.var3,
                    })),
                    style: styleData.style,
                })),
            };

            return {
                puuid: participantData.puuid,
                riotIdGameName: participantData.riotIdGameName,
                riotIdTagline: participantData.riotIdTagline,
                summonerName: participantData.summonerName,
                champLevel: participantData.champLevel,
                championId: participantData.championId,
                championName: participantData.championName,
                teamId: participantData.teamId,
                kills: participantData.kills,
                deaths: participantData.deaths,
                assists: participantData.assists,
                totalMinionsKilled: participantData.totalMinionsKilled,
                neutralMinionsKilled: participantData.neutralMinionsKilled,
                allMinionsKilled: participantData.totalMinionsKilled + participantData.neutralMinionsKilled,
                goldEarned: participantData.goldEarned,
                totalHealsOnTeammates: participantData.totalHealsOnTeammates,
                totalDamageShieldedOnTeammates: participantData.totalDamageShieldedOnTeammates,
                totalDamageTaken: participantData.totalDamageTaken,
                totalDamageDealtToChampions: participantData.totalDamageDealtToChampions,
                individualPosition: participantData.individualPosition,
                items: items,
                runePage: runePage,
                arenaStats: arenaStats,
                win: participantData.win,
            };
        }),
    };

    return matchDetails;
}

export async function createLeagueAccount(puuid: string, region: string, activeRegion: string): Promise<LeagueAccount> {
    // Get the League account details
    const leagueAccountsDetails: LeagueAccountDetails = await getSummonerByPuuid(puuid, activeRegion);
    if (!leagueAccountsDetails) {
        throw new Error("League account details not found");
    }

    // Get the ranked league entries
    const leagueRank: LeagueRank[] = await getRankedLeagueEntries(puuid, activeRegion);
    if (!leagueRank) {
        throw new Error("League rank not found");
    }

    // Get the recent matches IDs
    let recentMatchesIDs: string[] = [];
    try {recentMatchesIDs = await getRecentMatchesIDsByPuuid(puuid, region, 0, 5);
    } catch (error) {
        console.error("Failed to fetch recent matches IDs:", error);
        recentMatchesIDs = [];
    }

    // Fetch match details for each recent match ID
    const recentMatchesRaw = await Promise.all(
        recentMatchesIDs.map(async (matchId) => {
            try {
                const matchDetails = await getMatchDetailsByMatchID(matchId, region);
                return { matchId, matchDetails };
            } catch (error) {
                console.error(`Failed to fetch match details for match ${matchId}:`, error);
                return null;
            }
        })
    );

    // Filter out any null values from the recent matches
    const recentMatches = recentMatchesRaw.filter((m): m is { matchId: string; matchDetails: MatchDetails } => m !== null);

    return { leagueAccountsDetails, leagueRank, recentMatches };
}

export async function createRiotAccount(tagLine: string, gameName: string, region: string): Promise<RiotAccount> {
    if (!tagLine || !gameName || !region) {
        throw new Error("Invalid parameters");
    }

    const riotAccountDetails: RiotAccountDetails = await getAccountByRiotID(tagLine, gameName, region);
    if (!riotAccountDetails) {
        throw new Error("Riot account not found");
    }

    // Get the active region for the account
    const activeRegion: string = await getActiveRegionByPuuid(riotAccountDetails.puuid, region);
    if (!activeRegion) {
        throw new Error("Active region not found");
    }

    const leagueAccount: LeagueAccount = await createLeagueAccount(riotAccountDetails.puuid, region, activeRegion);

    return { riotAccountDetails, leagueAccount };
}