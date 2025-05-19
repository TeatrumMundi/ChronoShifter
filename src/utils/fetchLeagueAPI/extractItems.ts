import { Item } from "@/interfaces/productionTypes";
import { RawParticipant } from "@/interfaces/rawTypes";
import { getItemById } from "../getLeagueAssets/getLOLObject";

/**
 * Extracts all item objects for a participant by fetching from local items.json.
 */
export async function extractItems(participant: RawParticipant): Promise<Item[]> {
    const itemIds: number[] = [
        participant.item0,
        participant.item1,
        participant.item2,
        participant.item3,
        participant.item4,
        participant.item5,
    ];

    const itemPromises = itemIds
        .filter(id => id && id > 0)
        .map(async (id) => {
            const item = await getItemById(id);
            if (!item) {
                throw new Error(`Item with ID ${id} not found in items.json`);
            }
            return item;
        });

    return await Promise.all(itemPromises);
}