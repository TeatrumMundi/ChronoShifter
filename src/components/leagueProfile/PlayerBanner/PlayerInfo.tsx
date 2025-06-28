"use client";

import SummonerIcon from "@/components/common/Icons/SummonerIcon";
import { UpdateButton } from "@/components/common/Buttons";
import { useRouter } from "next/navigation";
import React from "react";

interface PlayerInfoProps {
    gameName: string;
    tagLine: string;
    profileIconId: number;
    summonerLevel: number;
    region: string;
    isFromCache: boolean;
}

export default function PlayerInfo({ 
    gameName, 
    tagLine, 
    profileIconId, 
    summonerLevel,
    region,
    isFromCache
}: PlayerInfoProps) {
    const router = useRouter();

    // Handle refresh functionality
    const handleUpdate = async (): Promise<boolean> => {
        try {
            // Navigate to the same page with refresh parameter
            const currentUrl = `/lol/${tagLine}/${gameName}/${region}`;
            const refreshUrl = `${currentUrl}?refresh=true`;
            
            // Use router to navigate and refresh
            router.push(refreshUrl);
            router.refresh();
            
            // Return success - the page will reload with fresh data
            return true;
        } catch (error) {
            console.error('Failed to refresh data:', error);
            return false;
        }
    };
    return (
        <div
            className="relative w-full"
            style={{ fontFamily: "var(--font-verminVibes)" }}
        >
            {/* Slim Glass Card */}
            <div className="relative p-4 mb-5 rounded-xl 
                backdrop-blur-xl border border-white/20
                shadow-xl shadow-black/5
                bg-gradient-to-br from-white/8 via-white/5 to-white/3">
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/3 to-purple-400/3" />

                <div className="relative z-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Summoner Icon Section */}
                        <div className="relative">
                            <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20" />
                            <div className="relative p-1.5">
                                <SummonerIcon 
                                    prfileIconID={profileIconId} 
                                    level={summonerLevel.toString()}
                                    quality={50}
                                    loading="eager"
                                    priority={true}
                                    size={64}
                                />
                            </div>
                        </div>

                        {/* Player Name Section */}
                        <div className="flex-1">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm border border-white/25">
                                        <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest">
                                            {gameName}
                                        </h2>
                                    </div>
                                    {/* Cache Status Indicator */}
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isFromCache ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                                        <span className="text-xs text-white/70">
                                            {isFromCache ? 'Cached' : 'Fresh'}
                                        </span>
                                    </div>
                                </div>
                                <div className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 w-fit">
                                    <h3 className="text-sm md:text-base text-white/90 tracking-widest">
                                        #{tagLine}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update Button */}
                    <div className="relative w-full md:w-auto flex justify-center md:justify-end">
                        <UpdateButton 
                            onUpdate={handleUpdate}
                            size="md"
                            className="w-full md:w-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}