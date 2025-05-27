import { Augment, Champion, Item, Rune, SummonerSpell } from "@/interfaces/productionTypes";
import augmentsData from "./augments.json";
import championsData from "./champions.json";
import itemsData from "./items.json";
import runesData from "./runes.json";
import summonerSpellsData from "./summonerSpells.json";

/**
 * Load an augment from local augments.json by its ID.
 * @param id - The augment ID to search for
 * @returns Promise resolving to the Augment object if found, undefined otherwise
 */
export async function getAugmentById(id: number): Promise<Augment | undefined> {
    try {
        return augmentsData.augments.find((augment: Augment) => augment.id === id);
    } catch (error) {
        console.error(`Failed to load augment ID ${id}:`, error);
        return undefined;
    }
}

/**
 * Loads and returns a Champion object from local champions.json by its ID.
 * @param id - The champion ID to search for
 * @returns Promise resolving to the Champion object if found, undefined otherwise
 */
export async function getChampionById(id: number): Promise<Champion | undefined> {
    try {
        return championsData.find((champion: Champion) => champion.id === id);
    } catch (error) {
        console.error(`Failed to load champion ID ${id}:`, error);
        return undefined;
    }
}

/**
 * Loads and returns an Item object from local items.json by its ID.
 * @param itemId - The item ID to search for
 * @returns Promise resolving to the Item object if found, undefined otherwise
 */
export async function getItemById(itemId: number): Promise<Item | undefined> {
    try {
        return itemsData.find((item: Item) => item.id === itemId);
    } catch (error) {
        console.error(`Failed to load item ID ${itemId}:`, error);
        return undefined;
    }
}

/**
 * Loads and returns a Rune object from local runes.json by its ID.
 * Includes additional processing to extract and add the rune tree information.
 * @param runeId - The rune ID to search for
 * @returns Promise resolving to the enhanced Rune object if found, null otherwise
 */
export async function getRuneById(runeId: number): Promise<Rune | null> {
    try {
        const match = runesData.find((r: Rune) => r.id === runeId);
        if (!match) return null;        

        const runeTreeMatch = match.iconPath.match(/Styles\/([^/]+)\//);
        const runeTree = runeTreeMatch ? runeTreeMatch[1] : "Unknown";

        return {
            ...match,
            runeTree
        };
    } catch (error) {
        console.error("Failed to load rune:", error);
        return null;
    }
}

/**
 * Loads and returns a SummonerSpell object from local summonerSpells.json by its ID.
 * Returns a default empty spell object if the specified ID is not found.
 * @param summonerSpellId - The summoner spell ID to search for
 * @returns Promise resolving to the SummonerSpell object, or default empty object if not found
 */
export async function getSummonerSpellByID(summonerSpellId: number): Promise<SummonerSpell> {
    try {
        const found = summonerSpellsData.find((spell: SummonerSpell) => spell.id === summonerSpellId);
        if (found) return found;

        return {
            id: 0,
            name: "",
            description: "",
            summonerLevel: 0,
            cooldown: 0,
            gameModes: [],
            iconPath: ""
        };
    } catch (error) {
        console.error(`Failed to load summoner spell ID ${summonerSpellId}:`, error);
        return {
            id: 0,
            name: "",
            description: "",
            summonerLevel: 0,
            cooldown: 0,
            gameModes: [],
            iconPath: ""
        };
    }
}