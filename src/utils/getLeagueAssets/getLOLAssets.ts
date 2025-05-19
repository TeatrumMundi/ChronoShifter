const GAME_VERSION = process.env.NEXT_PUBLIC_GAME_VERSION || "15.6.1";

// Item Icon
export function getItemIcon(itemId: number): string {
    return `https://ddragon.leagueoflegends.com/cdn/${GAME_VERSION}/img/item/${itemId}.png`;
}