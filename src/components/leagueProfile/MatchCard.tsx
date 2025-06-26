"use client";

import { Participant, Match } from "@/interfaces/productionTypes";
import { formatRole, getOrdinalPlacement, secToHHMMSS, timeAgo } from "@/utils/helpers";
import { MatchStats } from "./MatchStats";
import { ItemDisplay } from "./ItemDisplay";
import { ChampionIcon } from "../common/Icons/ChampionIcon";
import { ParticipantList } from "./ParticipantList";
import { RuneDisplay } from "./RuneDisplay";
import { AugmentDisplay } from "./AugmentDisplay";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SummonerSpellDisplay } from "./SummonerSpellDisplay";
import { MatchDetails } from "./matchDeatils/MatchDetails";
import queuesData from "@/utils/getLeagueAssets/queues.json";
import { AnimatePresence } from "framer-motion";

interface MatchCardProps {
    participant: Participant;
    match: Match;
    region: string;
}

const getGameModeFromQueueId = (queueId: number): string => {
    const queue = queuesData.find(q => q.id === queueId);
    return queue?.shortName || "Unknown";
};

export function MatchCard({ participant, match, region: region }: MatchCardProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const gameMode: string = getGameModeFromQueueId(match.queueId);
    const isArena: boolean = gameMode === "Arena";
    const placement = participant.arenaStats?.placement;

    const winText = isArena && placement
        ? getOrdinalPlacement(placement)
        : participant.win ? "WIN" : "LOSS";

    const winTextColor = isArena
        ? placement && placement <= 4 ? "text-emerald-300" : "text-rose-300"
        : participant.win ? "text-emerald-300" : "text-rose-300";

    // Determine if this is a "win" (including arena top 4)
    const isWin = isArena ? (placement && placement <= 4) : participant.win;

    return (
        <>
            <div className="flex flex-col h-full w-full">
                {/* Main Card Container */}
                <div className="relative flex flex-col w-full">
                    
                    {/* Main Glass Card */}
                    <div
                        className={`relative p-4 py-2 font-sans h-[200px] sm:h-[400px] lg:h-[170px] xl:h-[130px] rounded-xl 
                            backdrop-blur-xl border
                            shadow-2xl shadow-black/10
                            ${isDetailsOpen ? "rounded-b-none" : ""}
                            ${isWin 
                                ? "bg-emerald-500/15 border-emerald-400/30" 
                                : "bg-rose-500/15 border-rose-400/30"
                            }`}
                        style={{
                            background: `linear-gradient(135deg, 
                                ${isWin ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)'} 0%, 
                                ${isWin ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 127, 0.08)'} 100%),
                                rgba(255, 255, 255, 0.03)`
                        }}
                    >
                        {/* Subtle glow effect */}
                        <div className={`absolute inset-0 rounded-xl
                            ${isWin 
                                ? 'bg-gradient-to-r from-emerald-400/3 to-green-400/3' 
                                : 'bg-gradient-to-r from-rose-400/3 to-red-400/3'
                            }
                            ${isDetailsOpen ? "rounded-b-none" : ""}`} />

                        <div className="relative z-5 flex flex-col sm:flex-row gap-4 w-full pr-8">
                            {/* Game Info Section */}
                            <div className="flex flex-col items-center justify-center text-center
                                border-b sm:border-b-0 sm:border-r border-white/20
                                pb-3 sm:pb-0 sm:pr-4
                                w-full sm:w-auto sm:flex-none sm:basis-[120px] sm:min-w-[100px] sm:max-w-[140px]">
                                
                                {/* Game Mode - liquid bubble */}
                                <div className="px-3 py-1 mb-1 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
                                    <div className="text-sm font-bold text-white/90">
                                        {gameMode}
                                    </div>
                                </div>

                                {/* Win/Loss text */}
                                <div className={`text-xs font-semibold ${winTextColor}`}>
                                    {winText}
                                    <span className="text-xs text-white/70 ml-1">
                                        {formatRole(participant.teamPosition)}
                                    </span>
                                </div>

                                {/* Role */}
                                <div className="text-xs font-medium text-white/80">
                                    
                                </div>

                                {/* Time Ago */}
                                <div className="text-xs text-white/60">
                                    {timeAgo(match.gameEndTimestamp)}
                                </div>

                                {/* Duration */}
                                <div className="text-xs font-medium text-white/80">
                                    {secToHHMMSS(match.gameDuration)}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex flex-col lg:flex-row flex-1 min-w-0 gap-4">
                                {/* Champion & Items Section */}
                                <div className="flex flex-col gap-3 flex-1 sm:flex-row items-center justify-center">
                                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 w-full sm:min-w-[180px] justify-center">

                                        {/* Champion + Spells + Items Row - Mobile first, then responsive */}
                                        <div className="flex items-center justify-center gap-2 flex-wrap">
                                            {/* Champion */}
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20" />
                                                <div className="relative p-1 flex items-center justify-center">
                                                    <div className="w-[56px] h-[56px] flex items-center justify-center">
                                                        <ChampionIcon 
                                                            champion={participant.champion} 
                                                            size={56} 
                                                            level={participant.champLevel}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Summoner Spells */}
                                            {(participant.summonerSpell1.id !== 0 || participant.summonerSpell2.id !== 0) && (
                                                <div className="relative rounded-md bg-white/10 backdrop-blur-sm border border-white/20 p-1">
                                                    <SummonerSpellDisplay
                                                        summonerSpell1={participant.summonerSpell1}
                                                        summonerSpell2={participant.summonerSpell2}
                                                        summonerspellIconsSize={24}
                                                        boxSize={28}
                                                    />
                                                </div>
                                            )}

                                            {/* Runes */}
                                            {participant.runes?.length > 0 && (
                                                <div className="relative rounded-md bg-white/10 backdrop-blur-sm border border-white/20 p-1">
                                                    <RuneDisplay boxSize={28} keyStoneIconSize={26} secendaryRuneIconSize={18} runes={participant.runes} />
                                                </div>
                                            )}

                                            {/* Items - now inline on mobile */}
                                            <div className="flex justify-center items-center">
                                                <div className="rounded-md bg-white/10 backdrop-blur-sm border border-white/20 p-1">
                                                    <ItemDisplay itemSize={28} items={participant.items} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Augments - separate row for Arena, hide on mobile, show on larger screens */}
                                        {gameMode === "Arena" && participant.arenaStats && participant.arenaStats.augments.length > 0 && (
                                            <div className="hidden sm:flex justify-center items-center">
                                                <div className="rounded-md bg-white/10 backdrop-blur-sm border border-white/20 p-1">
                                                    <AugmentDisplay itemSize={28} augments={participant.arenaStats.augments} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Stats Section */}
                                <div className="hidden sm:flex flex-col justify-center w-full min-w-[220px] lg:max-w-[140px] xl:max-w-[280px]">
                                    <div className="rounded-md bg-white/10 backdrop-blur-sm border border-white/20 p-1">
                                        <MatchStats participant={participant} gameMode={gameMode} />
                                    </div>
                                </div>

                                {/* Participants Section */}
                                <div className="hidden sm:flex flex-col justify-center w-full min-w-0 max-w-full sm:min-w-[160px] lg:min-w-[140px] lg:max-w-[260px] xl:min-w-[200px] xl:max-w-[260px] border-t lg:border-t-0 lg:border-l border-white/20 pt-2 lg:pt-0 lg:pl-2 pr-6">
                                    <div className="flex items-center w-full">
                                        <ParticipantList
                                            participants={match.participants}
                                            gameMode={gameMode}
                                            region={region}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expand/Collapse Button Bar - Right Side */}
                        <button 
                            className="absolute top-1/2 -translate-y-1/2 right-2 z-20
                                w-5 h-12 rounded-lg
                                bg-white/15 backdrop-blur-sm border border-white/20
                                hover:bg-white/25 hover:
                                transition-all duration-200 ease-out
                                shadow-md shadow-black/5
                                flex items-center justify-center group"
                            onClick={() => setIsDetailsOpen((prev) => !prev)}
                        >
                            <ChevronDown 
                                size={14} 
                                className={`text-white/70 group-hover:text-white transition-all duration-200 ease-out ${
                                    isDetailsOpen ? "rotate-180" : "rotate-0"
                                }`} 
                            />
                        </button>
                    </div>
                </div>

                {/* Match details - glass expandable section */}
                <div>
                    <AnimatePresence mode="wait">
                        {isDetailsOpen && (
                            <MatchDetails
                                key="match-details" // Important: add a key
                                match={match}
                                mainPlayerPUUID={participant.puuid}
                                region={region}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}