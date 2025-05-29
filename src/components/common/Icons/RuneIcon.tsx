import { Rune } from "@/interfaces/productionTypes";
import { getRuneIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { cleanItemDescription } from "@/utils/helpers";
import { IconBox } from "./IconBox";

interface RuneIconProps {
    rune: Rune;
    size: number;
    childrenSize: number;
    selectedRune?: Rune;
    className?: string;
}

export function RuneIcon({ 
    rune, 
    selectedRune, 
    size, 
    childrenSize, 
    className = "" 
}: RuneIconProps) {
    const isSelected = !!selectedRune;
    
    const tooltipContent = (
        <div className="text-sm">
            <div className="font-semibold text-fuchsia-600">{rune.name}</div>
            <div className="text-gray-300 mt-1">{cleanItemDescription(rune.shortDesc)}</div>
        </div>
    );

    return (
        <IconBox
            src={getRuneIconUrl(rune)}
            key={rune.id}
            alt={rune.name}
            size={size}
            childrenSize={childrenSize}
            className={`border transition-all ${isSelected ? "opacity-100" : "opacity-30"} ${className}`}
            tooltip={tooltipContent}
        />
    );
}