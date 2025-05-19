import path from "path";
﻿import {promises as fs} from "fs";
import { Augment, Champion, Item, Rune } from "@/interfaces/productionTypes";

const getAssetPath = (file: string) =>
    path.join(process.cwd(), "src", "utils", "getLeagueOfLegendsAssets", "dataJSON", file);

/**
 * Load an augment from local augments.json by its ID.
 * Returns the full Augment object if found.
 */
export async function getAugmentById(id: number): Promise<Augment | undefined> {
    try {
        const filePath = getAssetPath("augments.json");

        const raw = await fs.readFile(filePath, { encoding: "utf-8" });
        const parsed = JSON.parse(raw.replace(/^\uFEFF/, "")); // Remove BOM if present

        return parsed.augments.find((augment: Augment) => augment.id === id);
    } catch (error) {
        console.error(`Failed to load augment ID ${id}:`, error);
        return undefined;
    }
}

/**
 * Loads and returns a Champion object from local champions.json by its ID.
 */
export async function getChampionById(id: number): Promise<Champion | undefined> {
    try {
        const filePath : string = getAssetPath("champions.json")

        const raw = await fs.readFile(filePath, { encoding: "utf-8" });
        const champions: Champion[] = JSON.parse(raw.replace(/^\uFEFF/, ""));

        return champions.find((champion) => champion.id === id);
    } catch (error) {
        console.error(`Failed to load champion ID ${id}:`, error);
        return undefined;
    }
}

/**
 * Loads and returns an Item object from local items.json by its ID.
 */
export async function getItemById(itemId: number): Promise<Item | undefined> {
    try {
        const filePath = getAssetPath("items.json")

        const raw = await fs.readFile(filePath, { encoding: "utf-8" });
        const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));

        return parsed.find((item: Item) => item.id === itemId);
    } catch (error) {
        console.error(`Failed to load item ID ${itemId}:`, error);
        return undefined;
    }
}

/**
 * Loads and returns a Rune object from local runes.json by its ID.
 */
export async function getRuneById(id: number): Promise<Rune | null> {
    const filePath = getAssetPath("runes.json");

    try {
        const raw = await fs.readFile(filePath, { encoding: "utf-8" });
        const data: Rune[] = JSON.parse(raw.replace(/^\uFEFF/, ""));

        const match = data.find((r) => r.id === id);
        if (!match) return null;        

        const runeTreeMatch = match.iconPath.match(/Styles\/([^/]+)\//);
        const runeTree = runeTreeMatch ? runeTreeMatch[1] : "Unknown";

        return {
            ...match,
            runeTree
        };
    } catch (err) {
        console.error("Failed to load rune:", err);
        return null;
    }
}