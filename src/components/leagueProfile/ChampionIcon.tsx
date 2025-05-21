"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { motion } from "framer-motion";
import { Champion } from "@/interfaces/productionTypes";
import { getChampionIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";

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
    tooltipPlacement = "top",
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

    // Tooltip positioning logic
    const tooltipStyle =
        tooltipPlacement === "top"
            ? { bottom: size + 12 }
            : tooltipPlacement === "bottom"
            ? { top: size + 12 }
            : tooltipPlacement === "left"
            ? { right: size + 12 }
            : { left: size + 12 };

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
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={tooltipStyle}
                    className={`absolute left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-900 text-white rounded-md shadow-lg z-[999] text-sm tracking-tight ${tooltipClassName}`}
                >
                    <div className="font-bold text-blue-400 text-center">{champion.name}</div>
                    {showRoles && (
                        <div className="mt-1 text-xs text-gray-300 text-center">{formattedRoles}</div>
                    )}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45" />
                </motion.div>
            )}
        </div>
    );
}