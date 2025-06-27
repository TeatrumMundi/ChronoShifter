import { Augment } from "@/interfaces/productionTypes";
import { getAugmentIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { IconBox } from "@/components/common/Icons/IconBox";
import { cleanItemDescription } from "@/utils/helpers";

const rarityColors = ["text-slate-400", "text-yellow-400", "text-fuchsia-500"];
const rarityBgColors = ["bg-slate-500", "bg-yellow-700", "bg-fuchsia-800"];
const rarityNames = ["Silver", "Gold", "Prismatic"];

interface AugmentIconProps {
    augment: Augment;
    size?: number;
    showTooltip?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export function AugmentIcon({ 
    augment, 
    size = 32, 
    showTooltip = true,
    className = "",
    style = {}
}: AugmentIconProps) {
    const tooltip = showTooltip ? (
        <>
            <div className="flex justify-between items-center mb-2 gap-2">
                <span className="font-bold text-blue-500 bg-blue-900/40 px-2 py-1 rounded border border-blue-700/50">
                    {augment.name}
                </span>
                <span className={`font-bold px-2 py-1 rounded border ${rarityColors[augment.rarity]} ${rarityBgColors[augment.rarity]}/40 border-opacity-50`}
                      style={{ borderColor: `var(--rarity-border-${augment.rarity})` }}>
                    {rarityNames[augment.rarity]}
                </span>
            </div>
            <p
                className="text-gray-200 text-xs whitespace-normal break-words"
                dangerouslySetInnerHTML={{ __html: cleanItemDescription(augment.desc) }}
            />
        </>
    ) : undefined;

    return (
        <IconBox
            src={getAugmentIconUrl(augment, "small")}
            alt={augment.name}
            size={size}
            childrenSize={size}
            className={`${rarityBgColors[augment.rarity]} ${className}`}
            style={{ cursor: "pointer", ...style }}
            tooltip={tooltip}
            showTooltip={showTooltip}
        />
    );
}
