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
    champLevel : number;
    championId : number;
    championName : string;
    teamId : number;
    teamPosition : string;

    // Stats
    kills : number;
    deaths : number;
    assists : number;
    kda : string;

    // Minions Info
    totalMinionsKilled : number;
    neutralMinionsKilled: number;
    allMinionsKilled: number;
    minionsPerMinute: string;

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

    arenaStats : ArenaStats;
    runePage : RunePage;
    items : number[];
}

export interface ArenaStats
{
    placement : number;
    augments : number[];
    playerSubteamId : number;
}

// Whole rune page
export interface RunePage {
    statPerks: StatPerks;
    styles: RuneStyle[];
}

// Stat perks section
export interface StatPerks {
    defense: number;
    flex: number;
    offense: number;
}

// Rune tree section
export interface RuneStyle {
    description: string;
    selections: RuneSelection[];
    style: number;
}

// Single rune selection
export interface RuneSelection {
    perk: number;
    var1: number;
    var2: number;
    var3: number;
}