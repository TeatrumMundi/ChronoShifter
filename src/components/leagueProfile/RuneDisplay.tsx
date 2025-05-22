"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Rune } from "@/interfaces/productionTypes";
import { cleanItemDescription } from "./ItemDisplay";
import { getRuneIconUrl, getRuneTreeIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { TooltipBubble } from "../common";

export function RuneDisplay({ runes }: { runes: Rune[] }) {
    const [hoveredRune, setHoveredRune] = useState<Rune | null>(null);

    if (!runes || runes.length < 2) return null;

    const primaryRune = runes[0];
    const secondaryRune = runes[runes.length - 1];

    const primaryIconUrl = getRuneIconUrl(primaryRune);
    const secondaryIconUrl = getRuneTreeIconUrl(secondaryRune);

    return (
        <div className="flex flex-col items-center bg-gray-800 rounded-sm p-1 border border-gray-600 gap-3">
            {/* Primary Rune */}
            <div
                className="relative"
                onMouseEnter={() => setHoveredRune(primaryRune)}
                onMouseLeave={() => setHoveredRune(null)}
            >
                <Image
                    src={primaryIconUrl}
                    alt={primaryRune.name}
                    width={31}
                    height={31}
                    className="rounded-full cursor-pointer"
                />
                {hoveredRune === primaryRune && (
                    <TooltipBubble className="w-60">
                        <div className="font-bold text-blue-400">{primaryRune.name}</div>
                        <div className="text-xs text-gray-300 mt-1">
                            {cleanItemDescription(primaryRune.shortDesc)}
                        </div>
                    </TooltipBubble>
                )}
            </div>

            {/* Secondary Rune Tree Icon */}
            <div
                className="relative"
                onMouseEnter={() => setHoveredRune(secondaryRune)}
                onMouseLeave={() => setHoveredRune(null)}
            >
                <Image
                    src={secondaryIconUrl || ""}
                    alt={secondaryRune.runeTree || "Rune Tree"}
                    width={20}
                    height={20}
                    className="rounded-full cursor-pointer"
                />
                {hoveredRune === secondaryRune && secondaryRune.runeTree && (
                    <TooltipBubble className="w-48">
                        <div className="font-bold text-blue-400">{secondaryRune.runeTree}</div>
                    </TooltipBubble>
                )}
            </div>
        </div>
    );
}