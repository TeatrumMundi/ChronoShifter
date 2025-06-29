import { createPrismaClient } from "@/utils/helpers";

// Create singleton Prisma client
const prisma = createPrismaClient();

/**
 * Retrieves a single match from the database by match ID.
 * Includes all participants with their related data (champion, summoner spells, items, runes, etc.).
 * 
 * @param matchId - The match ID to retrieve
 * @param includeTimeline - Whether to include timeline data (default: false)
 * @returns Promise that resolves to the match object or null if not found
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
export async function getMatchData(matchId: string, includeTimeline: boolean = false) {
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

        if (match) {
            console.log(`✅ Retrieved match ${matchId} with ${match.participants.length} participants`);
        } else {
            console.log(`🟡 Match ${matchId} not found in database`);
        }

        return match;
    } catch (error) {
        console.error(`❌ Error retrieving match ${matchId}:`, error);
        throw error;
    }
}

/**
 * Retrieves multiple matches from the database.
 * 
 * @param matchIds - Array of match IDs to retrieve
 * @param includeTimeline - Whether to include timeline data (default: false)
 * @returns Promise that resolves to array of match objects
 * @throws {Error} When database operations fail
 * 
 * @example
 * ```typescript
 * const matches = await getMultipleMatches(["NA1_1234567890", "NA1_0987654321"]);
 * console.log(`Retrieved ${matches.length} matches`);
 * ```
 */
export async function getMultipleMatches(matchIds: string[], includeTimeline: boolean = false) {
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

        console.log(`✅ Retrieved ${matches.length} matches out of ${matchIds.length} requested`);

        // Log which matches were not found
        const foundMatchIds = matches.map(match => match.matchId);
        const notFoundMatchIds = matchIds.filter(id => !foundMatchIds.includes(id.toString()));
        if (notFoundMatchIds.length > 0) {
            console.log(`🟡 Matches not found: ${notFoundMatchIds.join(', ')}`);
        }

        return matches;
    } catch (error) {
        console.error(`❌ Error retrieving matches:`, error);
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
        console.error(`❌ Error checking if match ${matchId} exists:`, error);
        throw error;
    }
}

/**
 * Retrieves matches for a specific player (by PUUID) from the database.
 * 
 * @param puuid - Player's PUUID
 * @param limit - Maximum number of matches to retrieve (default: 20)
 * @param includeTimeline - Whether to include timeline data (default: false)
 * @returns Promise that resolves to array of match objects
 * @throws {Error} When database operations fail
 * 
 * @example
 * ```typescript
 * const playerMatches = await getPlayerMatches("player-puuid-here", 10);
 * console.log(`Found ${playerMatches.length} matches for player`);
 * ```
 */
export async function getPlayerMatches(puuid: string, limit: number = 20, includeTimeline: boolean = false) {
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

        console.log(`✅ Retrieved ${matches.length} matches for player ${puuid}`);
        return matches;
    } catch (error) {
        console.error(`❌ Error retrieving matches for player ${puuid}:`, error);
        throw error;
    }
}