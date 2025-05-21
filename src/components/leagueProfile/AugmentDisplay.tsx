"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BoxPlaceHolder } from "@/components/common";
import { motion } from "framer-motion";
import { Augment } from "@/interfaces/productionTypes";
import { getAugmentIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";

const rarityColors = ["text-slate-400", "text-yellow-400", "text-fuchsia-500"];
const rarityBgColors = ["bg-slate-500", "bg-yellow-700", "bg-fuchsia-800"];
const rarityNames = ["Silver", "Gold", "Prismatic"];

const cleanText = (text: string) => {
    return text
        .replace(/<\/?spellName>/g, "")
        .replace(/<\/?rules>/g, "")
        .replace(/<br>/g, "\n")
        .replace(/@f\d@/g, "X")
        .replace(/<[^>]*>/g, "")
        .replace(/@([^@]+)@/g, (_, match) => `<span class="text-amber-300 font-semibold">${match}</span>`);
};

export function AugmentDisplay({ augments }: { augments: Augment[] }) {
    const [hoveredAugment, setHoveredAugment] = useState<Augment | null>(null);
    const [erroredIcons, setErroredIcons] = useState<Record<number, boolean>>({});

    if (!augments?.length) return null;

    return (
        <div className="relative flex flex-col gap-2">
            {[0, 3].map((startIdx) => (
                <div key={`augment-row-${startIdx}`} className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, index) => {
                        const augmentIndex = startIdx + index;
                        const augment = augments[augmentIndex];

                        return augment ? (
                            <div
                                key={`augment-${augmentIndex}`}
                                className="relative"
                                onMouseEnter={() => setHoveredAugment(augment)}
                                onMouseLeave={() => setHoveredAugment(null)}
                            >
                                {/* Icon */}
                                <div className={`rounded-sm ${rarityBgColors[augment.rarity]}`}>
                                    <Image
                                        src={
                                            erroredIcons[augment.id]
                                                ? "/augments/augment-placeholder.png"
                                                : getAugmentIconUrl(augment, "small")
                                        }
                                        alt={augment.name}
                                        width={32}
                                        height={32}
                                        onError={() =>
                                            setErroredIcons((prev) => ({ ...prev, [augment.id]: true }))
                                        }
                                        className="rounded-sm cursor-pointer w-[32px] h-[32px] min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] object-contain"
                                        quality={50}
                                    />
                                </div>

                                {/* Tooltip */}
                                {hoveredAugment === augment && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, y: -10 }}
                                        transition={{ duration: 0.2, ease: [0.175, 0.885, 0.32, 1.275] }}
                                        className="absolute left-1/2 -translate-x-1/2 bottom-12 w-60 p-2 bg-gray-900 text-white rounded-sm shadow-lg z-10 text-sm tracking-normal"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-blue-500">{augment.name}</span>
                                            <span className={`font-bold ${rarityColors[augment.rarity]}`}>
                                                {rarityNames[augment.rarity]}
                                            </span>
                                        </div>
                                        <p
                                            className="text-gray-200 text-xs whitespace-normal break-words"
                                            dangerouslySetInnerHTML={{ __html: cleanText(augment.desc) }}
                                        />
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45"></div>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <BoxPlaceHolder key={`augment-placeholder-${augmentIndex}`} />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}