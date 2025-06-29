import { createPrismaClient } from "@/utils/helpers";
import { Match as MatchInterface, Participant as ParticipantInterface, Rune, StatPerks, Perk, ArenaStats as ArenaStatsInterface } from "@/interfaces/productionTypes";
import { Champion } from "@/interfaces/ChampionType";
import { ParticipantTimelineData } from "@/interfaces/proudctionTimeLapTypes";
import { Prisma } from "@prisma/client";

// Create singleton Prisma client
const prisma = createPrismaClient();

// Type for match with all includes
type MatchWithIncludes = Prisma.MatchGetPayload<{
    include: {
        participants: {
            include: {
                champion: true;
                summonerSpell1: true;
                summonerSpell2: true;
                riotAccount: {
                    include: {
                        riotAccountDetails: true;
                        leagueAccount: {
                            include: {
                                leagueAccountDetails: true;
                                leagueSoloRank: true;
                                leagueFlexRank: true;
                            }
                        }
                    }
                };
                items: {
                    include: {
                        item: true;
                    }
                };
                runes: {
                    include: {
                        rune: {
                            include: {
                                runeTree: true;
                            }
                        }
                    }
                };
                statPerks: {
                    include: {
                        statPerk: true;
                    }
                };
                arenaStats: {
                    include: {
                        augments: {
                            include: {
                                augment: true;
                            }
                        }
                    }
                };
            }
        };
        timeline?: true;
    }
}>;

type ParticipantWithIncludes = MatchWithIncludes['participants'][0];

/**
 * Transform database runes to interface format
 */
function transformRunes(participantRunes: ParticipantWithIncludes['runes']): Rune[] {
    return participantRunes.map(pr => ({
        id: pr.rune.id,
        key: pr.rune.key,
        icon: pr.rune.icon,
        name: pr.rune.name,
        shortDesc: pr.rune.shortDesc,
        longDesc: pr.rune.longDesc,
        runeTree: {
            id: pr.rune.runeTree.id,
            key: pr.rune.runeTree.key,
            icon: pr.rune.runeTree.icon,
            name: pr.rune.runeTree.name
        }
    }));
}

/**
 * Transform database stat perks to interface format
 */
function transformStatPerks(participantStatPerks: ParticipantWithIncludes['statPerks']): StatPerks {
    const statPerks: { [key: number]: Perk } = {};
    
    participantStatPerks.forEach(psp => {
        statPerks[psp.position] = {
            id: psp.statPerk.id,
            name: psp.statPerk.name,
            desc: psp.statPerk.desc,
            longDesc: psp.statPerk.longDesc,
            path: psp.statPerk.path
        };
    });

    return {
        offense: statPerks[0] || null,
        flex: statPerks[1] || null,
        defense: statPerks[2] || null
    };
}

/**
 * Transform database items to interface format
 */
function transformItems(participantItems: ParticipantWithIncludes['items']) {
    return participantItems.map(pi => ({
        id: pi.item.id,
        name: pi.item.name,
        description: pi.item.description,
        active: pi.item.active,
        inStore: pi.item.inStore,
        from: Array.isArray(pi.item.from) ? pi.item.from as number[] : [],
        to: Array.isArray(pi.item.to) ? pi.item.to as number[] : [],
        categories: Array.isArray(pi.item.categories) ? pi.item.categories as string[] : [],
        maxStacks: pi.item.maxStacks,
        requiredChampion: "",
        requiredAlly: "",
        requiredBuffCurrencyName: "",
        requiredBuffCurrencyCost: 0,
        specialRecipe: 0,
        isEnchantment: false,
        price: pi.item.price,
        priceTotal: pi.item.priceTotal,
        displayInItemSets: true,
        iconPath: pi.item.iconPath
    }));
}

/**
 * Transform database arena stats to interface format
 */
