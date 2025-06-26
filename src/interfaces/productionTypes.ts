import { Champion } from "./ChampionType";
import { ParticipantTimelineData } from "./proudctionTimeLapTypes";

export interface RiotAccount
{
    riotAccountDetails : RiotAccountDetails;
    leagueAccount: LeagueAccount;
}

export interface RiotAccountDetails
{
    puuid : string;
    gameName : string;
    tagLine : string;
}

export interface LeagueAccount
{
    leagueAccountsDetails : LeagueAccountDetails;
    leagueSoloRank : LeagueRank;
    leagueFlexRank : LeagueRank;
    matchHistory: Match[];
}

export interface LeagueAccountDetails
{
    id : string;
    accountId : string;
    puuid : string;
    region: string;
    activeRegion: string;
    profileIconId : number;
    revisionDate : number;
    summonerLevel : number;
}

export interface LeagueRank
{
    queueType : string;
    tier : string;
    rank : string;
    leaguePoints : number;
    wins : number;
    losses : number;
    winRate : number;
    hotStreak : boolean;
}

export interface Match
{
    matchId : number;
    gameDuration : number;
    gameCreation : number;
    gameEndTimestamp : number;
    gameMode : string;
    gameType : string;
    queueId : number;
    participants : Participant[];
    timelineData : ParticipantTimelineData[];
}

export interface Participant
{
    // Basic Info
    puuid : string;
    participantId : number;
    summonerId : string;
    riotIdGameName : string;
    riotIdTagline : string;
    summonerName : string;
    region : string;
    activeRegion : string;

    // Team Info
    teamId : number;
    teamPosition : string;
    
    // Stats
    champLevel : number;
    kills : number;
    deaths : number;
    assists : number;
    kda : string;

    // Minions Info
    totalMinionsKilled : number;
    neutralMinionsKilled: number;
    allMinionsKilled: number;
    minionsPerMinute: number;

    // Performance Stats
    visionScore : number;
    visionPerMinute : number;
    wardsPlaced : number;
    goldEarned : number;
    performanceScore : number;
    performancePlacement : number;
    totalHealsOnTeammates : number;
    totalDamageShieldedOnTeammates : number;
    totalDamageTaken : number;
    totalDamageDealtToChampions : number;
    individualPosition : string;
    win : boolean;

    summonerSpell1 : SummonerSpell;
    summonerSpell2 : SummonerSpell;
    champion: Champion;
    arenaStats : ArenaStats;
    runes : Rune[];
    statPerks : StatPerks;
    items : Item[];
}

export interface ArenaStats
{
    placement : number;
    playerSubteamId : number;
    augments : Augment[];
}

export interface Rune {
    id: number;
    key: string;
    icon: string;
    name: string;
    shortDesc: string;
    longDesc: string;
    runeTree: RuneTree;
}

export interface StatPerks {
    defense: Perk;
    flex: Perk;
    offense: Perk;
}

export interface Perk {
    id: number;
    name: string;
    desc: string;
    longDesc: string;
    path: string;
}

export interface RuneTree {
    id: number;
    key: string;
    icon: string;
    name: string;
}

export type Augment = {
    apiName: string;
    calculations: object;
    dataValues: object;
    desc: string;
    iconLarge: string;
    iconSmall: string;
    id: number;
    name: string;
    rarity: number;
    tooltip: string;
};

export interface Item {
    id: number;
    name: string;
    description: string;
    active: boolean;
    inStore: boolean;
    from: number[];
    to: number[];
    categories: string[];
    maxStacks: number;
    requiredChampion: string;
    requiredAlly: string;
    requiredBuffCurrencyName: string;
    requiredBuffCurrencyCost: number;
    specialRecipe: number;
    isEnchantment: boolean;
    price: number;
    priceTotal: number;
    displayInItemSets: boolean;
    iconPath: string;
}

export interface SummonerSpell {
    id: number;
    name: string;
    description: string;
    summonerLevel: number;
    cooldown: number;
    gameModes: string[];
    iconPath: string;
}