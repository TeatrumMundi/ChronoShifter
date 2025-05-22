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

export function ItemDisplay({ items }: { items: (Item | null)[] }) {
    const [hoveredItem, setHoveredItem] = useState<Item | null>(null);

    return (
        <div className="w-full sm:w-auto">
            <div
                className="grid grid-cols-4 grid-rows-2 gap-x-1 gap-y-2 items-center"
                style={{ minWidth: 148 }}
            >
                {/* First row: items 0,1,2 */}
                {[0, 1, 2].map((idx) =>
                    items[idx] && items[idx]!.id !== 0 ? (
                        <ItemSlot
                            key={idx}
                            item={items[idx]!}
                            hoveredItem={hoveredItem}
                            setHoveredItem={setHoveredItem}
                        />
                    ) : (
                        <BoxPlaceHolder key={`ph-${idx}`} />
                    )
                )}
                {/* 7th item: row-span-2, col-start-4, centered vertically */}
                <div className="row-span-2 flex items-center justify-center">
                    {items[6] && items[6]!.id !== 0 ? (
                        <ItemSlot
                            item={items[6]!}
                            hoveredItem={hoveredItem}
                            setHoveredItem={setHoveredItem}
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
                        />
                    ) : (
                        <BoxPlaceHolder key={`ph-${idx}`} />
                    )
                )}
            </div>
        </div>
    );
}

// Helper for item slot rendering
function ItemSlot({
    item,
    hoveredItem,
    setHoveredItem,
}: {
    item: Item;
    hoveredItem: Item | null;
    setHoveredItem: (item: Item | null) => void;
}) {
    return (
        <div
            className="relative"
            onMouseEnter={() => setHoveredItem(item)}
            onMouseLeave={() => setHoveredItem(null)}
        >
            <IconBox
                src={getItemIcon(item.id)}
                alt={`Item ${item.name}`}
                size={32}
                childrenSize={32}
                className="cursor-pointer"
            />
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
        </div>
    );
}