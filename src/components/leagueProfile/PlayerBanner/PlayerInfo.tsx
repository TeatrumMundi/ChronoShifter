"use client";

import SummonerIcon from "@/components/common/Icons/SummonerIcon";
import { UpdateButton } from "@/components/common/Buttons";
import React from "react";

interface PlayerInfoProps {
    gameName: string;
    tagLine: string;
    profileIconId: number;
    summonerLevel: number;
}

export default function PlayerInfo({ 
    gameName, 
    tagLine, 
    profileIconId, 
    summonerLevel 
}: PlayerInfoProps) {
    // Simulate an update function (you can replace this with actual API call)
    const handleUpdate = async (): Promise<boolean> => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Randomly succeed or fail for demo purposes
        // In real implementation, this would be your actual API call
        return Math.random() > 0.3; // 70% success rate
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
                                <div className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm border border-white/25 w-fit">
                                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest">
                                        {gameName}
                                    </h2>
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