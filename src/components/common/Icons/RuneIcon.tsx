import { Rune } from "@/interfaces/productionTypes";
import { getRuneIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { cleanItemDescription } from "@/utils/helpers";
import { IconBox } from "../IconBox";

interface RuneIconProps {
    rune: Rune;
    selectedRune?: Rune;
}

export function RuneIcon({ rune, selectedRune }: RuneIconProps) {
    const isSelected = !!selectedRune;
    const iconUrl = selectedRune ? getRuneIconUrl(selectedRune) : `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`;

    return (
        <IconBox
            key={rune.id}
            src={iconUrl}
            alt={rune.name}
            size={44}
            childrenSize={36}
            className={`border transition-all
                ${isSelected ? "opacity-100" : "opacity-30"}`}
            tooltip={
                <div className="text-sm">
                    <div className="font-semibold text-white">{rune.name}</div>
                    <div className="text-gray-300 mt-1">{cleanItemDescription(rune.shortDesc)}</div>
                </div>
            }
        />
    );
}