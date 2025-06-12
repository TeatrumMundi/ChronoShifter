"use client";

import { LeagueRank, RiotAccount } from "@/interfaces/productionTypes";
import SummonerIcon from "../common/Icons/SummonerIcon";
import { motion } from "framer-motion";
import Image from "next/image";

interface PlayerInfoProps {
    riotAccount: RiotAccount;
}

export default function PlayerInfo({ riotAccount }: PlayerInfoProps) {
    const { leagueAccountsDetails, leagueSoloRank, leagueFlexRank } = riotAccount.leagueAccount;
    const { gameName, tagLine } = riotAccount.riotAccountDetails;

    const getRankedIconUrl = (tier: string) =>
        `/rankedIcons/${tier.toLowerCase()}.webp`;

    return (
        <motion.div
            className="relative w-full"
            style={{ fontFamily: "var(--font-verminVibes)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Main Glass Card */}
            <div className="relative p-6 mb-5 rounded-xl 
                backdrop-blur-xl border border-white/20
                shadow-2xl shadow-black/10
                bg-gradient-to-br from-white/8 via-white/5 to-white/3"
                style={{
                    background: `linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.12) 0%, 
                        rgba(255, 255, 255, 0.08) 50%,
                        rgba(255, 255, 255, 0.03) 100%),
                        rgba(255, 255, 255, 0.03)`
                }}
            >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/3 to-purple-400/3" />

                <div className="relative z-5 flex flex-col lg:flex-row items-center gap-6">
                    {/* Summoner Icon Section */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20" />
                        <div className="relative p-2">
                            <SummonerIcon 
                                prfileIconID={leagueAccountsDetails.profileIconId} 
                                level={leagueAccountsDetails.summonerLevel.toString()} 
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* Player Name Section */}
                        <div className="text-center lg:text-left">
                            <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur-sm border border-white/25 inline-block mb-3">
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest leading-tight">
                                    {gameName}
                                </h2>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <div className="px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/20">
                                    <h3 className="text-lg md:text-xl text-white/90 tracking-widest">
                                        #{tagLine}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Rank Sections */}
                        <div className="flex flex-col md:flex-row gap-6 items-center tracking-widest">
                            <RankSection
                                title="Solo Queue"
                                ranked={leagueSoloRank}
                                iconUrl={getRankedIconUrl(leagueSoloRank.tier)}
                            />
                            <RankSection
                                title="Flex Queue"
                                ranked={leagueFlexRank}
                                iconUrl={getRankedIconUrl(leagueFlexRank.tier)}
                            />
                        </div>
                    </div>
                </div>
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
            {/* Glass container for rank section */}
            <div className="rounded-xl backdrop-blur-sm border border-white/20 p-4
                bg-gradient-to-br from-white/8 to-white/3
                shadow-lg shadow-black/5">
                
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent" />
                
                <div className="relative z-5 flex items-center gap-4 text-white">
                    {/* Rank Info */}
                    <div className="flex flex-col items-center text-center">
                        {/* Title in a liquid bubble */}
                        <div className="px-3 py-1 mb-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
                            <span className="text-sm font-bold text-white/90 tracking-widest">
                                {title}
                            </span>
                        </div>
                        
                        {/* Rank */}
                        <div className="px-2 py-1 rounded-md bg-white/15 backdrop-blur-sm border border-white/25 mb-2">
                            <span className="text-lg font-semibold tracking-widest">
                                {ranked.tier} {ranked.rank}
                            </span>
                        </div>
                        
                        {/* W/L Record */}
                        <div className="flex gap-1 text-sm tracking-widest mb-1">
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
                            <span className="text-xs font-medium text-white/80">
                                {ranked.leaguePoints} LP
                            </span>
                        </div>
                    </div>

                    {/* Rank Icon */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20" />
                        <div className="relative p-2">
                            <Image
                                src={iconUrl}
                                alt={`${title} Icon`}
                                width={80}
                                height={80}
                                quality={50}
                                loading="eager"
                                sizes="80px"
                                priority
                                className="rounded-md"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}