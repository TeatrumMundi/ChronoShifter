"use client";

import { getChampionSpellIconByChampionAndID } from "@/utils/getLeagueAssets/getLOLAssets";
import { IconBox } from "./IconBox";
import { Champion } from "@/interfaces/ChampionType";
import { cleanItemDescription } from "@/utils/helpers";

interface ChampionSpellIconProps {
    champion: Champion;
    spellIndex: number; // 0-3 (Q, W, E, R)
    size?: number;
    showTooltip?: boolean;
    className?: string;
    tooltipClassName?: string;
    showSpellKey?: boolean;
    level?: number;
}

const SPELL_KEYS = ['Q', 'W', 'E', 'R'] as const;

export function ChampionSpellIcon({
    champion,
    spellIndex,
    size = 32,
    showTooltip = true,
    className = "",
    tooltipClassName = "",
    showSpellKey = true,
    level,
}: ChampionSpellIconProps) {
    // Walidacja indeksu spella
    if (spellIndex < 0 || spellIndex > 3) {
        console.warn(`Invalid spellIndex: ${spellIndex}. Must be 0-3.`);
        return null;
    }

    const spell = champion.spells[spellIndex];
    const spellKey = SPELL_KEYS[spellIndex];

    if (!spell) {
        console.warn(`Spell at index ${spellIndex} not found for champion ${champion.name}`);
        return null;
    }

    const tooltipContent = showTooltip ? (
        <div className="text-sm">
            <div className="font-bold text-blue-400 mb-1">
                {spellKey} - {spell.name}
            </div>
            <div className="text-gray-300 text-xs mb-2">
                {cleanItemDescription(spell.description)}
            </div>
            <div className="text-xs text-gray-400">
                <div>Cooldown: {spell.cooldownBurn} <span className="text-red-300">s</span></div>
                {spell.costBurn !== "0" && (
                    <div>Cost: {spell.costBurn}</div>
                )}
                {spell.rangeBurn !== "self" && (
                    <div>Range: {spell.rangeBurn}</div>
                )}
            </div>
        </div>
    ) : undefined;

    return (
        <div className="relative inline-block">
            <IconBox
                src={getChampionSpellIconByChampionAndID(champion, spellIndex)}
                alt={`${champion.name} ${spellKey} - ${spell.name}`}
                size={size}
                childrenSize={size}
                className={className}
                tooltip={tooltipContent}
                tooltipClassName={`w-64 p-3 ${tooltipClassName}`}
                showTooltip={showTooltip}
            >
                {showSpellKey && (
                    <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded-tl-sm font-bold">
                        {spellKey}
                    </div>
                )}
                {typeof level === "number" && (
                    <div className="absolute top-0 left-0 bg-blue-600/80 text-white text-xs px-1 rounded-br-sm font-bold">
                        {level}
                    </div>
                )}
            </IconBox>
        </div>
    );
}