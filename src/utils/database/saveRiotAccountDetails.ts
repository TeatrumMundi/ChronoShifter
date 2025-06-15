import { PrismaClient } from "@prisma/client";
import { RiotAccountDetails } from "@/interfaces/productionTypes";

const prisma = new PrismaClient();

/**
 * Saves RiotAccountDetails to DB if not present and creates corresponding RiotAccount.
 * Returns the complete RiotAccount with relations.
 */
export async function saveRiotAccountDetails(riotAccountDetails: RiotAccountDetails) {
    if (!riotAccountDetails || !riotAccountDetails.puuid) {
        throw new Error('RiotAccountDetails with valid puuid required');
    }

    // First check if RiotAccountDetails already exists
    const existingRiotAccountDetails = await prisma.riotAccountDetails.findUnique({
        where: {
            puuid: riotAccountDetails.puuid
        },
        include: {
            riotAccount: true
        }
    });

    if (existingRiotAccountDetails) {
        // If RiotAccountDetails exists but no RiotAccount, create the RiotAccount
        if (!existingRiotAccountDetails.riotAccount) {
            await prisma.riotAccount.create({
                data: {
                    riotAccountDetailsId: existingRiotAccountDetails.id
                }
            });
        }
        return existingRiotAccountDetails;
    }

    // If nothing exists, create both in a transaction
    const riotAccount = await prisma.riotAccount.create({
        data: {
            riotAccountDetails: {
                create: {
                    puuid: riotAccountDetails.puuid,
                    gameName: riotAccountDetails.gameName,
                    tagLine: riotAccountDetails.tagLine
                }
            }
        },
        include: {
            riotAccountDetails: true
        }
    });

    return riotAccount.riotAccountDetails;
}