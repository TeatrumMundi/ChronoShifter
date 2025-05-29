import { Participant } from "@/interfaces/productionTypes";
import { ItemPurchasedEvent, ItemSoldEvent, TimelineFrame } from "@/interfaces/proudctionTimeLapTypes";
import Image from "next/image";
import { getRuneTreeIconUrl } from "@/utils/getLeagueAssets/getLOLAssets";
import { ItemIcon } from "@/components/common/Icons/ItemIcon";
import { RuneIcon } from "@/components/common/Icons/RuneIcon";
import runesData from "@/utils/getLeagueAssets/runes.json";
import { useEffect, useState } from "react";

interface MatchBuildTabProps {
    mainPlayer: Participant;
}

type ItemEvent = (ItemPurchasedEvent | ItemSoldEvent) & {
    count?: number;
};

const getItemFromEvent = (event: ItemPurchasedEvent | ItemSoldEvent) => {
    return event.type === 'ITEM_PURCHASED' ? event.itemPurchased : event.itemSold;
};

const processItemEvents = (frames: TimelineFrame[]): ItemEvent[] => {
    const allItemEvents = frames
        .flatMap(frame => 
            frame.events.filter(event => 
                event.type === 'ITEM_PURCHASED' || event.type === 'ITEM_SOLD'
            ) as (ItemPurchasedEvent | ItemSoldEvent)[]
        )
        .sort((a, b) => a.timestamp - b.timestamp);

    const groupedEvents: ItemEvent[] = [];
    
    for (const itemEvent of allItemEvents) {
        const lastEvent = groupedEvents[groupedEvents.length - 1];
        const currentItem = getItemFromEvent(itemEvent);
        const lastItem = lastEvent ? getItemFromEvent(lastEvent) : null;
        
        if (lastEvent && 
            lastItem?.id === currentItem?.id && 
            lastEvent.type === itemEvent.type) {
            lastEvent.count = (lastEvent.count || 1) + 1;
        } else {
            groupedEvents.push({ ...itemEvent });
        }
    }
    
    return groupedEvents;
};

export function MatchBuildTab({ mainPlayer }: MatchBuildTabProps) {
    const [itemEvents, setItemEvents] = useState<ItemEvent[]>([]);

    const activeRuneTrees = runesData.filter(runeTree => {
        return mainPlayer.runes[0].runeTree.id === runeTree.id || 
               mainPlayer.runes[mainPlayer.runes.length - 1].runeTree?.id === runeTree.id;
    });

    // Load item events from timeline data
    useEffect(() => {
        if (mainPlayer.timelineData?.frames?.length) {
            setItemEvents(processItemEvents(mainPlayer.timelineData.frames));
        }
    }, [mainPlayer.timelineData]);

    const renderSectionHeader = (title: string) => (
        <div className="bg-blue-600 text-white px-4 py-1">
            <h2 className="text-lg font-semibold">{title}</h2>
        </div>
    );

    const renderEmptyState = (message: string) => (
        <div className="text-center text-gray-500 py-4">{message}</div>
    );

    return (
        <div className="p-0">
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

            {/* Item Timeline Section */}
            <div className="mt-6">
                {renderSectionHeader("Item Timeline")}
                
                <div className="p-4">
                    {mainPlayer.timelineData && mainPlayer.timelineData.frames.length > 0 ? (
                        <div>
                            {itemEvents.length === 0 ? (
                                renderEmptyState("No item events during this match")
                            ) : (
                                <div className="flex items-center gap-y-4 pb-2 flex-wrap">
                                    {Object.entries(
                                        itemEvents.reduce((groups, itemEvent) => {
                                            const timeInMinutes = Math.floor(itemEvent.timestamp / 60000);
                                            if (!groups[timeInMinutes]) {
                                                groups[timeInMinutes] = [];
                                            }
                                            groups[timeInMinutes].push(itemEvent);
                                            return groups;
                                        }, {} as Record<number, ItemEvent[]>)
                                    ).map(([minute, events], groupIndex, array) => (
                                        <div key={groupIndex} className="flex items-center">
                                            <div className="bg-white/10 rounded-sm p-2">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {events.map((itemEvent, index) => {
                                                        const isNegativeEvent = itemEvent.type === 'ITEM_SOLD';
                                                        const item = itemEvent.type === 'ITEM_PURCHASED' 
                                                            ? itemEvent.itemPurchased 
                                                            : itemEvent.itemSold;
                                                    
                                                        return (
                                                            <div key={index} className="relative">
                                                                <ItemIcon 
                                                                    item={item} 
                                                                    itemSize={32}
                                                                    className="w-8 h-8 sm:w-10 sm:h-10"
                                                                />
                                                                {isNegativeEvent && (
                                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                        <div className="w-full h-0.5 bg-red-600 rotate-45 transform"></div>
                                                                        <div className="w-full h-0.5 bg-red-600 -rotate-45 transform absolute"></div>
                                                                    </div>
                                                                )}
                                                                {itemEvent.count && itemEvent.count > 1 && (
                                                                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded font-bold min-w-[16px] text-center pointer-events-none">
                                                                        {itemEvent.count}x
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-xs font-mono text-gray-400">
                                                        {minute}m
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {groupIndex < array.length - 1 && (
                                                <span className="bg-white/10 p-2 px-3">
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        renderEmptyState("No timeline data available")
                    )}
                </div>
            </div>
        </div>
    );
}