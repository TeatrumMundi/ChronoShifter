"use client";

import { LeagueRank, RiotAccount } from "@/interfaces/productionTypes";
import { motion } from "framer-motion";
import Image from "next/image";
import { MatchHistory } from "./MatchHistory";

interface AccountProfileProps {
    riotAccount: RiotAccount;
}

export default function AccountProfile({ riotAccount }: AccountProfileProps) {
    const { leagueAccountsDetails, leagueSoloRank, leagueFlexRank } = riotAccount.leagueAccount;
    const { gameName, tagLine } = riotAccount.riotAccountDetails;

    const getRankedIconUrl = (tier: string) =>
        `/rankedIcons/${tier.toLowerCase()}.webp`;

    const summonerIconUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${leagueAccountsDetails.profileIconId}.jpg`;

    return (
        <>
            <motion.div
                className="relative w-full"
                style={{ fontFamily: "var(--font-verminVibes)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="relative z-10 p-6 mb-5 flex flex-col lg:flex-row items-center bg-gray-900/60 w-full gap-6 rounded-sm">
                    <SummonerIcon url={summonerIconUrl} level={leagueAccountsDetails.summonerLevel.toString()} />

                    <div className="flex-1 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="text-center lg:text-left">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest leading-tight">
                                {gameName}
                            </h2>
                            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 justify-center lg:justify-start">
                                <h3 className="text-lg md:text-xl text-white/90 tracking-widest">
                                    #{tagLine}
                                </h3>
                            </div>
                        </div>

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
            </motion.div>

            <div className="relative">
                <MatchHistory
                    riotAccount={riotAccount}
                />
            </div>
        </>
    );
}

interface RankSectionProps {
    title: string;
    ranked: LeagueRank;
    iconUrl: string;
}

function RankSection({ title, ranked, iconUrl }: RankSectionProps) {
    const getWinRateColor = (winRate: number) =>
        winRate >= 50 ? "text-green-400" : "text-red-500";

    return (
        <div className="flex items-center gap-4 text-white">
            <div className="border-l-2 border-white/20 h-30 hidden md:block" />
            <div className="flex flex-col items-center text-center">
                <span className="text-lg font-semibold tracking-widest">{title}</span>
                <span className="text-2xl mt-1 tracking-widest">
                    {ranked.tier} {ranked.rank}
                </span>
                <div className="flex gap-1 text-lg tracking-widest mt-1">
                    <span className="text-green-400">{ranked.wins}W</span>
                    <span>:</span>
                    <span className="text-red-500">{ranked.losses}L</span>
                    <span>
                        (
                        <span className={getWinRateColor(ranked.winRate)}>{ranked.winRate}%</span>
                        )
                    </span>
                </div>
                <span className="text-sm mt-1">{ranked.leaguePoints} LP</span>
            </div>
            <RankIcon url={iconUrl} title={title} />
        </div>
    );
}

function SummonerIcon({ url, level }: { url: string; level: string }) {
    return (
        <div className="relative flex-shrink-0">
            <div className="relative h-24 w-24">
                <Image
                    src={url}
                    alt="Summoner Icon"
                    fill
                    className="rounded-lg border border-gray-500 object-cover"
                    sizes="96px"
                    quality={50}
                    loading="eager"
                    priority
                />
            </div>
            <div className="absolute bottom-0 w-full bg-black/70 rounded-b-lg px-2 py-1 text-xs text-white text-center shadow-md tracking-widest font-sans">
                {level}
            </div>
        </div>
    );
}

function RankIcon({ url, title }: { url: string; title: string }) {
    return (
        <Image
            src={url}
            alt={`${title} Icon`}
            width={110}
            height={110}
            quality={50}
            loading="eager"
            sizes="110px"
            priority
        />
    );
}