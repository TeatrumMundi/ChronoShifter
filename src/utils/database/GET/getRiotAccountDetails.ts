import { RiotAccountDetails } from "@/interfaces/productionTypes";
import { createPrismaClient } from "@/utils/helpers";

// Create singleton Prisma client
const prisma = createPrismaClient();

/**
 * Retrieves RiotAccountDetails from DB by gameName and tagLine.
 * Returns the RiotAccountDetails if found, null if not found.
 */
export async function getRiotAccountDetailsByNameAndTag(
    riotGameName: string, 
    riotTagLine: string, 
    region: string
): Promise<RiotAccountDetails | null> {
    if (!riotGameName || !riotTagLine) {
        throw new Error('Both riotGameName and riotTagLine are required');
    }

    console.log(`🔎 Retrieving RiotAccountDetails for ${riotGameName}#${riotTagLine} in region: ${region}`);

    try {
        const riotAccountDetails = await prisma.riotAccountDetails.findFirst({
            where: {
                gameName: {
                    equals: riotGameName,
                    mode: 'insensitive'
                },
                tagLine: {
                    equals: riotTagLine,
                    mode: 'insensitive'
                }
            },
            include: {
                riotAccount: {
                    include: {
                        leagueAccount: {
                            include: {
                                leagueAccountDetails: true
                            }
                        }
                    }
                }
            }
        });

        // If region is specified, filter by the leagueAccountDetails region
        if (region && riotAccountDetails?.riotAccount?.leagueAccount?.leagueAccountDetails) {
            const leagueAccountRegion = riotAccountDetails.riotAccount.leagueAccount.leagueAccountDetails.region;
            if (leagueAccountRegion.toLowerCase() !== region.toLowerCase()) {
                return null;
            }
        }

        console.log(`✅ Found RiotAccountDetails in database for ${riotGameName}#${riotTagLine} in region: ${region}\n`);
        return riotAccountDetails;
    } catch (error) {
        console.error('Error retrieving RiotAccountDetails:', error);
        throw new Error('Failed to retrieve RiotAccountDetails from database');
    }
}