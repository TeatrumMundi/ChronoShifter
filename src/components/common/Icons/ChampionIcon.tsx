"use client";

import { getChampionIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { IconBox } from "./IconBox";
import { Champion } from "@/interfaces/ChampionType";

interface ChampionIconProps {
    champion: Champion;
    size: number;
    showTooltip?: boolean;
    className?: string;
    tooltipClassName?: string;
    showRoles?: boolean;
    level?: number;
}

export function ChampionIcon({
    champion,
    size,
    showTooltip = true,
    className = "",
    tooltipClassName = "",
    showRoles = true,
    level,
}: ChampionIconProps) {
    const formattedRoles = champion.tags
        .map(role => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())
        .join(" • ");

    const tooltipContent = showTooltip ? (
        <>
            <div className="font-bold text-blue-400 text-center">{champion.name}</div>
            {showRoles && (
                <div className="mt-1 text-xs text-gray-300 text-center">{formattedRoles}</div>
            )}
        </>
    ) : undefined;

    return (
        console.log("ChampionIcon rendered", getChampionIconUrl(champion)),
        <div className="relative inline-block">
            <IconBox
                src={getChampionIconUrl(champion)}
                alt={champion.name}
                size={size}
                childrenSize={size}
                className={className}
                tooltip={tooltipContent}
                tooltipClassName={`w-48 p-2 ${tooltipClassName}`}
                showTooltip={showTooltip}
            />
            {typeof level === "number" && (
                <div className="absolute bottom-0 left-0 rounded-tr-sm rounded-bl-sm bg-black/50 text-white text-xs px-1">
                    {level}
                </div>
            )}
        </div>
    );
}