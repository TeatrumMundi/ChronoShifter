"use client";

import React, { useState } from "react";
import { SummonerSpell } from "@/interfaces/productionTypes";
import { cleanItemDescription } from "./ItemDisplay";
import { getSummonerSpellIcon } from "@/utils/getLeagueAssets/getLOLAssets";
import { TooltipBubble } from "../common";
import { IconBox } from "../common/IconBox";

export const SUMMONER_SPELL_ICON_SIZE = 28;
export const SECONDARY_SPELL_ICON_SIZE = 28;
export const SPELL_ICON_BOX_SIZE = 32;

export interface SummonerSpellDisplayProps {
    summonerSpell1: SummonerSpell;
    summonerSpell2: SummonerSpell;
}

export function SummonerSpellDisplay({ summonerSpell1, summonerSpell2 }: SummonerSpellDisplayProps) {
    const [hoveredSpell, setHoveredSpell] = useState<SummonerSpell | null>(null);

    return (
        <div className="flex flex-col items-center gap-2">

            {/* Primary summoner spell Icon */}
            <IconBox
                src={getSummonerSpellIcon(summonerSpell1)}
                alt={summonerSpell1.name || "Summoner Spell"}
                size={SPELL_ICON_BOX_SIZE}
                childrenSize={SUMMONER_SPELL_ICON_SIZE}
                onMouseEnter={() => setHoveredSpell(summonerSpell1)}
                onMouseLeave={() => setHoveredSpell(null)}
            >
                {hoveredSpell === summonerSpell1 && (
                    <TooltipBubble className="w-60">
                        <div className="font-bold text-blue-400">{summonerSpell1.name} ({summonerSpell1.cooldown}s)</div>
                        <div className="text-xs text-gray-300 mt-1">
                            {cleanItemDescription(summonerSpell1.description)}
                        </div>
                    </TooltipBubble>
                )}
            </IconBox>


            {/* Secondary summoner spell  Icon */}
            <IconBox
                src={getSummonerSpellIcon(summonerSpell2)}
                alt={summonerSpell2.name || "Summoner Spell"}
                size={SPELL_ICON_BOX_SIZE}
                childrenSize={SECONDARY_SPELL_ICON_SIZE}
                onMouseEnter={() => setHoveredSpell(summonerSpell2)}
                onMouseLeave={() => setHoveredSpell(null)}
            >
                {hoveredSpell === summonerSpell2 &&  (
                    <TooltipBubble className="w-60">
                        <div className="font-bold text-blue-400">{summonerSpell2.name} ({summonerSpell2.cooldown}s)</div>
                        <div className="text-xs text-gray-300 mt-1">
                            {cleanItemDescription(summonerSpell2.description)}
                        </div>
                    </TooltipBubble>
                )}
            </IconBox>
        </div>
    );
}