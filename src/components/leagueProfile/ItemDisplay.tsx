"use client"

import React from "react";
import { BoxPlaceHolder } from "@/components/common";
import { Item } from "@/interfaces/productionTypes";
import { getItemIcon } from "@/utils/getLeagueAssets/getLOLAssets";
import { IconBox } from "@/components/common/IconBox";
import { cleanItemDescription } from "@/utils/helpers";

interface ItemDisplayProps {
    items: (Item | null)[];
    itemSize: number;
    smMinWidth?: number;
    trinketMaxWidth?: number;
}

export function ItemDisplay({items, itemSize = 32, smMinWidth = 150, trinketMaxWidth = 32}: ItemDisplayProps) {
    return (
        <div className="sm:w-auto">
            <div
                className="grid grid-cols-3 sm:grid-cols-4 grid-rows-2 gap-y-2 items-center"
                style={{ minWidth: smMinWidth }}
            >
                {[0, 1, 2].map((idx) =>
                    items[idx] && items[idx]!.id !== 0 ? (
                        <ItemSlot
                            key={idx}
                            item={items[idx]!}
                            itemSize={itemSize}
                        />
                    ) : (<BoxPlaceHolder size={itemSize} key={`ph-${idx}`} />)
                )}
                <div
                    className="hidden sm:flex row-span-2 items-center justify-center"
                    style={{ maxWidth: trinketMaxWidth }}
                >
                    {items[6] && items[6]!.id !== 0 ? (
                        <ItemSlot
                            item={items[6]!}
                            itemSize={itemSize}
                        />
                    ) : (<BoxPlaceHolder size={itemSize} />)}
                </div>
                {[3, 4, 5].map((idx) =>
                    items[idx] && items[idx]!.id !== 0 ? (
                        <ItemSlot
                            key={idx}
                            item={items[idx]!}
                            itemSize={itemSize}
                        />
                    ) : (<BoxPlaceHolder size={itemSize} key={`ph-${idx}`} />)
                )}
            </div>
        </div>
    );
}

function ItemSlot({ item, itemSize = 32 }: { item: Item; itemSize?: number }) {
    return (
        <IconBox
            src={getItemIcon(item.id)}
            alt={`Item ${item.name}`}
            size={itemSize}
            childrenSize={itemSize}
            tooltip={
                <>
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-blue-500">{item.name}</span>
                    </div>
                    <p className="text-gray-200 text-xs break-words">
                        {cleanItemDescription(item.description)}
                    </p>
                    <div className="mt-1 font-bold text-yellow-500">
                        Cost: {item.price} ({item.priceTotal})
                    </div>
                </>
            }
        />
    );
}