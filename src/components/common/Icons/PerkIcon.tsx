import { Perk } from "@/interfaces/productionTypes";
import { getPerkIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { cleanItemDescription } from "@/utils/helpers";
import { IconBox } from "./IconBox";

interface PerkIconProps {
    perk: Perk;
    size: number;
    childrenSize: number;
    isSelected?: boolean;
    className?: string;
}

export function PerkIcon({ 
    perk, 
    isSelected = false,
    size, 
    childrenSize, 
    className = "" 
}: PerkIconProps) {
    const tooltipContent = (
        <div className="text-sm">
            <div className="font-semibold text-yellow-400">{perk.name}</div>
            <div className="text-gray-300 mt-1">{perk.desc}</div>
            {perk.longDesc && (
                <div className="text-gray-400 text-xs mt-2">{cleanItemDescription(perk.longDesc)}</div>
            )}
        </div>
    );

    return (
        <IconBox
            src={getPerkIconUrl(perk)}
            alt={perk.name}
            size={size}
            childrenSize={childrenSize}
            className={`border transition-all ${isSelected ? "opacity-100 border-yellow-400" : "opacity-15 border-gray-600"} ${className}`}
            tooltip={tooltipContent}
        />
    );
}