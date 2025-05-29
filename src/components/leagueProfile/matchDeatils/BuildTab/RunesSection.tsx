import { Participant } from "@/interfaces/productionTypes";
import Image from "next/image";
import { getRuneTreeIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { RuneIcon } from "@/components/common/Icons/RuneIcon";
import { PerkIcon } from "@/components/common/Icons/PerkIcon";
import runesData from "@/utils/getLeagueAssets/runes.json";
import statPerksData from "@/utils/getLeagueAssets/statPerks.json";

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

    const statPerkCategories = [
        {
            name: "Offense",
            perks: statPerksData.offense,
            selectedPerk: mainPlayer.statPerks.offense
        },
        {
            name: "Flex", 
            perks: statPerksData.flex,
            selectedPerk: mainPlayer.statPerks.flex
        },
        {
            name: "Defense",
            perks: statPerksData.defense,
            selectedPerk: mainPlayer.statPerks.defense
        }
    ];

    return (
        <>
            {renderSectionHeader("Runes")}
            
            <div className="p-4">
                {/* Main container*/}
                <div className="flex items-start justify-center gap-2 sm:gap-6">
                    {activeRuneTrees.map((runeTree, index) => {
                        const selectedRune = mainPlayer.runes.find(rune => 
                            runeTree.slots.some(slot => 
                                slot.runes.some(slotRune => slotRune.id === rune.id)
                            )
                        );
                        
                        const treeIconUrl = selectedRune ? getRuneTreeIconUrl(selectedRune) : `https://ddragon.leagueoflegends.com/cdn/img/${runeTree.icon}`;
                        
                        return (
                            <div key={runeTree.id} className="flex items-start">
                                <div className="flex flex-col items-center">
                                    {/* Tree header */}
                                    <div className="mb-2 sm:mb-4">
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <Image
                                                src={treeIconUrl}
                                                alt={runeTree.name}
                                                width={24}
                                                height={24}
                                                className="w-5 h-5 sm:w-6 sm:h-6"
                                            />
                                            <h3 className="text-xs font-medium text-center w-20 sm:w-32 truncate">{runeTree.name}</h3>
                                        </div>
                                    </div>
                                    
                                    {/* Tree content*/}
                                    <div className="w-20 sm:w-32">
                                        <div className="space-y-2 sm:space-y-3">
                                            {runeTree.slots.map((slot, slotIndex) => {                             
                                                return (
                                                    <div key={slotIndex} className="flex items-center justify-center gap-0.5 sm:gap-1">
                                                        {slot.runes.map((rune) => {
                                                            const selectedRune = mainPlayer.runes.find(r => r.id === rune.id);
                                                            
                                                            if (!selectedRune) {
                                                                return (
                                                                    <div 
                                                                        key={rune.id} 
                                                                        className="w-8 h-8 sm:w-10 sm:h-10 sm:flex hidden items-center justify-center"
                                                                    >
                                                                        <RuneIcon
                                                                            size={32}
                                                                            childrenSize={28}
                                                                            rune={{ ...rune, runeTree }}
                                                                            selectedRune={selectedRune}
                                                                        />
                                                                    </div>
                                                                );
                                                            }
                                                            
                                                            return (
                                                                <div 
                                                                    key={rune.id}
                                                                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                                                                >
                                                                    <RuneIcon
                                                                        size={32}
                                                                        childrenSize={28}
                                                                        rune={{ ...rune, runeTree }}
                                                                        selectedRune={selectedRune}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Separator between rune trees - hidden on mobile */}
                                {index < activeRuneTrees.length - 1 && (
                                    <div className="w-px h-64 bg-gray-600 mx-2 sm:mx-4 hidden sm:block"></div>
                                )}
                            </div>
                        );
                    })}
                    
                    {/* Main separator between runes and stat perks - hidden on mobile */}
                    <div className="w-px h-64 bg-blue-600 mx-1 sm:mx-4 hidden sm:block"></div>
                    
                    {/* Stat Perks section */}
                    <div className="flex flex-col items-center">
                        {/* Stat perks header */}
                        <div className="mb-2 sm:mb-4">
                            <div className="flex flex-col items-center justify-center gap-1">
                                <span className="text-yellow-400 text-lg sm:text-xl">⚡</span>
                                <h3 className="text-xs font-medium text-center">Stat Shards</h3>
                            </div>
                        </div>
                        
                        {/* Stat perks content - responsive width */}
                        <div className="w-16 sm:w-24">
                            <div className="space-y-2 sm:space-y-3">
                                {statPerkCategories.map((category, categoryIndex) => (
                                    <div key={categoryIndex} className="flex items-center justify-center gap-0.5 sm:gap-1">
                                        {category.perks.map((perk) => {
                                            const isSelected = perk.id === category.selectedPerk.id;
                                            
                                            if (!isSelected) {
                                                return (
                                                    <div 
                                                        key={perk.id} 
                                                        className="w-4 h-4 sm:w-6 sm:h-6 sm:flex hidden items-center justify-center"
                                                    >
                                                        <PerkIcon
                                                            size={16}
                                                            childrenSize={14}
                                                            perk={perk}
                                                            isSelected={isSelected}
                                                        />
                                                    </div>
                                                );
                                            }
                                            
                                            return (
                                                <div 
                                                    key={perk.id}
                                                    className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center"
                                                >
                                                    <PerkIcon
                                                        size={16}
                                                        childrenSize={14}
                                                        perk={perk}
                                                        isSelected={isSelected}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}