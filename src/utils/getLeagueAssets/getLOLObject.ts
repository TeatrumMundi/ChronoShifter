import { Augment, Item, Rune, SummonerSpell } from "@/interfaces/productionTypes";
import augmentsData from "./augments.json";
import championsData from "./champions.json";
import itemsData from "./items.json";
import runesData from "./runes.json";
import summonerSpellsData from "./summonerSpells.json";
import { Champion } from "@/interfaces/ChampionType";

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
 * Loads and returns a Champion object from local champions.json by its key (ID).
 * @param id - The champion key (ID) to search for
 * @returns Promise resolving to the Champion object if found, undefined otherwise
 */
export async function getChampionById(id: number): Promise<Champion | undefined> {
    try {
        const championKey = (championsData.keys as Record<string, string>)[id.toString()];
        if (!championKey) {
            return undefined;
        }
        
        const championData = (championsData.data as Record<string, Champion>)[championKey];
        return championData;
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
 * @param runeId - The rune ID to search for
 * @returns Promise resolving to the Rune object if found, null otherwise
 */
export async function getRuneById(runeId: number): Promise<Rune | null> {
    try {
        for (const runeTree of runesData) {
            for (const slot of runeTree.slots) {
                const foundRune = slot.runes.find(rune => rune.id === runeId);
                if (foundRune) {
                    return {
                        id: foundRune.id,
                        key: foundRune.key,
                        icon: foundRune.icon,
                        name: foundRune.name,
                        shortDesc: foundRune.shortDesc,
                        longDesc: foundRune.longDesc,
                        runeTree: {
                            id: runeTree.id,
                            key: runeTree.key,
                            icon: runeTree.icon,
                            name: runeTree.name
                        }
                    };
                }
            }
        }
        
        return null;
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