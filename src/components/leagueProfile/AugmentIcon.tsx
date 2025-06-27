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
            <div className="flex justify-between items-center mb-2 p-2 bg-gray-800/80 rounded-lg border border-gray-700/50">
                <span className="font-bold text-blue-400 px-2 py-1 bg-blue-900/30 rounded-md border border-blue-700/50">
                    {augment.name}
                </span>
                <span className={`font-bold px-2 py-1 rounded-md border ${rarityColors[augment.rarity]} ${
                    augment.rarity === 0 ? 'bg-slate-800/50 border-slate-600/50' :
                    augment.rarity === 1 ? 'bg-yellow-900/30 border-yellow-700/50' :
                    'bg-fuchsia-900/30 border-fuchsia-700/50'
                }`}>
                    {rarityNames[augment.rarity]}
                </span>
            </div>
            <p
                className="text-gray-200 text-xs whitespace-normal break-words px-2"
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
