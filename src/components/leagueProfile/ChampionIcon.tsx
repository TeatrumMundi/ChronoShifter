"use client";

import { Champion } from "@/interfaces/productionTypes";
import { getChampionIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { IconBox } from "@/components/common/IconBox";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface ChampionIconProps {
    champion: Champion;
    size: number;
    showTooltip?: boolean;
    tooltipPlacement?: TooltipPlacement;
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
    const formattedRoles = champion.roles
        .map(role => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())
        .join(" • ");

    return (
        <div className="relative inline-block">
            <IconBox
                src={getChampionIconUrl(champion)}
                alt={champion.name}
                size={size}
                childrenSize={size}
                className={className}
                tooltip={
                    showTooltip ? (
                        <>
                            <div className="font-bold text-blue-400 text-center">{champion.name}</div>
                            {showRoles && (
                                <div className="mt-1 text-xs text-gray-300 text-center">{formattedRoles}</div>
                            )}
                        </>
                    ) : undefined
                }
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