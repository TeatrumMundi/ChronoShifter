"use client";

import { RiotAccount } from "@/interfaces/productionTypes";
import SummonerIcon from "../common/Icons/SummonerIcon";
import { motion } from "framer-motion";

interface PlayerInfoProps {
    riotAccount: RiotAccount;
}

export default function PlayerInfo({ riotAccount }: PlayerInfoProps) {
    const { leagueAccountsDetails } = riotAccount.leagueAccount;
    const { gameName, tagLine } = riotAccount.riotAccountDetails;

    return (
        <motion.div
            className="relative w-full"
            style={{ fontFamily: "var(--font-verminVibes)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Slim Glass Card */}
            <div className="relative p-4 mb-5 rounded-xl 
                backdrop-blur-xl border border-white/20
                shadow-xl shadow-black/5
                bg-gradient-to-br from-white/8 via-white/5 to-white/3">
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/3 to-purple-400/3" />

                <div className="relative z-5 flex items-center gap-4">
                    {/* Summoner Icon Section */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20" />
                        <div className="relative p-1.5">
                            <SummonerIcon 
                                prfileIconID={leagueAccountsDetails.profileIconId} 
                                level={leagueAccountsDetails.summonerLevel.toString()}
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
            </div>
        </motion.div>
    );
}