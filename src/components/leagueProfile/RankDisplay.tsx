"use client";

import { LeagueRank } from "@/interfaces/productionTypes";
import Image from "next/image";
import { motion } from "framer-motion";

interface RankDisplayProps {
    leagueSoloRank: LeagueRank;
    leagueFlexRank: LeagueRank;
}

export default function RankDisplay({ leagueSoloRank, leagueFlexRank }: RankDisplayProps) {
    const getRankedIconUrl = (tier: string) =>
        `/rankedIcons/${tier.toLowerCase()}.webp`;

    return (
        <motion.div
            className="flex flex-col sm:flex-row lg:flex-col gap-4"
            style={{ fontFamily: "var(--font-verminVibes)" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
        >
            <div className="flex-1 lg:flex-none">
                <RankSection
                    title="Solo Queue"
                    ranked={leagueSoloRank}
                    iconUrl={getRankedIconUrl(leagueSoloRank.tier)}
                />
            </div>
            <div className="flex-1 lg:flex-none">
                <RankSection
                    title="Flex Queue"
                    ranked={leagueFlexRank}
                    iconUrl={getRankedIconUrl(leagueFlexRank.tier)}
                />
            </div>
        </motion.div>
    );
}

interface RankSectionProps {
    title: string;
    ranked: LeagueRank;
    iconUrl: string;
}

function RankSection({ title, ranked, iconUrl }: RankSectionProps) {
    const getWinRateColor = (winRate: number) =>
        winRate >= 50 ? "text-emerald-400" : "text-rose-400";

    return (
        <div className="relative">
            {/* Title bar at the top */}
            <div className="w-full px-4 py-2 rounded-t-xl bg-white/25 backdrop-blur-sm border border-white/30">
                <span className="text-sm font-bold text-white/90 tracking-widest whitespace-nowrap block text-center">
                    {title}
                </span>
            </div>
            
            {/* Glass container for rank section */}
            <div className="rounded-b-xl rounded-t-none backdrop-blur-sm border border-white/20 p-4
                bg-gradient-to-br from-white/8 to-white/3
                shadow-lg shadow-black/5">
                
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-b-xl bg-gradient-to-r from-white/5 to-transparent" />
                
                <div className="relative z-5 flex flex-col items-center text-white">
                    {/* Rank Info with Icon */}
                    <div className="flex items-center xl:flex-col 2xl:flex-row gap-3 xl:gap-2 2xl:gap-3 px-3 py-2 mb-3 rounded-lg bg-white/15 backdrop-blur-sm border border-white/25">
                        {/* Rank Text */}
                        <span className="text-lg font-semibold tracking-widest whitespace-nowrap">
                            {ranked.tier} {ranked.rank}
                        </span>
                        
                        {/* Rank Icon */}
                        <div className="relative">
                            <Image
                                src={iconUrl}
                                alt={`${title} Icon`}
                                width={50}
                                height={50}
                                quality={50}
                                loading="eager"
                                sizes="50px"
                                priority
                                className="rounded-md w-[50px] h-[50px] select-none"
                            />
                        </div>
                    </div>
                    
                    {/* W/L Record */}
                    <div className="flex gap-1 text-sm tracking-widest mb-2 justify-center">
                        <span className="text-emerald-400">{ranked.wins}W</span>
                        <span className="text-white/60">:</span>
                        <span className="text-rose-400">{ranked.losses}L</span>
                        <span className="text-white/60">
                            (
                            <span className={getWinRateColor(ranked.winRate)}>{ranked.winRate}%</span>
                            )
                        </span>
                    </div>
                    
                    {/* LP */}
                    <div className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/20">
                        <span 
                            className="text-xs font-medium text-white/80"
                            style={{ fontFamily: "var(--font-lato)" }}
                        >
                            {ranked.leaguePoints} LP
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}