function transformArenaStats(arenaStats: ParticipantWithIncludes['arenaStats']): ArenaStatsInterface | null {
    if (!arenaStats) return null;
    
    return {
        placement: arenaStats.placement,
        playerSubteamId: arenaStats.playerSubteamId,
        augments: arenaStats.augments.map(aa => ({
            apiName: aa.augment.apiName,
            calculations: aa.augment.calculations as object,
            dataValues: aa.augment.dataValues as object,
            desc: aa.augment.desc,
            iconLarge: aa.augment.iconLarge,
            iconSmall: aa.augment.iconSmall,
            id: aa.augment.id,
            name: aa.augment.name,
            rarity: aa.augment.rarity,
            tooltip: aa.augment.tooltip
        }))
    };
}

/**
 * Transform database participant to interface format
 */
function transformParticipant(participant: ParticipantWithIncludes): ParticipantInterface {
    return {
        // Basic Info
        puuid: participant.puuid,
        participantId: participant.participantId,
        summonerId: "", // Not in database schema
        riotIdGameName: participant.riotIdGameName,
        riotIdTagline: participant.riotIdTagline,
        summonerName: participant.summonerName,
        region: participant.region,
        activeRegion: participant.activeRegion,

        // Team Info
        teamId: participant.teamId,
        teamPosition: participant.teamPosition,
        
        // Stats
        champLevel: participant.champLevel,
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        kda: participant.kda,

        // Minions Info
        totalMinionsKilled: participant.totalMinionsKilled,
        neutralMinionsKilled: participant.neutralMinionsKilled,
        allMinionsKilled: participant.allMinionsKilled,
        minionsPerMinute: participant.minionsPerMinute,

        // Performance Stats
        visionScore: participant.visionScore,
        visionPerMinute: participant.visionPerMinute,
        wardsPlaced: participant.wardsPlaced,
        goldEarned: participant.goldEarned,
        performanceScore: participant.performanceScore,
        performancePlacement: participant.performancePlacement,
        totalHealsOnTeammates: participant.totalHealsOnTeammates,
        totalDamageShieldedOnTeammates: participant.totalDamageShieldedOnTeammates,
        totalDamageTaken: participant.totalDamageTaken,
        totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
        individualPosition: participant.individualPosition,
        win: participant.win,

        // League assets - transformed to match interface
        summonerSpell1: {
            id: Number(participant.summonerSpell1.id),
            name: participant.summonerSpell1.name,
            description: participant.summonerSpell1.description,
            summonerLevel: participant.summonerSpell1.summonerLevel,
            cooldown: participant.summonerSpell1.cooldown,
            gameModes: Array.isArray(participant.summonerSpell1.gameModes) ? participant.summonerSpell1.gameModes as string[] : [],
            iconPath: participant.summonerSpell1.iconPath
        },
        summonerSpell2: {
            id: Number(participant.summonerSpell2.id),
            name: participant.summonerSpell2.name,
            description: participant.summonerSpell2.description,
            summonerLevel: participant.summonerSpell2.summonerLevel,
            cooldown: participant.summonerSpell2.cooldown,
            gameModes: Array.isArray(participant.summonerSpell2.gameModes) ? participant.summonerSpell2.gameModes as string[] : [],
            iconPath: participant.summonerSpell2.iconPath
        },
        champion: {
            ...participant.champion,
            image: participant.champion.image as unknown as Champion['image'],
            skins: participant.champion.skins as unknown as Champion['skins'],
            info: participant.champion.info as unknown as Champion['info'],
            stats: participant.champion.stats as unknown as Champion['stats'],
            spells: participant.champion.spells as unknown as Champion['spells'],
            passive: participant.champion.passive as unknown as Champion['passive']
        },
        arenaStats: transformArenaStats(participant.arenaStats) as ArenaStatsInterface,
        runes: transformRunes(participant.runes),
        statPerks: transformStatPerks(participant.statPerks),
        items: transformItems(participant.items)
    };
}

/**
 * Transform database match to interface format
 */
