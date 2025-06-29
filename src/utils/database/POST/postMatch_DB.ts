import { Match } from "@/interfaces/productionTypes";
import { createPrismaClient } from "../../helpers";

// Create singleton Prisma client
const prisma = createPrismaClient();

/**
 * Saves match data including match details and all participants to the database.
 * Participants are automatically linked to RiotAccounts via their PUUID.
 * Items, runes, stat perks, and arena stats are stored as proper relational objects.
 * 
 * @param match - Complete match object with participants and timeline data
 * @returns Promise that resolves to an object with `existing` boolean and `match` record
 * @throws {Error} When required parameters are missing or database operations fail
 * 
 */
export async function saveMatchData(match: Match) {
    // Validate required input parameters
    if (!match || !match.matchId) { throw new Error('Match with valid matchId required'); }
    if (!match.participants || match.participants.length === 0) { throw new Error('Match must contain participants'); }

    try {
        // Step 1: Check if match already exists
        const existingMatch = await prisma.match.findUnique({
            where: { matchId: match.matchId.toString() },
            include: { participants: true }
        });

        if (existingMatch) {
            return { existing: true, match: existingMatch };
        }

        return await prisma.$transaction(async (transaction) => {

            // Step 2: Create new Match record
            const matchDetails = await transaction.match.create({
                data: {
                    matchId: match.matchId.toString(),
                    gameDuration: match.gameDuration,
                    gameCreation: BigInt(match.gameCreation),
                    gameEndTimestamp: BigInt(match.gameEndTimestamp),
                    gameMode: match.gameMode,
                    gameType: match.gameType,
                    queueId: match.queueId
                }
            });

            return { existing: false, match: matchDetails };
        }, {
            timeout: 15000,
            maxWait: 5000,
            isolationLevel: 'ReadCommitted'
        });
    } catch (error) {
        console.error(`❌ DB Error - saveMatchData:`, error);
        throw error;
    }
}

/**
 * Saves multiple matches to the database.
 * Processes matches sequentially to avoid database conflicts.
 * 
 * @param matches - Array of Match objects to save
 * @returns Promise that resolves to array of saved Match records
 * @throws {Error} When required parameters are missing or database operations fail
 * 
 */
export async function saveMatchHistory(matches: Match[]) {
    if (!matches || matches.length === 0) {
        return [];
    }

    const savedMatches = [];
    let savedCount = 0;
    let existingCount = 0;
    let failedCount = 0;
    
    // Process matches sequentially to avoid database conflicts
    for (const match of matches) {
        try {
            const result = await saveMatchData(match);
            
            if (result.existing) {
                existingCount++;
            } else {
                savedCount++;
            }
            
            savedMatches.push(result.match);
            
        } catch (error) {
            failedCount++;
            console.error(`❌ DB Error - saveMatch ${match.matchId}:`, error);
        }
    }

    // Concise summary
    const total = matches.length;
    if (savedCount > 0 || failedCount > 0) {
        console.log(`💾 DB Save: ${savedCount} new, ${existingCount} existing, ${failedCount} failed (${total} total)`);
    }
    
    return savedMatches;
}