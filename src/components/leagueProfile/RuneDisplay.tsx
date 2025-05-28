"use client";

import React from "react";
import { Rune } from "@/interfaces/productionTypes";
import { getRuneIconUrl, getRuneTreeIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { IconBox } from "../common/IconBox";
import { cleanItemDescription } from "@/utils/helpers";

interface RuneDisplayProps {
    runes: Rune[];
    boxSize: number;
    keyStoneIconSize: number;
    secendaryRuneIconSize: number;
}

export function RuneDisplay({ runes, boxSize, keyStoneIconSize, secendaryRuneIconSize}: RuneDisplayProps) {
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
                size={boxSize}
                childrenSize={keyStoneIconSize}
                tooltip={
                    <>
                        <div className="font-bold text-blue-400">{primaryRune.name}</div>
                        <div className="text-xs text-gray-300 mt-1">
                            {cleanItemDescription(primaryRune.shortDesc)}
                        </div>
                    </>
                }
                tooltipClassName="w-60"
            />


            {/* Secondary Rune Tree Icon */}
            <IconBox
                src={secondaryIconUrl || ""}
                alt={secondaryRune.runeTree.name || "Rune Tree"}
                size={boxSize}
                childrenSize={secendaryRuneIconSize}
                tooltip={
                    secondaryRune.runeTree ? (
                        <div className="font-bold text-blue-400">{secondaryRune.runeTree.name}</div>
                    ) : undefined
                }
                tooltipClassName="w-48"
            />
        </div>
    );
}