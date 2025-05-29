import { ArenaStats, Augment, Item, LeagueAccount, LeagueAccountDetails, LeagueRank, MatchDetails, Participant,  RiotAccountDetails, Rune } from '@/interfaces/productionTypes';
import { fetchFromRiotAPI } from './fetchFromRiotAPI';
import { RawMatchData, RawParticipant, RawTimelineData, RawTimelineEvent } from '@/interfaces/rawTypes';
import { getKDA, getMinionsPerMinute } from '../helpers';
import { getAugmentById, getChampionById, getItemById, getRuneById, getSummonerSpellByID } from '../getLeagueAssets/getLOLObject';
import { ParticipantTimelineData } from '@/interfaces/proudctionTimeLapTypes';

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
        participant.item6,
    ];

    const itemPromises = itemIds.map(async (id) => {
        const item = await getItemById(id);
        if (!item) {
            // Return a default empty item object if not found
            return {
                id: 0,
                name: "",
                description: "",
                active: false,
                inStore: false,
                from: [],
                to: [],
                categories: [],
                maxStacks: 0,
                requiredChampion: "",
                requiredAlly: "",
                requiredBuffCurrencyName: "",
                requiredBuffCurrencyCost: 0,
                specialRecipe: 0,
                isEnchantment: false,
                price: 0,
                priceTotal: 0,
                displayInItemSets: false,
                iconPath: "",
            } as Item;
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
export async function getAccountByRiotID(tagLine: string, gameName: string, region: string): Promise<RiotAccountDetails> {
    const response: Response = await fetchFromRiotAPI(
        `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`
    );
    return await response.json() as Promise<RiotAccountDetails>;
}

/**
 * Fetch the active region for a given PUUID.
 */
export async function getActiveRegionByPuuid(puuid: string, region: string, game: string = "lol"): Promise<string> {
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

    // Pobierz timeline data dla wszystkich uczestników
    let participantsTimelineData: ParticipantTimelineData[] = [];
    try {
        participantsTimelineData = await getMatchTimelineByMatchID(matchID, region);
    } catch (error) {
        console.error(`Failed to fetch timeline data for match ${matchID}:`, error);
    }

    const matchDetails: MatchDetails = {
        gameDuration: data.info.gameDuration,
        gameCreation: data.info.gameCreation,
        gameEndTimestamp: data.info.gameEndTimestamp,
        gameMode: data.info.gameMode,
        gameType: data.info.gameType,
        queueId: data.info.queueId,
        participants: await Promise.all(
            data.info.participants.map(async (participantData: RawParticipant, index: number): Promise<Participant> => {
                // Znajdź odpowiednie timeline data dla tego uczestnika
                const timelineData = participantsTimelineData.find(
                    ptd => ptd.participantId === (index + 1) // participantId w timeline zaczyna się od 1
                );

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

                    summonerSpell1: await getSummonerSpellByID(participantData.summoner1Id),
                    summonerSpell2: await getSummonerSpellByID(participantData.summoner2Id),
                    items: await extractItems(participantData),
                    champion: (await getChampionById(participantData.championId)) ?? { id: 0, name: 'Unknown', alias: 'Unknown', squarePortraitPath: '', roles: [] },
                    runes: await fetchParticipantRunes(participantData),
                    arenaStats: await extractArenaStats(participantData),
                    
                    // Dodaj timeline data
                    timelineData: timelineData
                };
            })
        ),
    };

    return matchDetails;
}

/**
 * Creates a LeagueAccount object for a given PUUID.
 */
export async function createLeagueAccount(puuid: string, region: string, activeRegion: string): Promise<LeagueAccount> {
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

async function getMatchTimelineByMatchID(matchID: string, region: string): Promise<ParticipantTimelineData[]> {
    const response: Response = await fetchFromRiotAPI(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}/timeline`
    );
    
    const timelineData: RawTimelineData = await response.json();
    
    const participantsTimelineData: ParticipantTimelineData[] = [];
    
    for (let participantId = 1; participantId <= 10; participantId++) {
        const participantTimeline: ParticipantTimelineData = {
            participantId: participantId,
            frames: []
        };
        
        for (const frame of timelineData.info.frames) {
            const playerEvents = frame.events?.filter((event: RawTimelineEvent) => 
                event.participantId === participantId ||
                event.killerId === participantId ||
                event.victimId === participantId ||
                event.creatorId === participantId ||
                (event.assistingParticipantIds && event.assistingParticipantIds.includes(participantId))
            ) || [];
            
            const mappedEvents = await Promise.all(playerEvents.map(async (event: RawTimelineEvent) => {
                const mappedEvent: RawTimelineEvent & { 
                    itemPurchased?: Item; 
                    itemSold?: Item; 
                    itemDestroyed?: Item; 
                } = {
                    timestamp: event.timestamp || 0,
                    type: event.type || 'PAUSE_END',
                    ...event
                };
                
                // Przypisz participantId dla eventów, które go nie mają
                if (
                    !mappedEvent.participantId &&
                    ['WARD_PLACED', 'ITEM_PURCHASED', 'ITEM_DESTROYED', 'ITEM_SOLD', 'ITEM_UNDO',
                     'SKILL_LEVEL_UP', 'LEVEL_UP', 'CHAMPION_SPECIAL_KILL', 'TURRET_PLATE_DESTROYED',
                     'BUILDING_KILL', 'ELITE_MONSTER_KILL'].includes(mappedEvent.type ?? '')
                ) {
                    mappedEvent.participantId = participantId;
                }
                
                if (mappedEvent.type === 'CHAMPION_KILL' && !mappedEvent.victimId) {
                    mappedEvent.victimId = participantId;
                }
                
                if (mappedEvent.type === 'WARD_KILL' && !mappedEvent.killerId) {
                    mappedEvent.killerId = participantId;
                }

                // Konwertuj itemId na obiekt Item dla eventów itemów
                if (mappedEvent.type === 'ITEM_PURCHASED' && mappedEvent.itemId) {
                    const item = await getItemById(mappedEvent.itemId);
                    if (item) {
                        mappedEvent.itemPurchased = item;
                        delete mappedEvent.itemId;
                    }
                }
                
                if (mappedEvent.type === 'ITEM_SOLD' && mappedEvent.itemId) {
                    const item = await getItemById(mappedEvent.itemId);
                    if (item) {
                        mappedEvent.itemSold = item;
                        delete mappedEvent.itemId;
                    }
                }
                
                if (mappedEvent.type === 'ITEM_DESTROYED' && mappedEvent.itemId) {
                    const item = await getItemById(mappedEvent.itemId);
                    if (item) {
                        mappedEvent.itemDestroyed = item;
                        delete mappedEvent.itemId;
                    }
                }

                return mappedEvent as unknown as import('@/interfaces/proudctionTimeLapTypes').SpecificGameEvent;
            }));

            const validEvents = mappedEvents.filter((event): event is import('@/interfaces/proudctionTimeLapTypes').SpecificGameEvent => !!event.type);

            if (validEvents.length > 0) {
                participantTimeline.frames.push({
                    timestamp: frame.timestamp,
                    events: validEvents
                });
            }
        }
        
        participantsTimelineData.push(participantTimeline);
    }
    
    return participantsTimelineData;
}


