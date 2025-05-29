"use client";

import React, { useState } from "react";
import { BoxPlaceHolder } from "@/components/common";
import { Augment } from "@/interfaces/productionTypes";
import { getAugmentIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { IconBox } from "@/components/common/Icons/IconBox";
import { cleanItemDescription } from "@/utils/helpers";

const rarityColors = ["text-slate-400", "text-yellow-400", "text-fuchsia-500"];
const rarityBgColors = ["bg-slate-500", "bg-yellow-700", "bg-fuchsia-800"];
const rarityNames = ["Silver", "Gold", "Prismatic"];

interface AugmentDisplayProps {
    augments: Augment[];
    itemSize: number;
}

export function AugmentDisplay({ augments, itemSize: size = 32 }: AugmentDisplayProps) {
    const [erroredIcons, ] = useState<Record<number, boolean>>({});

    if (!augments?.length) return null;

    return (
        <div className="relative flex flex-col gap-2">
            {[0, 3].map((startIdx) => (
                <div key={`augment-row-${startIdx}`} className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, index) => {
                        const augmentIndex = startIdx + index;
                        const augment = augments[augmentIndex];

                        return augment ? (
                            <div key={`augment-${augmentIndex}`} className="relative">
                                <IconBox
                                    src={
                                        erroredIcons[augment.id]
                                            ? "/augments/augment-placeholder.png"
                                            : getAugmentIconUrl(augment, "small")
                                    }
                                    alt={augment.name}
                                    size={size}
                                    childrenSize={size}
                                    className={rarityBgColors[augment.rarity]}
                                    style={{ cursor: "pointer" }}
                                    tooltip={
                                        <>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-blue-500">{augment.name}</span>
                                                <span className={`font-bold ${rarityColors[augment.rarity]}`}>
                                                    {rarityNames[augment.rarity]}
                                                </span>
                                            </div>
                                            <p
                                                className="text-gray-200 text-xs whitespace-normal break-words"
                                                dangerouslySetInnerHTML={{ __html: cleanItemDescription(augment.desc) }}
                                            />
                                        </>
                                    }
                                />
                            </div>
                        ) : (
                            <BoxPlaceHolder size={size} key={`augment-placeholder-${augmentIndex}`} />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}