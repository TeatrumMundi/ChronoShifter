import {ArenaStats, LeagueAccount, LeagueAccountDetails, LeagueRank, MatchDetails, Participant, RiotAccount, RunePage, RuneSelection, RuneStyle, StatPerks} from '@/interfaces/interfaces';
import {fetchFromRiotAPI} from './fetchFromRiotAPI';

async function getAccountByRiotID(tagLine: string, gameName: string, region: string): Promise<RiotAccount>{
    const response : Response = await fetchFromRiotAPI(
        `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`
    );
    return await response.json() as Promise<RiotAccount>;
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

async function getMatchDetailsByMatchID(matchID: string, region: string): Promise<MatchDetails>
{
    const response: Response = await fetchFromRiotAPI(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}`
    );
    const data = await response.json();

}

export async function createLeagueAccount(tagLine: string, gameName: string, region: string): Promise<LeagueAccount>
{
    if (!tagLine || !gameName || !region) {
        throw new Error("Invalid parameters");
    }


    const riotAccount : RiotAccount = await getAccountByRiotID(tagLine, gameName, region);
    if (!riotAccount) {
        throw new Error("Riot account not found");
    }

    // Get the active region for the account
    const activeRegion : string = await getActiveRegionByPuuid(riotAccount.puuid, region);
    if (!activeRegion) {
        throw new Error("Active region not found");
    }
    
    // Get the League account details
    const leagueAccountsDetails : LeagueAccountDetails = await getSummonerByPuuid(riotAccount.puuid, activeRegion);
    if (!leagueAccountsDetails) {
        throw new Error("League account details not found");
    }

    // Get the ranked league entries
    const leagueRank : LeagueRank[] = await getRankedLeagueEntries(riotAccount.puuid, activeRegion);
    if (!leagueRank) {
        throw new Error("League rank not found");
    }

/*     const recentMatchesIDs : string[] = await getRecentMatchesIDsByPuuid(riotAccount.puuid, activeRegion);

    const recentMatches = await Promise.all(
        recentMatchesIDs.map(async (matchId) => ({
            matchId,
            matchDetails: await getMatchDetailsByMatchID(matchId, activeRegion)
        }))
    ); */


    return {riotAccount, leagueAccountsDetails, leagueRank};
}