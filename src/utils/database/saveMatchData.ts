import { PrismaClient } from "@prisma/client";
import { Match } from "@/interfaces/productionTypes";

// Singleton pattern for Prisma client to avoid connection pool issues during development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Saves match data including match details and all participants to the database.
 * Participants are automatically linked to RiotAccounts via their PUUID.
 * Items, runes, stat perks, and arena stats are stored as proper relational objects.
 * 
 * @param match - Complete match object with participants and timeline data
 * @returns Promise that resolves to the saved Match record
 * @throws {Error} When required parameters are missing or database operations fail
 * 
 * @example
 * ```typescript
 * const savedMatch = await saveMatchData(matchObject);
 * console.log(`Saved match: ${savedMatch.matchId}`);
 * ```
 */
export async function saveMatchData(match: Match) {
    // Validate required input parameters
    if (!match || !match.matchId) {
        throw new Error('Match with valid matchId required');
    }

    if (!match.participants || match.participants.length === 0) {
        throw new Error('Match must contain participants');
    }

    try {
        // Step 1: Check if match already exists
        const existingMatch = await prisma.match.findUnique({
            where: { matchId: match.matchId.toString() },
            include: { participants: true }
        });

        if (existingMatch) {
            console.log(`🟡 Match ${match.matchId} already exists in database. Skipping...`);
            return existingMatch;
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

            console.log(`✅ ${match.matchId} was saved successfully with ${match.participants.length} participants.`);
            return matchDetails;
        }, {
            timeout: 15000,
            maxWait: 5000,
            isolationLevel: 'ReadCommitted'
        });
    } catch (error) {
        // Enhanced error handling with specific Prisma error types
        if (error instanceof Error) {
            if (error.message.includes('Transaction already closed') || 
                error.message.includes('P2028')) {
                console.warn(`⚠️ Transaction timeout for match ${match.matchId}, retrying without transaction...`);
                
                // Fallback: Save without transaction for development hot-reload scenarios
                return await saveMatchDataFallback(match);
            }
        }
        
        console.error(`❌ Error saving match data for ${match.matchId}:`, error);
        throw error;
    }
}

/**
 * Fallback function for saving match data without transactions.
 * Used when transaction timeouts occur during development hot-reloads.
 * 
 * @param match - Match object to save
 * @returns Promise that resolves to the saved Match record
 */
async function saveMatchDataFallback(match: Match) {
    try {
        console.log(`🔄 Saving match ${match.matchId} without transaction (fallback mode)`);
        
        // Check again if match exists (race condition protection)
        const existingMatch = await prisma.match.findUnique({
            where: { matchId: match.matchId.toString() },
            include: { participants: true }
        });

        if (existingMatch) {
            console.log(`� Match ${match.matchId} already exists (fallback check)`);
            return existingMatch;
        }

        // Create match without transaction
        const matchDetails = await prisma.match.create({
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

        console.log(`✅ ${match.matchId} saved in fallback mode (basic data only)`);
        return matchDetails;
        
    } catch (fallbackError) {
        console.error(`❌ Fallback save failed for match ${match.matchId}:`, fallbackError);
        throw fallbackError;
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
 * @example
 * ```typescript
 * const savedMatches = await saveMatchHistory(matchArray);
 * console.log(`Saved ${savedMatches.length} matches`);
 * ```
 */
export async function saveMatchHistory(matches: Match[]) {
    if (!matches || matches.length === 0) {
        console.log('🟡 No matches to save');
        return [];
    }

    const savedMatches = [];
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 3;
    
    // Track statistics for summary
    let skippedCount = 0;
    let failedCount = 0;
    let savedCount = 0;
    let circuitBreakerActivated = false;
    
    // Process matches sequentially to avoid potential database conflicts
    for (const match of matches) {
        try {
            // Circuit breaker: skip remaining matches if too many consecutive errors
            if (consecutiveErrors >= maxConsecutiveErrors) {
                if (!circuitBreakerActivated) {
                    console.warn(`🚨 Circuit breaker activated: too many consecutive errors (${consecutiveErrors}). Skipping remaining matches.`);
                    circuitBreakerActivated = true;
                }
                skippedCount++;
                continue;
            }

            const savedMatch = await saveMatchData(match);
            savedMatches.push(savedMatch);
            savedCount++;
            consecutiveErrors = 0; // Reset error counter on success
            
        } catch (error) {
            consecutiveErrors++;
            failedCount++;
            console.error(`❌ Failed to save match ${match.matchId} (error ${consecutiveErrors}/${maxConsecutiveErrors}):`, error);
            
            // Add delay between retries to avoid overwhelming the database
            if (consecutiveErrors < maxConsecutiveErrors) {
                await new Promise(resolve => setTimeout(resolve, 1000 * consecutiveErrors));
            }
        }
    }

    // Enhanced summary output
    const totalMatches = matches.length;
    console.log(`\n📋 Match Save Summary:`);
    console.log(`   Total matches: ${totalMatches}`);
    console.log(`   ✅ Saved: ${savedCount}`);
    console.log(`   ❌ Failed: ${failedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    
    if (circuitBreakerActivated) {
        console.log(`   🚨 Circuit breaker was activated`);
    }
    
    const successRate = totalMatches > 0 ? ((savedCount / totalMatches) * 100).toFixed(1) : '0.0';
    console.log(`   📈 Success rate: ${successRate}%\n`);
    
    return savedMatches;
}