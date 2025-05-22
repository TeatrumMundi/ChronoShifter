"use client"

import React, { useState } from "react";
import { BoxPlaceHolder, TooltipBubble } from "@/components/common";
import { Item } from "@/interfaces/productionTypes";
import { getItemIcon } from "@/utils/getLeagueAssets/getLOLAssets";
import { IconBox } from "@/components/common/IconBox";

// Helper function to clean and format the item description.
// It replaces <br> and <li> tags with newlines, then removes remaining tags.
export const cleanItemDescription = (text: string): string => {
    return text
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<li>/gi, "\n")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .trim();
};

export function ItemDisplay({items, itemSize = 32,}: {items: (Item | null)[]; itemSize?: number;}) {
    const [hoveredItem, setHoveredItem] = useState<Item | null>(null);

    return (
        <div className="w-full sm:w-auto">
            <div
                className="grid grid-cols-3 sm:grid-cols-4 grid-rows-2 gap-y-2 items-center sm:min-w-[150px]"
            >
                {/* First row: items 0,1,2 */}
                {[0, 1, 2].map((idx) =>
                    items[idx] && items[idx]!.id !== 0 ? (
                        <ItemSlot
                            key={idx}
                            item={items[idx]!}
                            hoveredItem={hoveredItem}
                            setHoveredItem={setHoveredItem}
                            itemSize={itemSize}
                        />
                    ) : (
                        <BoxPlaceHolder key={`ph-${idx}`} />
                    )
                )}
                {/* 7th item: only show on sm and up */}
                <div className="hidden sm:flex row-span-2 items-center justify-center max-w-[32px]">
                    {items[6] && items[6]!.id !== 0 ? (
                        <ItemSlot
                            item={items[6]!}
                            hoveredItem={hoveredItem}
                            setHoveredItem={setHoveredItem}
                            itemSize={itemSize}
                        />
                    ) : (
                        <BoxPlaceHolder />
                    )}
                </div>
                {/* Second row: items 3,4,5 */}
                {[3, 4, 5].map((idx) =>
                    items[idx] && items[idx]!.id !== 0 ? (
                        <ItemSlot
                            key={idx}
                            item={items[idx]!}
                            hoveredItem={hoveredItem}
                            setHoveredItem={setHoveredItem}
                            itemSize={itemSize}
                        />
                    ) : (
                        <BoxPlaceHolder key={`ph-${idx}`} />
                    )
                )}
            </div>
        </div>
    );
}

function ItemSlot({ item, hoveredItem, setHoveredItem, itemSize = 32}: {
    item: Item;
    hoveredItem: Item | null;
    setHoveredItem: (item: Item | null) => void;
    itemSize?: number;
}) {
    return (
        <IconBox
            src={getItemIcon(item.id)}
            alt={`Item ${item.name}`}
            size={itemSize}
            childrenSize={itemSize}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredItem(item)}
            onMouseLeave={() => setHoveredItem(null)}
        >
            {hoveredItem === item && (
                <TooltipBubble>
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-blue-500">{item.name}</span>
                    </div>
                    <p className="text-gray-200 text-xs break-words">
                        {cleanItemDescription(item.description)}
                    </p>
                    <div className="mt-1 font-bold text-yellow-500">
                        Cost: {item.price} ({item.priceTotal})
                    </div>
                </TooltipBubble>
            )}
        </IconBox>
    );
}