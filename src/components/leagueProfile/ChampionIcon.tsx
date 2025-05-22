"use client";

import { useState } from "react";
import { Champion } from "@/interfaces/productionTypes";
import { getChampionIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { TooltipBubble } from "../common";
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
}

export function ChampionIcon({
    champion,
    size,
    showTooltip = true,
    className = "",
    tooltipClassName = "",
    showRoles = true,
}: ChampionIconProps) {
    const [hovered, setHovered] = useState(false);

    const formattedRoles = champion.roles
        .map(role => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())
        .join(" • ");

    return (
        <IconBox
            src={getChampionIconUrl(champion)}
            alt={champion.name}
            size={size}
            childrenSize={size}
            className={className}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {showTooltip && hovered && (
                <TooltipBubble
                    className={`w-48 p-2 ${tooltipClassName}`}
                >
                    <div className="font-bold text-blue-400 text-center">{champion.name}</div>
                    {showRoles && (
                        <div className="mt-1 text-xs text-gray-300 text-center">{formattedRoles}</div>
                    )}
                </TooltipBubble>
            )}
        </IconBox>
    );
}