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
    recentMatches: RecentMatch[];
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

export interface RecentMatch
{
    matchId : string;
    matchDetails : MatchDetails;
}

export interface MatchDetails
{
    participants : Participant[];
    gameDuration : number;
    gameCreation : number;
    gameEndTimestamp : number;
    gameMode : string;
    gameType : string;
    queueId : number;
}

export interface Participant
{
    puuid : string;
    riotIdGameName : string;
    riotIdTagline : string;
    summonerName : string;
    teamId : number;
    teamPosition : string;
    champLevel : number;

    // Stats
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
    visionPerMinute : string;
    wardsPlaced : number;
    goldEarned : number;
    totalHealsOnTeammates : number;
    totalDamageShieldedOnTeammates : number;
    totalDamageTaken : number;
    totalDamageDealtToChampions : number;
    individualPosition : string;
    win : boolean;

    champion: Champion;
    arenaStats : ArenaStats;
    runes : Rune[];
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
    name: string;
    tooltip: string;
    shortDesc: string;
    longDesc: string;
    iconPath: string;
    runeTree?: string;
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

export interface Champion {
    id: number;
    name: string;
    alias: string;
    squarePortraitPath: string;
    roles: string[];
}

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