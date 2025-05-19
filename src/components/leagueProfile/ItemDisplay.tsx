"use client"

import React, { useState } from "react";
import Image from "next/image";
import { BoxPlaceHolder } from "@/components/common";
import { motion } from "framer-motion";
import { Item } from "@/interfaces/productionTypes";
import { getItemIcon } from "@/utils/getLeagueAssets/getLOLAssets";

// Helper function to clean and format the item description.
// It replaces <br> and <li> tags with newlines, then removes remaining tags.
export const cleanItemDescription = (text: string): string => {
    return text
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<li>/gi, "\n")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .trim();
};

export function ItemDisplay({ items }: { items: (Item | null)[] }) {
    const [hoveredItem, setHoveredItem] = useState<Item | null>(null);

    return (
        <div className="w-full sm:w-auto">
            <div className="flex flex-col gap-2">
                {[0, 3].map((startIdx) => (
                    <div key={`item-row-${startIdx}`} className="flex gap-2">
                        {Array.from({ length: 3 }).map((_, index) => {
                            const itemIndex = startIdx + index;
                            const item = items[itemIndex];
                            return item ? (
                                <div
                                    key={`item-${itemIndex}`}
                                    className="relative"
                                    onMouseEnter={() => setHoveredItem(item)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    <div className="rounded-sm">
                                        <Image
                                            src={getItemIcon(item.id)}
                                            alt={`Item ${item.name}`}
                                            width={32}
                                            height={32}
                                            className="rounded-sm cursor-pointer w-[32px] h-[32px] min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] object-contain"
                                            quality={50}
                                        />
                                    </div>
                                    {hoveredItem === item && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                scale: 0.5,
                                                y: -20,
                                                transformOrigin: "bottom center"
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.5,
                                                y: -10
                                            }}
                                            transition={{
                                                duration: 0.2,
                                                ease: [0.175, 0.885, 0.32, 1.275]
                                            }}
                                            className="absolute left-1/2 -translate-x-1/2 bottom-12 w-60 p-2 bg-gray-900 text-white rounded-sm shadow-lg z-10 text-sm tracking-normal whitespace-pre-line"
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-blue-500">{item.name}</span>
                                            </div>
                                            <p className="text-gray-200 text-xs break-words">
                                                {cleanItemDescription(item.description)}
                                            </p>
                                            <div className="mt-1 font-bold text-yellow-500">
                                                Cost: {item.price} ({item.priceTotal})
                                            </div>
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                                        </motion.div>
                                    )}
                                </div>
                            ) : (
                                <BoxPlaceHolder key={`item-placeholder-${itemIndex}`} />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}