function transformMatch(match: MatchWithIncludes): MatchInterface {
    return {
        matchId: Number(match.matchId),
        gameDuration: match.gameDuration,
        gameCreation: Number(match.gameCreation),
        gameEndTimestamp: Number(match.gameEndTimestamp),
        gameMode: match.gameMode,
        gameType: match.gameType,
        queueId: match.queueId,
        participants: match.participants.map(transformParticipant),
        timelineData: match.timeline ? match.timeline.timelineData as unknown as ParticipantTimelineData[] : []
    };
}

/**
 * Retrieves a single match from the database by match ID.
 * Includes all participants with their related data (champion, summoner spells, items, runes, etc.).
 * 
 * @param matchId - The match ID to retrieve
 * @param includeTimeline - Whether to include timeline data (default: false)
 * @returns Promise that resolves to the transformed match object or null if not found
 * @throws {Error} When database operations fail
 * 
 * @example
 * ```typescript
 * const match = await getMatchData("NA1_1234567890");
 * if (match) {
 *   console.log(`Found match with ${match.participants.length} participants`);
 * }
 * ```
 */
export async function getMatchData(matchId: string, includeTimeline: boolean = false): Promise<MatchInterface | null> {
    if (!matchId) {
        throw new Error('Match ID is required');
    }

    try {
        const match = await prisma.match.findUnique({
            where: { matchId: matchId.toString() },
            include: {
                participants: {
                    include: {
                        champion: true,
                        summonerSpell1: true,
                        summonerSpell2: true,
                        riotAccount: {
                            include: {
                                riotAccountDetails: true,
                                leagueAccount: {
                                    include: {
                                        leagueAccountDetails: true,
                                        leagueSoloRank: true,
                                        leagueFlexRank: true
                                    }
                                }
                            }
                        },
                        items: {
                            include: {
                                item: true
                            },
                            orderBy: {
                                position: 'asc'
                            }
                        },
                        runes: {
                            include: {
                                rune: {
                                    include: {
                                        runeTree: true
                                    }
                                }
                            },
                            orderBy: {
                                slot: 'asc'
                            }
                        },
                        statPerks: {
                            include: {
                                statPerk: true
                            },
                            orderBy: {
                                position: 'asc'
                            }
                        },
                        arenaStats: {
                            include: {
                                augments: {
                                    include: {
                                        augment: true
                                    },
                                    orderBy: {
                                        position: 'asc'
                                    }
                                }
                            }
                        }
                    }
                },
                ...(includeTimeline && {
                    timeline: true
                })
            }
        });

        return match ? transformMatch(match) : null;
    } catch (error) {
        console.error(`❌ DB Error - getMatchData:`, error);
        throw error;
    }
}

/**
 * Retrieves multiple matches from the database.
 * 
 * @param matchIds - Array of match IDs to retrieve
 * @param includeTimeline - Whether to include timeline data (default: false)
 * @returns Promise that resolves to array of transformed match objects
 * @throws {Error} When database operations fail
 * 
 * @example
 * ```typescript
 * const matches = await getMultipleMatches(["NA1_1234567890", "NA1_0987654321"]);
 * console.log(`Retrieved ${matches.length} matches`);
 * ```
 */
export async function getMultipleMatches(matchIds: string[], includeTimeline: boolean = false): Promise<MatchInterface[]> {
    if (!matchIds || matchIds.length === 0) {
        console.log('🟡 No match IDs provided');
        return [];
    }

    try {
        const matches = await prisma.match.findMany({
            where: {
                matchId: {
                    in: matchIds.map(id => id.toString())
                }
            },
            include: {
                participants: {
                    include: {
                        champion: true,
                        summonerSpell1: true,
                        summonerSpell2: true,
                        riotAccount: {
                            include: {
                                riotAccountDetails: true,
                                leagueAccount: {
                                    include: {
                                        leagueAccountDetails: true,
                                        leagueSoloRank: true,
                                        leagueFlexRank: true
                                    }
                                }
                            }
                        },
                        items: {
                            include: {
                                item: true
                            },
                            orderBy: {
                                position: 'asc'
                            }
                        },
                        runes: {
                            include: {
                                rune: {
                                    include: {
                                        runeTree: true
                                    }
                                }
                            },
                            orderBy: {
                                slot: 'asc'
                            }
                        },
                        statPerks: {
                            include: {
                                statPerk: true
                            },
                            orderBy: {
                                position: 'asc'
                            }
                        },
                        arenaStats: {
                            include: {
                                augments: {
                                    include: {
                                        augment: true
                                    },
                                    orderBy: {
                                        position: 'asc'
                                    }
                                }
                            }
                        }
                    }
                },
                ...(includeTimeline && {
                    timeline: true
                })
            },
            orderBy: {
                gameCreation: 'desc'
            }
        });

        return matches.map(transformMatch);
    } catch (error) {
        console.error(`❌ DB Error - getMultipleMatches:`, error);
        throw error;
    }
}

