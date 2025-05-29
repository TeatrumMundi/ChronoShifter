import { Champion } from "@/interfaces/ChampionType";
import { Augment, Perk, Rune, SummonerSpell } from "@/interfaces/productionTypes";

const GAME_VERSION = process.env.NEXT_PUBLIC_GAME_VERSION || "15.6.1";
const CDN_BASE = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1";
const DATA_DRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/img`;

// Item Icon
export function getItemIcon(itemId: number): string {
    return `${DATA_DRAGON_BASE}/item/${itemId}.png`;
}

export function getChampionIconUrl(champion: Champion): string {
    return `${DATA_DRAGON_BASE}/champion/${champion.image.full}`;
}

/**
 * Returns the full URL to the rune's own icon.
 */
export function getRuneIconUrl(rune: Rune): string {
    return `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`;
}

/**
 * Returns the full URL to the rune tree icon (Domination, Precision, etc.)
 */
export function getRuneTreeIconUrl(rune: Rune): string {
    return `https://ddragon.leagueoflegends.com/cdn/img/${rune.runeTree.icon}`;
}

/**
 * Returns the full URL to the champion spell icon from Community Dragon.
 * @param champion The champion object containing spell data.
 * @param spellId The index of the spell (0-3).
 * @returns A fully qualified image URL for the spell icon.
 */
export function getChampionSpellIconByChampionAndID(champion: Champion, spellId: number): string {
    return `${DATA_DRAGON_BASE}/spell/${champion.spells[spellId].image.full}`;
}

/**
 * Returns the full URL to the augment icon from Community Dragon.
 * Falls back to public/augments if the CDN icon is not available or known to fail.
 * @param augment The augment object.
 * @param size Optional icon size: 'small' (default) or 'large'.
 * @returns A fully qualified image URL.
 */
export function getAugmentIconUrl(augment: Augment, size: "small" | "large" = "small"): string {
    const iconFile = augment.apiName.toLowerCase() + `_${size}.png`;

    const cdnUrl = `https://raw.communitydragon.org/latest/game/assets/ux/cherry/augments/icons/${iconFile}`;
    const localUrl = `/augments/${iconFile}`; // File stored in public/augments/

    // List of known broken CDN files – use local directly
    const alwaysLocal = new Set([
        "prismaticegg_small.png",
        "divineintervention_small.png",
        "ultimateroulette_small.png",
        "dreadbringer_small.png"
    ]);

    // If the icon is known to fail on CDN, skip and return local only
    if (alwaysLocal.has(iconFile)) {
        return localUrl;
    }

    // Default behavior: return cdn#local fallback
    return `${cdnUrl}#${localUrl}`;
}

export function getSummonerSpellIcon(summonerSpell : SummonerSpell): string {
    const path = summonerSpell.iconPath.toLowerCase();
    const fileName = path.substring(path.lastIndexOf("/") + 1);

    return "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/" + fileName;
}

/**
 * Returns the full URL to the summoner icon from Community Dragon.
 * Falls back to a default icon if the specific icon is not available.
 * @param profileIconId The profile icon ID from summoner data.
 * @returns A fully qualified image URL with fallback support.
 */
export function getSummonerIconUrl(profileIconId: number): string {
    // Validate input
    if (!profileIconId || profileIconId <= 0) {
        return "/summonerIcons/default.jpg";
    }

    const cdnUrl = `${CDN_BASE}/profile-icons/${profileIconId}.jpg`;
    const localFallback = `/summonerIcons/${profileIconId}.jpg`;
    const defaultIcon = "/summonerIcons/default.jpg";

    // Known problematic icon IDs that should use local/default directly
    const problematicIcons = new Set([
        0, -1 // Add any known broken icon IDs here
    ]);

    if (problematicIcons.has(profileIconId)) {
        return defaultIcon;
    }

    // Return CDN URL with multiple fallbacks
    return `${cdnUrl}#${localFallback}#${defaultIcon}`;
}

/**
 * Returns the full URL to the stat perk icon (stat shards like +9 Adaptive Force, +6 Armor, etc.)
 * Maps stat perk IDs to their corresponding icon names from Data Dragon
 */
export function getPerkIconUrl(perk: Perk): string {
    return `https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/${perk.path}`;
}