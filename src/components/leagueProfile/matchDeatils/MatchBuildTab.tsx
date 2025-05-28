import { Participant } from "@/interfaces/productionTypes";
import Image from "next/image";
import { getRuneIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import runesData from "@/utils/getLeagueAssets/runes.json";

interface MatchBuildTabProps {
    mainPlayer: Participant;
}

export function MatchBuildTab({ mainPlayer }: MatchBuildTabProps) {
    // Utwórz zestaw ID wybranych run gracza
    const selectedRuneIds = new Set(mainPlayer.runes.map(rune => rune.id));

    // Filtruj drzewa run - pokazuj tylko te, które mają aktywne runy gracza
    const activeRuneTrees = runesData.filter(runeTree => {
        return runeTree.slots.some(slot => 
            slot.runes.some(rune => selectedRuneIds.has(rune.id))
        );
    });

    return (
        <div className="p-0">
            {/* Nagłówek Runes na niebieskim tle */}
            <div className="bg-blue-600 text-white px-4 py-1">
                <h2 className="text-lg font-semibold">Runes</h2>
            </div>
            
            <div className="p-4">
                {/* Nazwy drzewek na środku */}
                <div className="flex gap-4 divide-x divide-gray-300 mb-3">
                    {activeRuneTrees.map((runeTree) => (
                        <div key={`title-${runeTree.id}`} className="px-3 flex-1 first:pl-0">
                            <div className="flex items-center justify-center gap-2">
                                <Image
                                    src={`https://ddragon.leagueoflegends.com/cdn/img/${runeTree.icon}`}
                                    alt={runeTree.name}
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                                <h3 className="text-xs font-medium">{runeTree.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Drzewka run */}
                <div className="flex gap-4 divide-x divide-gray-300">
                    {activeRuneTrees.map((runeTree) => (
                        <div key={runeTree.id} className="px-3 flex-1 first:pl-0">
                            {/* Sloty run */}
                            <div className="space-y-2">
                                {runeTree.slots.map((slot: { runes: Array<{ id: number; name: string; shortDesc: string; icon: string }> }, slotIndex: number) => (
                                    <div key={slotIndex} className="flex gap-1 justify-center">
                                        {slot.runes.map((rune) => {
                                            const isSelected = selectedRuneIds.has(rune.id);
                                            const playerRune = mainPlayer.runes.find(pr => pr.id === rune.id);
                                            
                                            return (
                                                <div
                                                    key={rune.id}
                                                    className={`relative p-1.5 border rounded-lg transition-all ${
                                                        isSelected 
                                                            ? 'border-yellow-400 bg-yellow-50' 
                                                            : 'border-gray-300 bg-gray-100 opacity-50'
                                                    }`}
                                                    title={`${rune.name}: ${rune.shortDesc}`}
                                                >
                                                    <Image
                                                        src={playerRune ? getRuneIconUrl(playerRune) : `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                                                        alt={rune.name}
                                                        width={36}
                                                        height={36}
                                                        className={`w-9 h-9 ${isSelected ? '' : 'grayscale'}`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}