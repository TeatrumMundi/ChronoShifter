"use client";

import React, { useState } from "react";
import { Rune } from "@/interfaces/productionTypes";
import { cleanItemDescription } from "./ItemDisplay";
import { getRuneIconUrl, getRuneTreeIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { TooltipBubble } from "../common";
import { IconBox } from "../common/IconBox";

export const PRIMARY_RUNE_ICON_SIZE = 28;
export const SECONDARY_RUNE_ICON_SIZE = 20;
export const RUNE_ICON_BOX_SIZE = 32;

export function RuneDisplay({ runes }: { runes: Rune[] }) {
    const [hoveredRune, setHoveredRune] = useState<Rune | null>(null);

    if (!runes || runes.length < 2) return null;

    const primaryRune = runes[0];
    const secondaryRune = runes[runes.length - 1];

    const primaryIconUrl = getRuneIconUrl(primaryRune);
    const secondaryIconUrl = getRuneTreeIconUrl(secondaryRune);

    return (
        <div className="flex flex-col items-center gap-2">

            {/* Primary Rune Icon */}
            <IconBox
                src={primaryIconUrl}
                alt={primaryRune.name}
                size={RUNE_ICON_BOX_SIZE}
                childrenSize={PRIMARY_RUNE_ICON_SIZE}
                onMouseEnter={() => setHoveredRune(primaryRune)}
                onMouseLeave={() => setHoveredRune(null)}
            >
                {hoveredRune === primaryRune && (
                    <TooltipBubble className="w-60">
                        <div className="font-bold text-blue-400">{primaryRune.name}</div>
                        <div className="text-xs text-gray-300 mt-1">
                            {cleanItemDescription(primaryRune.shortDesc)}
                        </div>
                    </TooltipBubble>
                )}
            </IconBox>


            {/* Secondary Rune Tree Icon */}
            <IconBox
                src={secondaryIconUrl || ""}
                alt={secondaryRune.runeTree || "Rune Tree"}
                size={RUNE_ICON_BOX_SIZE}
                childrenSize={SECONDARY_RUNE_ICON_SIZE}
                onMouseEnter={() => setHoveredRune(secondaryRune)}
                onMouseLeave={() => setHoveredRune(null)}
            >
                {hoveredRune === secondaryRune && secondaryRune.runeTree && (
                    <TooltipBubble className="w-48">
                        <div className="font-bold text-blue-400">{secondaryRune.runeTree}</div>
                    </TooltipBubble>
                )}
            </IconBox>
        </div>
    );
}