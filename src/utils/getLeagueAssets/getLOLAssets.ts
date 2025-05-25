import { Augment, Champion, Rune, SummonerSpell } from "@/interfaces/productionTypes";

const GAME_VERSION = process.env.NEXT_PUBLIC_GAME_VERSION || "15.6.1";
const CDN_BASE = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1";

const runeTreeToImageMap: Record<string, string> = {
    Domination: "7200_domination.png",
    Precision: "7201_precision.png",
    Sorcery: "7202_sorcery.png",
    Inspiration: "7203_whimsy.png",
    Resolve: "7204_resolve.png"
};

// Item Icon
export function getItemIcon(itemId: number): string {
    return `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/img/item/${itemId}.png`;
}

export function getChampionIconUrl(champion: Champion): string {
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champion.id}.png`;
}

/**
 * Returns the full URL to the rune's own icon.
 */
export function getRuneIconUrl(rune: Rune): string {
    const normalizedPath = rune.iconPath
        .replace("/lol-game-data/assets/v1", "")
        .toLowerCase();

    return `${CDN_BASE}${normalizedPath}`;
}

/**
 * Returns the full URL to the rune tree icon (Domination, Precision, etc.)
 */
export function getRuneTreeIconUrl(rune: Rune): string | null {
    const treeMatch = rune.iconPath.match(/Styles\/([^/]+)\//i);
    const runeTree = treeMatch?.[1];

    if (!runeTree) return null;

    const filename = runeTreeToImageMap[runeTree];
    if (!filename) return null;

    return `${CDN_BASE}/perk-images/styles/${filename}`;
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