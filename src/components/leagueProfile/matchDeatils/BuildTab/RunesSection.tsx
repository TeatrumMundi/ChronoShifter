import { Participant } from "@/interfaces/productionTypes";
import Image from "next/image";
import { getRuneTreeIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { RuneIcon } from "@/components/common/Icons/RuneIcon";
import runesData from "@/utils/getLeagueAssets/runes.json";

interface RunesSectionProps {
    mainPlayer: Participant;
}

const renderSectionHeader = (title: string) => (
    <div className="bg-blue-600 text-white px-4 py-1">
        <h2 className="text-lg font-semibold">{title}</h2>
    </div>
);

export function RunesSection({ mainPlayer }: RunesSectionProps) {
    const activeRuneTrees = runesData.filter(runeTree => {
        return mainPlayer.runes[0].runeTree.id === runeTree.id || 
               mainPlayer.runes[mainPlayer.runes.length - 1].runeTree?.id === runeTree.id;
    });

    return (
        <>
            {renderSectionHeader("Runes")}
            
            <div className="p-4">
                <div className="flex gap-4 mb-2">
                    {activeRuneTrees.map((runeTree) => {
                        const selectedRune = mainPlayer.runes.find(rune => 
                            runeTree.slots.some(slot => 
                                slot.runes.some(slotRune => slotRune.id === rune.id)
                            )
                        );
                        
                        const treeIconUrl = selectedRune ? getRuneTreeIconUrl(selectedRune) : `https://ddragon.leagueoflegends.com/cdn/img/${runeTree.icon}`;
                        
                        return (
                            <div key={`title-${runeTree.id}`} className="px-3 flex-1 first:pl-0">
                                <div className="flex items-center justify-center gap-2">
                                    <Image
                                        src={treeIconUrl}
                                        alt={runeTree.name}
                                        width={20}
                                        height={20}
                                        className="w-5 h-5"
                                    />
                                    <h3 className="text-xs font-medium">{runeTree.name}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Rune trees */}
                <div className="flex gap-4">
                    {activeRuneTrees.map((runeTree) => (
                        <div key={runeTree.id} className="px-3 flex-1 first:pl-0">
                            {/* Sloty run */}
                            <div className="space-y-2">
                                {runeTree.slots.map((slot, slotIndex) => {                             
                                    return (
                                        <div key={slotIndex} className="flex gap-3 justify-center">
                                            {slot.runes.map((rune) => {
                                                const selectedRune = mainPlayer.runes.find(r => r.id === rune.id);
                                                
                                                // Na mobile ukryj nieaktywne runy
                                                if (!selectedRune) {
                                                    return (
                                                        <div 
                                                            key={rune.id} 
                                                            className="w-10 h-10 sm:block hidden"
                                                        >
                                                            <RuneIcon
                                                                size={40}
                                                                childrenSize={36}
                                                                rune={{ ...rune, runeTree }}
                                                                selectedRune={selectedRune}
                                                            />
                                                        </div>
                                                    );
                                                }
                                                
                                                return (
                                                    <RuneIcon
                                                        key={rune.id}
                                                        size={40}
                                                        childrenSize={36}
                                                        rune={{ ...rune, runeTree }}
                                                        selectedRune={selectedRune}
                                                    />
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}