import { PrismaClient } from "@prisma/client";
import championsData from "@/utils/getLeagueAssets/champions.json";
import itemsData from "@/utils/getLeagueAssets/items.json";
import runesData from "@/utils/getLeagueAssets/runes.json";
import summonerSpellsData from "@/utils/getLeagueAssets/summonerSpells.json";
import statPerksData from "@/utils/getLeagueAssets/statPerks.json";
import augmentsData from "@/utils/getLeagueAssets/augments.json";

// Singleton pattern for Prisma client to avoid connection pool issues during development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

interface RuneSlot {
    runes: RuneData[];
}

interface RuneData {
    id: number;
    key: string;
    name: string;
    icon: string;
    shortDesc: string;
    longDesc: string;
}

/**
 * Seeds the database with League of Legends game assets from local JSON files.
 * This should be run once to populate the reference tables.
 */
export async function seedGameAssets() {
    try {
        console.log("Starting to seed game assets...");

        // Seed Champions
        console.log("Seeding champions...");
        const champions = Object.values(championsData.data);
        for (const champion of champions) {
            await prisma.champion.upsert({
                where: { id: champion.id },
                update: {
                    key: champion.key,
                    name: champion.name,
                    title: champion.title,
                    image: champion.image,
                    skins: champion.skins || [],
                    lore: champion.lore || "",
                    blurb: champion.blurb || "",
                    allytips: champion.allytips || [],
                    enemytips: champion.enemytips || [],
                    tags: champion.tags || [],
                    partype: champion.partype || "",
                    info: champion.info || {},
                    stats: champion.stats || {},
                    spells: champion.spells || [],
                    passive: champion.passive || {},
                    recommended: champion.recommended || []
                },
                create: {
                    id: champion.id,
                    key: champion.key,
                    name: champion.name,
                    title: champion.title,
                    image: champion.image,
                    skins: champion.skins || [],
                    lore: champion.lore || "",
                    blurb: champion.blurb || "",
                    allytips: champion.allytips || [],
                    enemytips: champion.enemytips || [],
                    tags: champion.tags || [],
                    partype: champion.partype || "",
                    info: champion.info || {},
                    stats: champion.stats || {},
                    spells: champion.spells || [],
                    passive: champion.passive || {},
                    recommended: champion.recommended || []
                }
            });
        }
        console.log(`✔ Seeded ${champions.length} champions`);

        // Seed Summoner Spells
        console.log("Seeding summoner spells...");
        for (const spell of summonerSpellsData) {
            await prisma.summonerSpell.upsert({
                where: { id: spell.id },
                update: {
                    name: spell.name || "",
                    description: spell.description || "",
                    summonerLevel: spell.summonerLevel || 0,
                    cooldown: spell.cooldown || 0,
                    gameModes: spell.gameModes || [],
                    iconPath: spell.iconPath || ""
                },
                create: {
                    id: spell.id,
                    name: spell.name || "",
                    description: spell.description || "",
                    summonerLevel: spell.summonerLevel || 0,
                    cooldown: spell.cooldown || 0,
                    gameModes: spell.gameModes || [],
                    iconPath: spell.iconPath || ""
                }
            });
        }
        console.log(`✔ Seeded ${summonerSpellsData.length} summoner spells`);

        // Seed Items
        console.log("Seeding items...");
        const items = itemsData;
        for (const item of items) {
            await prisma.item.upsert({
                where: { id: item.id },
                update: {
                    name: item.name,
                    description: item.description,
                    active: item.active || false,
                    inStore: item.inStore || true,
                    from: item.from || null,
                    to: item.to || null,
                    categories: item.categories || [],
                    maxStacks: item.maxStacks || 0,
                    price: item.price || 0,
                    priceTotal: item.priceTotal || 0,
                    iconPath: item.iconPath || "",
                },
                create: {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    active: item.active || false,
                    inStore: item.inStore || true,
                    from: item.from || null,
                    to: item.to || null,
                    categories: item.categories || [],
                    maxStacks: item.maxStacks || 0,
                    price: item.price || 0,
                    priceTotal: item.priceTotal || 0,
                    iconPath: item.iconPath || "",
                }
            });
        }
        console.log(`✔ Seeded ${items.length} items`);

        // Seed Runes
        console.log("Seeding rune trees and runes...");
        for (const runeTree of runesData) {
            // First create the rune tree
            await prisma.runeTree.upsert({
                where: { id: runeTree.id },
                update: {
                    key: runeTree.key,
                    name: runeTree.name,
                    icon: runeTree.icon,
                    slots: runeTree.slots
                },
                create: {
                    id: runeTree.id,
                    key: runeTree.key,
                    name: runeTree.name,
                    icon: runeTree.icon,
                    slots: runeTree.slots
                }
            });

            // Then create individual runes from the slots
            runeTree.slots.forEach((slot: RuneSlot, slotIndex: number) => {
                slot.runes.forEach(async (rune: RuneData, tierIndex: number) => {
                    await prisma.rune.upsert({
                        where: { id: rune.id },
                        update: {
                            key: rune.key,
                            name: rune.name,
                            icon: rune.icon,
                            shortDesc: rune.shortDesc || "",
                            longDesc: rune.longDesc || "",
                            runeTreeId: runeTree.id,
                            slot: slotIndex,
                            tier: tierIndex
                        },
                        create: {
                            id: rune.id,
                            key: rune.key,
                            name: rune.name,
                            icon: rune.icon,
                            shortDesc: rune.shortDesc || "",
                            longDesc: rune.longDesc || "",
                            runeTreeId: runeTree.id,
                            slot: slotIndex,
                            tier: tierIndex
                        }
                    });
                });
            });
        }
        console.log(`✔ Seeded ${runesData.length} rune trees with individual runes`);

        // Seed Stat Perks
        console.log("Seeding stat perks...");
        const allStatPerks = [
            ...statPerksData.offense,
            ...statPerksData.flex,
            ...statPerksData.defense
        ];
        for (const statPerk of allStatPerks) {
            await prisma.statPerk.upsert({
                where: { id: statPerk.id },
                update: {
                    name: statPerk.name,
                    desc: statPerk.desc,
                    longDesc: statPerk.longDesc,
                    path: statPerk.path
                },
                create: {
                    id: statPerk.id,
                    name: statPerk.name,
                    desc: statPerk.desc,
                    longDesc: statPerk.longDesc,
                    path: statPerk.path
                }
            });
        }
        console.log(`✔ Seeded ${allStatPerks.length} stat perks`);

        // Seed Augments
        console.log("Seeding augments...");
        for (const augment of augmentsData.augments) {
            await prisma.augment.upsert({
            where: { id: augment.id },
            update: {
                apiName: augment.apiName,
                calculations: augment.calculations,
                dataValues: augment.dataValues,
                desc: augment.desc,
                iconLarge: augment.iconLarge,
                iconSmall: augment.iconSmall,
                name: augment.name,
                rarity: augment.rarity,
                tooltip: augment.tooltip
            },
            create: {
                id: augment.id,
                apiName: augment.apiName,
                calculations: augment.calculations,
                dataValues: augment.dataValues,
                desc: augment.desc,
                iconLarge: augment.iconLarge,
                iconSmall: augment.iconSmall,
                name: augment.name,
                rarity: augment.rarity,
                tooltip: augment.tooltip
            }
            });
        }
        console.log(`✔ Seeded ${augmentsData.augments.length} augments`);

        console.log("✨ Successfully seeded all game assets!");
    } catch (error) {
        console.error("Error seeding game assets:", error);
        throw error;
    } finally { await prisma.$disconnect(); }
}

// Run this script directly if called
if (require.main === module) {
    seedGameAssets()
        .then(() => {
            console.log("Seeding completed successfully!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Seeding failed:", error);
            process.exit(1);
        });
}