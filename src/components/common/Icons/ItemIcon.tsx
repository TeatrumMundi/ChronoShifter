import { cleanItemDescription } from "@/utils/helpers";
import { IconBox } from "./IconBox";
import { getItemIcon } from "@/utils/getLeagueAssets/getLOLAssets";
import { Item } from "@/interfaces/productionTypes";

interface ItemIconProps {
    item?: Item;
    itemSize?: number;
    className?: string;
}

export function ItemIcon({ item, itemSize = 32, className }: ItemIconProps) {
    return (
        <IconBox
            src={item ? getItemIcon(item.id) : undefined}
            alt={item ? `Item ${item.name}` : "Item"}
            size={itemSize}
            childrenSize={itemSize}
            className={className}
            tooltip={
                item ? (
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
                ) : null
            }
        />
    );
}