import { getSummonerSpellIcon } from "@/utils/getLeagueAssets/getLOLAssets";
import { SummonerSpell } from "@/interfaces/productionTypes";
import { cleanItemDescription } from "@/utils/helpers";
import { IconBox } from '@/components/common';

export interface SummonerSpellDisplayProps {
    summonerSpell1: SummonerSpell;
    summonerSpell2: SummonerSpell;
    summonerspellIconsSize: number;
    boxSize: number;
}

export function SummonerSpellDisplay({ summonerSpell1, summonerSpell2, boxSize = 32, summonerspellIconsSize = 28 }: SummonerSpellDisplayProps) {
    return (
        <div className="flex flex-col items-center gap-2">

            {/* Primary summoner spell Icon */}
            <IconBox
                src={getSummonerSpellIcon(summonerSpell1)}
                alt={summonerSpell1.name || "Summoner Spell"}
                size={boxSize}
                childrenSize={summonerspellIconsSize}
                tooltip={
                    <>
                        <div className="font-bold text-blue-400">{summonerSpell1.name} ({summonerSpell1.cooldown}s)</div>
                        <div className="text-xs text-gray-300 mt-1">
                            {cleanItemDescription(summonerSpell1.description)}
                        </div>
                    </>
                }
                tooltipClassName="w-60"
            />

            {/* Secondary summoner spell Icon */}
            <IconBox
                src={getSummonerSpellIcon(summonerSpell2)}
                alt={summonerSpell2.name || "Summoner Spell"}
                size={boxSize}
                childrenSize={summonerspellIconsSize}
                tooltip={
                    <>
                        <div className="font-bold text-blue-400">{summonerSpell2.name} ({summonerSpell2.cooldown}s)</div>
                        <div className="text-xs text-gray-300 mt-1">
                            {cleanItemDescription(summonerSpell2.description)}
                        </div>
                    </>
                }
                tooltipClassName="w-60"
            />
        </div>
    );
}