/**
 * Checks if a match exists in the database.
 * 
 * @param matchId - The match ID to check
 * @returns Promise that resolves to boolean indicating if match exists
 * @throws {Error} When database operations fail
 * 
 * @example
 * ```typescript
 * const exists = await matchExists("NA1_1234567890");
 * if (exists) {
 *   console.log("Match already exists in database");
 * }
 * ```
 */
export async function matchExists(matchId: string): Promise<boolean> {
    if (!matchId) {
        throw new Error('Match ID is required');
    }

    try {
        const match = await prisma.match.findUnique({
            where: { matchId: matchId.toString() },
            select: { matchId: true }
        });

        return match !== null;
    } catch (error) {
        console.error(`❌ DB Error - matchExists:`, error);
        throw error;
    }
}

/**
 * Retrieves matches for a specific player (by PUUID) from the database.
 * 
 * @param puuid - Player's PUUID
 * @param limit - Maximum number of matches to retrieve (default: 20)
 * @param includeTimeline - Whether to include timeline data (default: false)
 * @returns Promise that resolves to array of transformed match objects
 * @throws {Error} When database operations fail
 * 
 * @example
 * ```typescript
 * const playerMatches = await getPlayerMatches("player-puuid-here", 10);
 * console.log(`Found ${playerMatches.length} matches for player`);
 * ```
 */
export async function getPlayerMatches(puuid: string, limit: number = 20, includeTimeline: boolean = false): Promise<MatchInterface[]> {
    if (!puuid) {
        throw new Error('Player PUUID is required');
    }

    try {
        const matches = await prisma.match.findMany({
            where: {
                participants: {
                    some: {
                        puuid: puuid
                    }
                }
            },
            include: {
                participants: {
                    include: {
                        champion: true,
                        summonerSpell1: true,
                        summonerSpell2: true,
                        riotAccount: {
                            include: {
                                riotAccountDetails: true,
                                leagueAccount: {
                                    include: {
                                        leagueAccountDetails: true,
                                        leagueSoloRank: true,
                                        leagueFlexRank: true
                                    }
                                }
                            }
                        },
                        items: {
                            include: {
                                item: true
                            },
                            orderBy: {
                                position: 'asc'
                            }
                        },
                        runes: {
                            include: {
                                rune: {
                                    include: {
                                        runeTree: true
                                    }
                                }
                            },
                            orderBy: {
                                slot: 'asc'
                            }
                        },
                        statPerks: {
                            include: {
                                statPerk: true
                            },
                            orderBy: {
                                position: 'asc'
                            }
                        },
                        arenaStats: {
                            include: {
                                augments: {
                                    include: {
                                        augment: true
                                    },
                                    orderBy: {
                                        position: 'asc'
                                    }
                                }
                            }
                        }
                    }
                },
                ...(includeTimeline && {
                    timeline: true
                })
            },
            orderBy: {
                gameCreation: 'desc'
            },
            take: limit
        });

        return matches.map(transformMatch);
    } catch (error) {
        console.error(`❌ DB Error - getPlayerMatches:`, error);
        throw error;
    }
}