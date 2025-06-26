"use client";

import React from "react";
import { BoxPlaceHolder } from "@/components/common";
import { Item } from "@/interfaces/productionTypes";
import { ItemIcon } from "../common/Icons/ItemIcon";

interface ItemDisplayProps {
    items: (Item | null)[];
    itemSize: number;
}

export function ItemDisplay({ items, itemSize: size = 32 }: ItemDisplayProps) {
    if (!items?.length) return null;

    return (
        <div className="relative flex gap-2">
            {/* Items container */}
            <div className="flex flex-col gap-2">
                {/* First row: items 0, 1, 2 */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((index) => {
                        const item = items[index];

                        return item && item.id !== 0 ? (
                            <div key={`item-${index}`} className="relative">
                                <ItemIcon
                                    item={item}
                                    itemSize={size}
                                />
                            </div>
                        ) : (
                            <BoxPlaceHolder size={size} key={`item-placeholder-${index}`} />
                        );
                    })}
                </div>

                {/* Second row: items 3, 4, 5 */}
                <div className="flex gap-2">
                    {[3, 4, 5].map((index) => {
                        const item = items[index];

                        return item && item.id !== 0 ? (
                            <div key={`item-${index}`} className="relative">
                                <ItemIcon
                                    item={item}
                                    itemSize={size}
                                />
                            </div>
                        ) : (
                            <BoxPlaceHolder size={size} key={`item-placeholder-${index}`} />
                        );
                    })}
                </div>
            </div>

            {/* Trinket slot - positioned on the right, vertically centered */}
            <div className="flex items-center">
                {items[6] && items[6].id !== 0 ? (
                    <div className="relative">
                        <ItemIcon
                            item={items[6]}
                            itemSize={size}
                        />
                    </div>
                ) : (
                    <BoxPlaceHolder size={size} />
                )}
            </div>
        </div>
    );
}