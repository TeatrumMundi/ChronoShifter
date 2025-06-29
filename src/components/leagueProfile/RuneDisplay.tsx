import { getRuneTreeIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { IconBox, RuneIcon } from '@/components/common';
import { Rune } from "@/interfaces/productionTypes";

interface RuneDisplayProps {
    runes: Rune[];
    boxSize: number;
    keyStoneIconSize: number;
    secendaryRuneIconSize: number;
}

export function RuneDisplay({ runes, boxSize, keyStoneIconSize, secendaryRuneIconSize}: RuneDisplayProps) {
    if (!runes || runes.length < 2) return null;

    const primaryRune = runes[0];
    const secondaryRune = runes[runes.length - 1];

    if (!primaryRune || !secondaryRune) return null;

    const secondaryIconUrl = getRuneTreeIconUrl(secondaryRune);

    return (
        <div className="flex flex-col items-center gap-2">

            {/* Primary Rune Icon */}
            <RuneIcon
                rune={primaryRune}
                size={boxSize}
                childrenSize={keyStoneIconSize}
                selectedRune={primaryRune}
            />

            {/* Secondary Rune Tree Icon */}
            <IconBox
                src={secondaryIconUrl || ""}
                alt={secondaryRune.runeTree?.name || "Rune Tree"}
                size={boxSize}
                childrenSize={secendaryRuneIconSize}
                tooltip={
                    secondaryRune.runeTree ? (
                        <div className="font-bold text-blue-400">{secondaryRune.runeTree.name}</div>
                    ) : undefined
                }
                tooltipClassName="w-48"
            />
        </div>
    );
}