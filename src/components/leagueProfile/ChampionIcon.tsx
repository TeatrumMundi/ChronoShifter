"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Champion } from "@/interfaces/productionTypes";
import { getChampionIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { TooltipBubble } from "../common";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface ChampionIconProps {
    champion: Champion;
    size: number;
    showTooltip?: boolean;
    tooltipPlacement?: TooltipPlacement;
    className?: string;
    tooltipClassName?: string;
    showRoles?: boolean;
    imageProps?: Partial<ImageProps>;
}

export function ChampionIcon({
    champion,
    size,
    showTooltip = true,
    className = "",
    tooltipClassName = "",
    showRoles = true,
    imageProps = {},
}: ChampionIconProps) {
    const [error, setError] = useState(false);
    const [hovered, setHovered] = useState(false);

    if (error) {
        return (
            <div
                style={{ width: size, height: size }}
                className={`bg-gray-900 rounded-sm border border-gray-600 flex items-center justify-center text-gray-400 ${className}`}
            >
                ?
            </div>
        );
    }

    const formattedRoles = champion.roles
        .map(role => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())
        .join(" • ");

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Image
                src={getChampionIconUrl(champion)}
                alt={champion.name}
                width={size}
                height={size}
                className="rounded-sm"
                onError={() => setError(true)}
                quality={30}
                loading="eager"
                {...imageProps}
            />

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
        </div>
    );
}