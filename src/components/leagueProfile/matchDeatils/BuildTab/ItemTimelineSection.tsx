"use client";

import { memo, useMemo, useEffect, useState } from "react";
import { Participant } from "@/interfaces/productionTypes";
import { ItemPurchasedEvent, ItemSoldEvent, TimelineFrame, ParticipantTimelineData } from "@/interfaces/proudctionTimeLapTypes";
import { ItemIcon } from "@/components/common/Icons/ItemIcon";

interface ItemTimelineSectionProps {
    mainPlayer: Participant & { timelineData?: ParticipantTimelineData };
}

type ItemEvent = (ItemPurchasedEvent | ItemSoldEvent) & {
    count?: number;
};

const CONTROL_WARD_ID = 2055;

const processItemEvents = (frames: TimelineFrame[]): ItemEvent[] => {
    return frames
        .flatMap(frame => 
            frame.events.filter(event => 
                event.type === 'ITEM_PURCHASED' || event.type === 'ITEM_SOLD'
            ) as (ItemPurchasedEvent | ItemSoldEvent)[]
        )
        .sort((a, b) => a.timestamp - b.timestamp);
};

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

const EmptyState = memo(function EmptyState({ message }: { message: string }) {
    return (
        <div className="text-center text-white/60 py-8">
            <div className="text-4xl mb-2">📦</div>
            <p>{message}</p>
        </div>
    );
});

const ControlWardStats = memo(function ControlWardStats({ 
    controlWardsPurchased, 
    totalGoldSpent 
}: { 
    controlWardsPurchased: number; 
    totalGoldSpent: number; 
}) {
    if (controlWardsPurchased === 0) return null;

    return (
        <div className="mb-4 p-1 px-2 rounded-lg bg-purple-500/10 border border-purple-400/20">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-purple-300 font-medium">Control Wards:</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <span className="text-white font-bold">{controlWardsPurchased}</span>
                        <span className="text-white/60 text-sm">purchased</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-300 font-bold">{totalGoldSpent}</span>
                        <span className="text-yellow-300/60 text-sm">gold spent</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

const ItemEventGroup = memo(function ItemEventGroup({ 
    minute, 
    events, 
    isLast 
}: { 
    minute: number; 
    events: ItemEvent[]; 
    isLast: boolean;
}) {
    return (
        <div className="flex items-center">
            <div className="relative rounded-xl backdrop-blur-sm border border-white/20 p-2
                bg-gradient-to-br from-white/10 via-white/5 to-white/10 shadow-lg hover:shadow-xl transition-all duration-200">
                
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent" />
                
                <div className="relative z-5">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        {events.map((itemEvent, index) => {
                            const isNegativeEvent = itemEvent.type === 'ITEM_SOLD';
                            const item = itemEvent.type === 'ITEM_PURCHASED' 
                                ? itemEvent.itemPurchased 
                                : itemEvent.itemSold;
                        
                            return (
                                <div key={index} className="relative group">
                                    <div className="relative transition-transform duration-200 group-hover:scale-110">
                                        <ItemIcon 
                                            item={item} 
                                            itemSize={28}
                                            className="rounded-lg shadow-md"
                                        />
                                        {isNegativeEvent && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-full h-0.5 bg-red-500 rotate-45 transform shadow-lg"></div>
                                                <div className="w-full h-0.5 bg-red-500 -rotate-45 transform absolute shadow-lg"></div>
                                            </div>
                                        )}
                                        {itemEvent.count && itemEvent.count > 1 && (
                                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full font-bold min-w-[16px] text-center pointer-events-none shadow-lg">
                                                {itemEvent.count}x
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-mono text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded-full">
                            {minute}m
                        </span>
                    </div>
                </div>
            </div>
            
            {!isLast && (
                <div className="relative backdrop-blur-sm border-y border-white/20 w-5 h-2
                    bg-gradient-to-br from-white/10 via-white/5 to-white/10 shadow-lg">
                    <div className="absolute inset-0 rounded bg-gradient-to-r from-white/5 to-transparent" />
                </div>
            )}
        </div>
    );
});

export const ItemTimelineSection = memo(function ItemTimelineSection({ mainPlayer }: ItemTimelineSectionProps) {
    const [itemEvents, setItemEvents] = useState<ItemEvent[]>([]);

    // Load item events from timeline data
    useEffect(() => {
        if (mainPlayer.timelineData?.frames?.length) {
            setItemEvents(processItemEvents(mainPlayer.timelineData.frames));
        }
    }, [mainPlayer.timelineData]);

    const { groupedItemEvents, controlWardStats } = useMemo(() => {
        // First group by minute
        const groupedByMinute = itemEvents.reduce((groups, itemEvent) => {
            const timeInMinutes = Math.floor(itemEvent.timestamp / 60000);
            if (!groups[timeInMinutes]) {
                groups[timeInMinutes] = [];
            }
            groups[timeInMinutes].push(itemEvent);
            return groups;
        }, {} as Record<number, ItemEvent[]>);

        // Then group identical items within each minute
        const processedGroups = Object.entries(groupedByMinute).map(([minute, events]) => {
            const groupedEvents: ItemEvent[] = [];
            
            for (const itemEvent of events) {
                const item = itemEvent.type === 'ITEM_PURCHASED' ? itemEvent.itemPurchased : itemEvent.itemSold;
                const existingEvent = groupedEvents.find(e => {
                    const existingItem = e.type === 'ITEM_PURCHASED' ? e.itemPurchased : e.itemSold;
                    return existingItem.id === item.id && e.type === itemEvent.type;
                });
                
                if (existingEvent) {
                    existingEvent.count = (existingEvent.count || 1) + 1;
                } else {
                    groupedEvents.push({ ...itemEvent, count: 1 });
                }
            }
            
            return [minute, groupedEvents] as [string, ItemEvent[]];
        });

        // Calculate control ward stats from item events
        let controlWardsPurchased = 0;
        let totalGoldSpent = 0;

        itemEvents.forEach(event => {
            if (event.type === 'ITEM_PURCHASED') {
                const item = event.itemPurchased;
                if (item.id === CONTROL_WARD_ID) {
                    controlWardsPurchased += 1;
                    totalGoldSpent += item.price;
                }
            }
        });

        return {
            groupedItemEvents: processedGroups,
            controlWardStats: { controlWardsPurchased, totalGoldSpent }
        };
    }, [itemEvents]);

    return (
        <div className="relative rounded-xl backdrop-blur-xl border border-white/20 overflow-hidden
            bg-gradient-to-br from-white/5 via-white/3 to-white/5 shadow-xl shadow-black/10">
            
            <SectionHeader title="Item Timeline" />
            
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/2 to-transparent" />
            
            <div className="relative z-5 p-6">
                {mainPlayer.timelineData && mainPlayer.timelineData.frames.length > 0 ? (
                    <div>
                        {itemEvents.length === 0 ? (
                            <EmptyState message="No item events during this match" />
                        ) : (
                            <div className="flex items-center gap-0 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5">
                                {groupedItemEvents.map(([minute, events], groupIndex, array) => (
                                    <ItemEventGroup 
                                        key={groupIndex}
                                        minute={parseInt(minute)}
                                        events={events}
                                        isLast={groupIndex === array.length - 1}
                                    />
                                ))}
                            </div>
                        )}

                        <ControlWardStats 
                            controlWardsPurchased={controlWardStats.controlWardsPurchased}
                            totalGoldSpent={controlWardStats.totalGoldSpent}
                        />
                    </div>
                ) : (
                    <EmptyState message="No timeline data available" />
                )}
            </div>
        </div>
    );
});