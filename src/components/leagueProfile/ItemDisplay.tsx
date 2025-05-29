"use client"

import React from "react";
import { BoxPlaceHolder } from "@/components/common";
import { Item } from "@/interfaces/productionTypes";
import { ItemIcon } from "../common/Icons/ItemIcon";

interface ItemDisplayProps {
    items: (Item | null)[];
    itemSize: number;
    smMinWidth?: number;
    trinketMaxWidth?: number;
}

export function ItemDisplay({items, itemSize = 32, smMinWidth, trinketMaxWidth = 32}: ItemDisplayProps) {
    return (
        <div className="sm:w-auto">
            <div
                className="grid grid-cols-3 sm:grid-cols-4 grid-rows-2 gap-y-2 items-center gap-1 min-w-[100px] md:min-w-[150px]"
                style={{ minWidth: smMinWidth }}
            >
                {[0, 1, 2].map((idx) =>
                    items[idx] && items[idx]!.id !== 0 ? (
                        <ItemIcon
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
                        <ItemIcon
                            item={items[6]!}
                            itemSize={itemSize}
                        />
                    ) : (<BoxPlaceHolder size={itemSize} />)}
                </div>
                {[3, 4, 5].map((idx) =>
                    items[idx] && items[idx]!.id !== 0 ? (
                        <ItemIcon
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