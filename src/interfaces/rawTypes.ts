export interface RawMatchData {
    metadata: {
        dataVersion: string;
        matchId: string;
        participants: string[];
    };
    info: {
        endOfGameResult: string;
        gameCreation: number;
        gameDuration: number;
        gameEndTimestamp: number;
        gameId: number;
        gameMode: string;
        gameName: string;
        gameStartTimestamp: number;
        gameType: string;
        gameVersion: string;
        mapId: number;
        participants: RawParticipant[];
        platformId: string;
        queueId: number;
        teams: RawTeam[];
        tournamentCode: string;
    };
}

export interface RawParticipant {
    allInPings: number;
    assistMePings: number;
    assists: number;
    baronKills: number;
    basicPings: number;
    bountyLevel: number;
    challenges: Record<string, number>;
    champExperience: number;
    champLevel: number;
    championId: number;
    championName: string;
    championTransform: number;
    commandPings: number;
    consumablesPurchased: number;
    damageDealtToBuildings: number;
    damageDealtToObjectives: number;
    damageDealtToTurrets: number;
    damageSelfMitigated: number;
    dangerPings: number;
    deaths: number;
    detectorWardsPlaced: number;
    doubleKills: number;
    dragonKills: number;
    eligibleForProgression: boolean;
    enemyMissingPings: number;
    enemyVisionPings: number;
    firstBloodAssist: boolean;
    firstBloodKill: boolean;
    firstTowerAssist: boolean;
    firstTowerKill: boolean;
    gameEndedInEarlySurrender: boolean;
    gameEndedInSurrender: boolean;
    getBackPings: number;
    goldEarned: number;
    goldSpent: number;
    holdPings: number;
    individualPosition: string;
    inhibitorKills: number;
    inhibitorTakedowns: number;
    inhibitorsLost: number;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
    item6: number;
    itemsPurchased: number;
    killingSprees: number;
    kills: number;
    lane: string;
    largestCriticalStrike: number;
    largestKillingSpree: number;
    largestMultiKill: number;
    longestTimeSpentLiving: number;
    magicDamageDealt: number;
    magicDamageDealtToChampions: number;
    magicDamageTaken: number;
    missions: Record<string, number>;
    needVisionPings: number;
    neutralMinionsKilled: number;
    nexusKills: number;
    nexusLost: number;
    nexusTakedowns: number;
    objectivesStolen: number;
    objectivesStolenAssists: number;
    onMyWayPings: number;
    participantId: number;
    pentaKills: number;
    perks: {
        statPerks: {
            defense: number;
            flex: number;
            offense: number;
        };
        styles: Array<{
            description: string;
            selections: Array<{
                perk: number;
                var1: number;
                var2: number;
                var3: number;
            }>;
            style: number;
        }>;
    };
    physicalDamageDealt: number;
    physicalDamageDealtToChampions: number;
    physicalDamageTaken: number;
    placement: number;
    playerAugment1: number;
    playerAugment2: number;
    playerAugment3: number;
    playerAugment4: number;
    playerAugment5?: number;
    playerAugment6?: number;
    playerSubteamId: number;
    profileIcon: number;
    pushPings: number;
    puuid: string;
    quadraKills: number;
    retreatPings: number;
    riotIdGameName: string;
    riotIdTagline: string;
    role: string;
    sightWardsBoughtInGame: number;
    spell1Casts: number;
    spell2Casts: number;
    spell3Casts: number;
    spell4Casts: number;
    subteamPlacement: number;
    summoner1Casts: number;
    summoner1Id: number;
    summoner2Casts: number;
    summoner2Id: number;
    summonerId: string;
    summonerLevel: number;
    summonerName: string;
    teamEarlySurrendered: boolean;
    teamId: number;
    teamPosition: string;
    timeCCingOthers: number;
    timePlayed: number;
    totalAllyJungleMinionsKilled: number;
    totalDamageDealt: number;
    totalDamageDealtToChampions: number;
    totalDamageShieldedOnTeammates: number;
    totalDamageTaken: number;
    totalEnemyJungleMinionsKilled: number;
    totalHeal: number;
    totalHealsOnTeammates: number;
    totalMinionsKilled: number;
    totalTimeCCDealt: number;
    totalTimeSpentDead: number;
    totalUnitsHealed: number;
    tripleKills: number;
    trueDamageDealt: number;
    trueDamageDealtToChampions: number;
    trueDamageTaken: number;
    turretKills: number;
    turretTakedowns: number;
    turretsLost: number;
    unrealKills: number;
    visionClearedPings: number;
    visionScore: number;
    visionWardsBoughtInGame: number;
    wardsKilled: number;
    wardsPlaced: number;
    win: boolean;
}

export interface RawTeam {
    bans: Array<{
        championId: number;
        pickTurn: number;
    }>;
    objectives: {
        baron: { first: boolean; kills: number };
        champion: { first: boolean; kills: number };
        dragon: { first: boolean; kills: number };
        horde: { first: boolean; kills: number };
        inhibitor: { first: boolean; kills: number };
        riftHerald: { first: boolean; kills: number };
        tower: { first: boolean; kills: number };
    };
    teamId: number;
    win: boolean;
}

export interface RawTimelineData {
    metadata: {
        dataVersion: string;
        matchId: string;
        participants: string[];
    };
    info: {
        endOfGameResult: string;
        frameInterval: number;
        frames: RawTimelineFrame[];
        gameId: number;
        participants: RawTimelineParticipant[];
    };
}

export interface RawTimelineFrame {
    events: RawTimelineEvent[];
    participantFrames: Record<string, RawParticipantFrame>;
    timestamp: number;
}

export interface RawTimelineEvent {
    type?: string;
    timestamp?: number;
    participantId?: number;
    itemId?: number;
    afterId?: number;
    beforeId?: number;
    gold?: number;
    victimId?: number;
    killerId?: number;
    assistingParticipantIds?: number[];
    wardType?: string;
    creatorId?: number;
    killType?: string;
    laneType?: string;
    teamId?: number;
    buildingType?: string;
    towerType?: string;
    skillSlot?: number;
    levelUpType?: string;
    monsterType?: string;
    monsterSubType?: string;
    position?: {
        x: number;
        y: number;
    };
    bounty?: number;
}

export interface RawParticipantFrame {
    currentGold?: number;
    goldPerSecond?: number;
    jungleMinionsKilled?: number;
    level?: number;
    minionsKilled?: number;
    participantId?: number;
    position?: {
        x: number;
        y: number;
    };
    totalGold?: number;
    xp?: number;
    damageStats?: {
        magicDamageDone?: number;
        magicDamageDoneToChampions?: number;
        magicDamageTaken?: number;
        physicalDamageDone?: number;
        physicalDamageDoneToChampions?: number;
        physicalDamageTaken?: number;
        totalDamageDone?: number;
        totalDamageDoneToChampions?: number;
        totalDamageTaken?: number;
        trueDamageDone?: number;
        trueDamageDoneToChampions?: number;
        trueDamageTaken?: number;
    };
}

export interface RawTimelineParticipant {
    participantId: number;
    puuid: string;
}