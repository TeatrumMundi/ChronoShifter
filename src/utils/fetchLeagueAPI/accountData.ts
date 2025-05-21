import { ArenaStats, Augment, Item, LeagueAccount, LeagueAccountDetails, LeagueRank, MatchDetails, Participant, RiotAccount, RiotAccountDetails, Rune } from '@/interfaces/productionTypes';
import { fetchFromRiotAPI } from './fetchFromRiotAPI';
import { RawMatchData, RawParticipant } from '@/interfaces/rawTypes';
import { getKDA, getMinionsPerMinute } from '../helpers';
import { getAugmentById, getChampionById, getItemById, getRuneById } from '../getLeagueAssets/getLOLObject';

/**
 * Extracts all item objects for a participant by fetching from local items.json.
 */
async function extractItems(participant: RawParticipant): Promise<Item[]> {
    const itemIds: number[] = [
        participant.item0,
        participant.item1,
        participant.item2,
        participant.item3,
        participant.item4,
        participant.item5,
    ];

    const itemPromises = itemIds
        .filter(id => id && id > 0)
        .map(async (id) => {
            const item = await getItemById(id);
            if (!item) {
                throw new Error(`Item with ID ${id} not found in items.json`);
            }
            return item;
        });

    return await Promise.all(itemPromises);
}

/**
 * Fetches the runes for a participant by extracting the rune IDs from the participant's perks.
 */
async function fetchParticipantRunes(participant: RawParticipant): Promise<Rune[]> {
    const runeIds = participant.perks?.styles.flatMap(style =>
        style.selections.map(selection => selection.perk)
    ) ?? [];

    const runePromises = runeIds.map(runeId => getRuneById(runeId));
    const runeObjects = await Promise.all(runePromises);
    return runeObjects.filter((rune): rune is Rune => rune !== null);
}

/**
 * Creates an ArenaStats object based on participant data.
 */
async function extractArenaStats(participantData: RawParticipant): Promise<ArenaStats> {
    // Get augments as objects
    const augmentIds = [
        participantData.playerAugment1,
        participantData.playerAugment2,
        participantData.playerAugment3,
        participantData.playerAugment4,
        participantData.playerAugment5,
        participantData.playerAugment6,
    ].filter(aug => aug !== 0 && aug !== undefined) as number[];

    const augments = (
        await Promise.all(augmentIds.map(id => getAugmentById(id)))
    ).filter((a): a is Augment => a !== undefined);

    // Build and return the full ArenaStats object
    return {
        placement: participantData.placement ?? 0,
        augments,
        playerSubteamId: participantData.playerSubteamId ?? 0,
    };
}

/**
 * Fetch Riot account details by Riot ID.
 */
async function getAccountByRiotID(tagLine: string, gameName: string, region: string): Promise<RiotAccountDetails> {
    const response: Response = await fetchFromRiotAPI(
        `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`
    );
    return await response.json() as Promise<RiotAccountDetails>;
}

/**
 * Fetch the active region for a given PUUID.
 */
async function getActiveRegionByPuuid(puuid: string, region: string, game: string = "lol"): Promise<string> {
    const response: Response = await fetchFromRiotAPI(
        `https://${region}.api.riotgames.com/riot/account/v1/region/by-game/${game}/by-puuid/${puuid}`
    );
    const data = await response.json();
    return data.region;
}

/**
 * Fetch League account details by PUUID.
 */
async function getSummonerByPuuid(puuid: string, region: string, activeRegion: string): Promise<LeagueAccountDetails> {
    const response: Response = await fetchFromRiotAPI(
        `https://${activeRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`
    );
    const data = await response.json();

    return {
        ...data,
        region,
        activeRegion
    } as LeagueAccountDetails;
}

/**
 * Fetch ranked league entries for a given PUUID.
 */
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

/**
 * Fetch recent match IDs for a given PUUID.
 */
async function getRecentMatchesIDsByPuuid(puuid: string, region: string, start: number = 0, number: number = 20): Promise<string[]> {
    const response: Response = await fetchFromRiotAPI(
        `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${number}`
    )
    return await response.json() as Promise<string[]>;
}

/**
 * Fetch match details by match ID.
 */
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
        queueId: data.info.queueId,
        participants: await Promise.all(
            data.info.participants.map(async (participantData: RawParticipant): Promise<Participant> => {
                return {
                    puuid: participantData.puuid,
                    riotIdGameName: participantData.riotIdGameName,
                    riotIdTagline: participantData.riotIdTagline,
                    summonerName: participantData.summonerName,
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

                    items: await extractItems(participantData),
                    champion: (await getChampionById(participantData.championId)) ?? { id: 0, name: 'Unknown', alias: 'Unknown', squarePortraitPath: '', roles: [] },
                    runes: await fetchParticipantRunes(participantData),
                    arenaStats: await extractArenaStats(participantData),
                };
            })
        ),
    };

    return matchDetails;
}

/**
 * Creates a LeagueAccount object for a given PUUID.
 */
async function createLeagueAccount(puuid: string, region: string, activeRegion: string): Promise<LeagueAccount> {
    // Get the League account details
    const leagueAccountsDetails: LeagueAccountDetails = await getSummonerByPuuid(puuid, region, activeRegion);
    if (!leagueAccountsDetails) {
        throw new Error("League account details not found");
    }

    const leagueRanks: LeagueRank[] = await getRankedLeagueEntries(puuid, activeRegion);

    const leagueSoloRank = leagueRanks.find(r => r.queueType === "RANKED_SOLO_5x5") ?? {
        queueType: "RANKED_SOLO_5x5",
        tier: "UNRANKED",
        rank: "",
        leaguePoints: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        hotStreak: false
    };

    const leagueFlexRank = leagueRanks.find(r => r.queueType === "RANKED_FLEX_SR") ?? {
        queueType: "RANKED_FLEX_SR",
        tier: "UNRANKED",
        rank: "",
        leaguePoints: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        hotStreak: false
    };

    // Get the recent matches IDs
    let recentMatchesIDs: string[] = [];
    try {
        recentMatchesIDs = await getRecentMatchesIDsByPuuid(puuid, region, 0, 5);
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

    return { leagueAccountsDetails, leagueSoloRank, leagueFlexRank, recentMatches };
}

/**
 * Creates a RiotAccount object for a given Riot ID.
 */
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
