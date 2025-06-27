"use client";

import React from "react";
import { BoxPlaceHolder } from "@/components/common";
import { Augment } from "@/interfaces/productionTypes";
import { AugmentIcon } from "../common/Icons/AugmentIcon";

interface AugmentDisplayProps {
    augments: Augment[];
    itemSize: number;
}

export function AugmentDisplay({ augments, itemSize: size = 32 }: AugmentDisplayProps) {
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
                                <AugmentIcon
                                    augment={augment}
                                    size={size}
                                    showTooltip={true}
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