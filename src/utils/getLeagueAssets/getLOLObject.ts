import { Augment, Item, Perk, Rune, SummonerSpell } from "@/interfaces/productionTypes";
import augmentsData from "./augments.json";
import championsData from "./champions.json";
import itemsData from "./items.json";
import runesData from "./runes.json";
import summonerSpellsData from "./summonerSpells.json";
import { Champion } from "@/interfaces/ChampionType";
import statPerksData from "./statPerks.json";

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
 * @returns Promise resolving to the Champion object, or default champion if not found
 */
export async function getChampionById(id: number): Promise<Champion> {
    try {
        const championKey = (championsData.keys as Record<string, string>)[id.toString()];
        if (!championKey) {
            console.warn(`Champion key not found for ID ${id}, returning default champion`);
            return getDefaultChampion();
        }
        
        const championData = (championsData.data as Record<string, Champion>)[championKey];
        if (!championData) {
            console.warn(`Champion data not found for key ${championKey}, returning default champion`);
            return getDefaultChampion();
        }
        
        return championData;
    } catch (error) {
        console.error(`Failed to load champion ID ${id}:`, error);
        return getDefaultChampion();
    }
}

/**
 * Returns a default champion object for cases where champion data is not found.
 * @returns Default Champion object
 */
function getDefaultChampion(): Champion {
    return {
        id: "0",
        key: "Unknown",
        name: "Unknown Champion",
        title: "Unknown",
        image: {
            full: "unknown.png",
            sprite: "unknown.png",
            group: "champion",
            x: 0,
            y: 0,
            w: 48,
            h: 48
        },
        skins: [],
        lore: "Champion data not available",
        blurb: "Champion data not available",
        allytips: [],
        enemytips: [],
        tags: ["Unknown"],
        partype: "None",
        info: {
            attack: 0,
            defense: 0,
            magic: 0,
            difficulty: 0
        },
        stats: {
            hp: 0,
            hpperlevel: 0,
            mp: 0,
            mpperlevel: 0,
            movespeed: 0,
            armor: 0,
            armorperlevel: 0,
            spellblock: 0,
            spellblockperlevel: 0,
            attackrange: 0,
            hpregen: 0,
            hpregenperlevel: 0,
            mpregen: 0,
            mpregenperlevel: 0,
            crit: 0,
            critperlevel: 0,
            attackdamage: 0,
            attackdamageperlevel: 0,
            attackspeedperlevel: 0,
            attackspeed: 0
        },
        spells: [
            {
                id: "UnknownQ",
                name: "Unknown Q",
                description: "Spell data not available",
                tooltip: "Spell data not available",
                leveltip: { label: [], effect: [] },
                maxrank: 5,
                cooldown: [0],
                cooldownBurn: "0",
                cost: [0],
                costBurn: "0",
                datavalues: {},
                effect: [],
                effectBurn: [],
                vars: [],
                costType: "None",
                maxammo: "0",
                range: [0],
                rangeBurn: "0",
                image: {
                    full: "unknown.png",
                    sprite: "unknown.png",
                    group: "spell",
                    x: 0,
                    y: 0,
                    w: 48,
                    h: 48
                },
                resource: "None"
            },
            {
                id: "UnknownW",
                name: "Unknown W",
                description: "Spell data not available",
                tooltip: "Spell data not available",
                leveltip: { label: [], effect: [] },
                maxrank: 5,
                cooldown: [0],
                cooldownBurn: "0",
                cost: [0],
                costBurn: "0",
                datavalues: {},
                effect: [],
                effectBurn: [],
                vars: [],
                costType: "None",
                maxammo: "0",
                range: [0],
                rangeBurn: "0",
                image: {
                    full: "unknown.png",
                    sprite: "unknown.png",
                    group: "spell",
                    x: 0,
                    y: 0,
                    w: 48,
                    h: 48
                },
                resource: "None"
            },
            {
                id: "UnknownE",
                name: "Unknown E",
                description: "Spell data not available",
                tooltip: "Spell data not available",
                leveltip: { label: [], effect: [] },
                maxrank: 5,
                cooldown: [0],
                cooldownBurn: "0",
                cost: [0],
                costBurn: "0",
                datavalues: {},
                effect: [],
                effectBurn: [],
                vars: [],
                costType: "None",
                maxammo: "0",
                range: [0],
                rangeBurn: "0",
                image: {
                    full: "unknown.png",
                    sprite: "unknown.png",
                    group: "spell",
                    x: 0,
                    y: 0,
                    w: 48,
                    h: 48
                },
                resource: "None"
            },
            {
                id: "UnknownR",
                name: "Unknown R",
                description: "Spell data not available",
                tooltip: "Spell data not available",
                leveltip: { label: [], effect: [] },
                maxrank: 3,
                cooldown: [0],
                cooldownBurn: "0",
                cost: [0],
                costBurn: "0",
                datavalues: {},
                effect: [],
                effectBurn: [],
                vars: [],
                costType: "None",
                maxammo: "0",
                range: [0],
                rangeBurn: "0",
                image: {
                    full: "unknown.png",
                    sprite: "unknown.png",
                    group: "spell",
                    x: 0,
                    y: 0,
                    w: 48,
                    h: 48
                },
                resource: "None"
            }
        ],
        passive: {
            name: "Unknown Passive",
            description: "Passive data not available",
            image: {
                full: "unknown.png",
                sprite: "unknown.png",
                group: "passive",
                x: 0,
                y: 0,
                w: 48,
                h: 48
            }
        },
        recommended: []
    };
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

/**
 * Loads and returns a Perk object from local statPerks.json by its ID.
 * Returns a default perk object if the specified ID is not found.
 * @param perkId - The stat perk ID to search for
 * @returns Promise resolving to the Perk object, or default perk if not found
 */
export async function getStatPerkById(perkId: number): Promise<Perk> {
    try {
        const allStatPerks = [
            ...statPerksData.offense,
            ...statPerksData.flex,
            ...statPerksData.defense,
        ];
        
        const foundPerk = allStatPerks.find(perk => perk.id === perkId);
        
        if (foundPerk) {
            return {
                id: foundPerk.id,
                name: foundPerk.name,
                desc: foundPerk.desc,
                longDesc: foundPerk.longDesc,
                path: foundPerk.path
            };
        }

        return getDefaultPerk(perkId);
    } catch (error) {
        console.error(`Failed to load stat perk ID ${perkId}:`, error);
        return getDefaultPerk(perkId);
    }
}

/**
 * Returns a default perk object for cases where perk data is not found.
 * @param perkId - The original perk ID
 * @returns Default Perk object
 */
function getDefaultPerk(perkId: number): Perk {
    return {
        id: perkId,
        name: "Unknown Stat",
        desc: "Unknown Stat Perk",
        longDesc: "Stat perk data not available",
        path: "statmodsadaptiveforceicon.png"
    };
}