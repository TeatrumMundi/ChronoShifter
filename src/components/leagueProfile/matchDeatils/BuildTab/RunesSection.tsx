import { memo, useMemo } from "react";
import { Participant, Rune } from "@/interfaces/productionTypes";
import Image from "next/image";
import { getRuneTreeIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { RuneIcon } from "@/components/common/Icons/RuneIcon";
import { PerkIcon } from "@/components/common/Icons/PerkIcon";
import runesData from "@/utils/getLeagueAssets/runes.json";
import statPerksData from "@/utils/getLeagueAssets/statPerks.json";

// --- Custom types for runesData structure ---
interface RuneTreeSlot {
    runes: Rune[];
}
interface RuneTreeData {
    id: number;
    key: string;
    icon: string;
    name: string;
    slots: RuneTreeSlot[];
}

interface RunesSectionProps {
    mainPlayer: Participant;
}

const SectionHeader = memo(function SectionHeader({ title }: { title: string }) {
    return (
        <div className="relative rounded-t-xl backdrop-blur-sm border-b border-white/20 overflow-hidden
            bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-transparent" />
            <div className="relative z-5 px-4 py-1">
                <h2 className="text-lg font-semibold text-blue-200">{title}</h2>
            </div>
        </div>
    );
});

const RuneTreeDisplay = memo(function RuneTreeDisplay({ 
    runeTree, 
    mainPlayer 
}: { 
    runeTree: RuneTreeData; 
    mainPlayer: Participant 
}) {
    const selectedRune = useMemo(() => 
        mainPlayer.runes.find(rune => 
            runeTree.slots.some((slot) => 
                slot.runes.some((slotRune) => slotRune.id === rune.id)
            )
        ), [runeTree.slots, mainPlayer.runes]
    );
    
    const treeIconUrl = useMemo(() => 
        selectedRune ? getRuneTreeIconUrl(selectedRune) : `https://ddragon.leagueoflegends.com/cdn/img/${runeTree.icon}`,
        [selectedRune, runeTree.icon]
    );
    
    return (
        <div className="flex items-start">
            <div className="flex flex-col items-center">
                {/* Tree header with glass effect */}
                <div className="mb-4 p-3 rounded-xl backdrop-blur-sm border border-white/20 
                    bg-gradient-to-br from-white/10 via-white/5 to-white/10 shadow-lg">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="relative">
                            <Image
                                src={treeIconUrl}
                                alt={runeTree.name}
                                width={32}
                                height={32}
                                className="w-8 h-8"
                            />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent" />
                        </div>
                        <h3 className="text-sm font-medium text-center w-24 truncate text-white/90">{runeTree.name}</h3>
                    </div>
                </div>
                
                {/* Tree content with improved spacing */}
                <div className="w-32">
                    <div className="space-y-4">
                        {runeTree.slots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex items-center justify-center gap-2">
                                {slot.runes.map((rune) => {
                                    const selectedRune = mainPlayer.runes.find(r => r.id === rune.id);
                                    
                                    if (!selectedRune) {
                                        return (
                                            <div 
                                                key={rune.id} 
                                                className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-60 transition-opacity duration-200"
                                            >
                                                <RuneIcon
                                                    size={36}
                                                    childrenSize={32}
                                                    rune={{ ...rune, runeTree }}
                                                    selectedRune={selectedRune}
                                                />
                                            </div>
                                        );
                                    }
                                    
                                    return (
                                        <div 
                                            key={rune.id}
                                            className="w-10 h-10 flex items-center justify-center relative"
                                        >
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 blur-sm" />
                                            <RuneIcon
                                                size={36}
                                                childrenSize={32}
                                                rune={{ ...rune, runeTree }}
                                                selectedRune={selectedRune}
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
    );
});

const StatPerksDisplay = memo(function StatPerksDisplay({ mainPlayer }: { mainPlayer: Participant }) {
    const statPerkCategories = useMemo(() => {
        // Null checks for statPerks
        if (!mainPlayer.statPerks) {
            return [];
        }

        return [
            {
                name: "Offense",
                perks: statPerksData.offense || [],
                selectedPerk: mainPlayer.statPerks.offense
            },
            {
                name: "Flex", 
                perks: statPerksData.flex || [],
                selectedPerk: mainPlayer.statPerks.flex
            },
            {
                name: "Defense",
                perks: statPerksData.defense || [],
                selectedPerk: mainPlayer.statPerks.defense
            }
        ].filter(category => category.selectedPerk); // Filter out categories with no selected perk
    }, [mainPlayer.statPerks]);

    // Return null if no stat perks available
    if (!mainPlayer.statPerks || statPerkCategories.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col items-center">
            {/* Stat perks header with glass effect */}
            <div className="mb-4 p-3 rounded-xl backdrop-blur-sm border border-white/20 
                bg-gradient-to-br from-white/10 via-white/5 to-white/10 shadow-lg">
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-2xl">⚡</div>
                    <h3 className="text-sm font-medium text-center text-white/90">Stat Shards</h3>
                </div>
            </div>
            
            {/* Stat perks content */}
            <div className="w-24">
                <div className="space-y-4">
                    {statPerkCategories.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="flex items-center justify-center gap-2">
                            {category.perks.map((perk) => {
                                // Null check for selectedPerk
                                const isSelected = category.selectedPerk && perk.id === category.selectedPerk.id;
                                
                                if (!isSelected) {
                                    return (
                                        <div 
                                            key={perk.id} 
                                            className="w-6 h-6 flex items-center justify-center opacity-40 hover:opacity-60 transition-opacity duration-200"
                                        >
                                            <PerkIcon
                                                size={20}
                                                childrenSize={18}
                                                perk={perk}
                                                isSelected={isSelected}
                                            />
                                        </div>
                                    );
                                }
                                
                                return (
                                    <div 
                                        key={perk.id}
                                        className="w-6 h-6 flex items-center justify-center relative"
                                    >
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-300/20 blur-sm" />
                                        <PerkIcon
                                            size={20}
                                            childrenSize={18}
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
    );
});

export const RunesSection = memo(function RunesSection({ mainPlayer }: RunesSectionProps) {
    const activeRuneTrees = useMemo(() => 
        (runesData as RuneTreeData[]).filter(runeTree => {
            // Add null checks for the runes and their runeTree properties
            const firstRune = mainPlayer.runes?.[0];
            const lastRune = mainPlayer.runes?.[mainPlayer.runes.length - 1];
            
            return (firstRune?.runeTree?.id === runeTree.id) || 
                   (lastRune?.runeTree?.id === runeTree.id);
        }), [mainPlayer.runes]
    );
    
    // Add safety check to prevent rendering if no runes exist
    if (!mainPlayer.runes || mainPlayer.runes.length === 0) {
        return (
            <div className="relative rounded-xl backdrop-blur-xl border border-white/20 overflow-hidden
                bg-gradient-to-br from-white/5 via-white/3 to-white/5 shadow-xl shadow-black/10">
                
                <SectionHeader title="Runes" />
                
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/2 to-transparent" />
                
                <div className="relative z-5 p-6 text-center text-white/70">
                    <p>Runes data not available for this match</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative rounded-xl backdrop-blur-xl border border-white/20 overflow-hidden
            bg-gradient-to-br from-white/5 via-white/3 to-white/5 shadow-xl shadow-black/10">
            
            <SectionHeader title="Runes" />
            
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/2 to-transparent" />
            
            <div className="relative z-5 p-6">
                {/* Horizontal scroll for runes/stat perks */}
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5">
                    <div className="flex items-start justify-center gap-8 min-w-fit">
                        {activeRuneTrees.map((runeTree, index) => (
                            <div key={runeTree.id} className="flex items-start">
                                <RuneTreeDisplay runeTree={runeTree} mainPlayer={mainPlayer} />
                                
                                {/* Separator between rune trees */}
                                {index < activeRuneTrees.length - 1 && (
                                    <div className="w-px h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-6" />
                                )}
                            </div>
                        ))}
                        
                        {/* Main separator between runes and stat perks */}
                        <div className="w-px h-64 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent mx-6" />
                        
                        {/* Stat Perks section */}
                        <StatPerksDisplay mainPlayer={mainPlayer} />
                    </div>
                </div>
            </div>
        </div>
    );
});