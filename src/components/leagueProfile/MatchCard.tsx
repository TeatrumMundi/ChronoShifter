"use client";

import { Participant, RecentMatch } from "@/interfaces/productionTypes";
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

interface MatchCardProps {
    participant: Participant;
    match: RecentMatch;
    region: string;
}

const getGameModeFromQueueId = (queueId: number): string => {
    const queue = queuesData.find(q => q.id === queueId);
    return queue?.shortName || "Unknown";
};

export function MatchCard({ participant, match, region: region }: MatchCardProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const gameMode: string = getGameModeFromQueueId(match.matchDetails.queueId);
    const isArena: boolean = gameMode === "Arena";
    const placement = participant.arenaStats?.placement;

    const winText = isArena && placement
        ? getOrdinalPlacement(placement)
        : participant.win ? "WIN" : "LOSS";

    const winTextColor = isArena
        ? placement && placement <= 4 ? "neon-green" : "neon-red"
        : participant.win ? "text-green-300" : "text-red-300";

    const bgColor = isArena
        ? placement && placement <= 4 ? "bg-green-900/90" : "bg-red-900/90"
        : participant.win ? "bg-green-900/90" : "bg-red-900/90";

    return (
        <>
            <div className="flex flex-col h-full w-full">
                {/* Main Card + Vertical Bar together */}
                <div className="relative flex flex-col w-full">
                    {/* Vertical win/loss bar */}
                    <button 
                        className={`absolute left-0 top-0 h-full w-[30px] flex flex-col z-10 cursor-pointer group`}
                        onClick={() => setIsDetailsOpen((prev) => !prev)}
                    >
                        <div className={`w-full h-full rounded-l-sm transition-opacity duration-200
                            ${participant.win ? "bg-green-400 group-hover:bg-green-300" : "bg-red-400 group-hover:bg-red-300"}
                            ${isDetailsOpen ? "rounded-b-none" : ""}`} />

                        <div
                            className={`absolute left-1/2 -translate-x-1/2 bottom-1 z-20 rounded-xs p-0.15 shadow flex items-center justify-center pointer-events-none
                            ${participant.win ? "bg-green-800" : "bg-red-800"}`}
                        >
                            <ChevronDown 
                                size={20} 
                                className={`text-white transition-transform duration-300 ease-in-out ${
                                    isDetailsOpen ? "rotate-180" : "rotate-0"
                                }`} 
                            />
                        </div>
                    </button>

                    {/* Main Card */}
                    <div
                        className={`p-3 pl-[34px] shadow-lg font-sans ${bgColor} flex-1 overflow-visible rounded-sm 
                            ${isDetailsOpen ? "rounded-b-none" : ""}`}
                    >
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div
                                className="flex flex-col items-center justify-center text-center tracking-wider
                                border-b sm:border-b-0 sm:border-r border-gray-500/50
                                pb-2 sm:pb-0 sm:pr-2
                                w-full sm:w-auto sm:flex-none sm:basis-[120px] sm:min-w-[100px] sm:max-w-[140px]
                                "
                            >
                                {/* Game Mode */}
                                <div className="whitespace-normal text-sm sm:text-lg font-semibold text-gray-100">
                                    {gameMode}
                                </div>

                                {/* Role */}
                                <div className="whitespace-normal text-xs sm:text-sm font-semibold text-gray-100">
                                    {formatRole(participant.teamPosition)}
                                </div>

                                {/* Time Ago */}
                                <div className="whitespace-normal text-[9px] sm:text-xs text-gray-100">
                                    {timeAgo(match.matchDetails.gameEndTimestamp)}
                                </div>

                                {/* Duration & Win/Lose */}
                                <div className="whitespace-normal text-xs sm:text-sm font-medium">
                                    <span className={winTextColor}>{winText}</span> {secToHHMMSS(match.matchDetails.gameDuration)}
                                </div>
                            </div>

                            {/* Main Content + Participant List + Stats*/}
                            <div className="flex flex-col lg:flex-row flex-1 min-w-0 gap-4">
                                {/* Left: Champion + Items + Runes + Augments */}
                                <div className="flex flex-col gap-4 flex-1 sm:flex-row items-center justify-center">
                                    {/* Champion + Items + Runes + Augments */}
                                    <div className="flex flex-row lg:flex-col  xl:flex-row gap-1 w-full sm:min-w-[200px] justify-center">

                                        {/* Champion Icon + Runes + SummonerSpells */}
                                        <div className="flex items-center justify-center gap-1">
                                            <ChampionIcon champion={participant.champion} size={72} level={participant.champLevel}/>

                                            {/* Summoner Spells */}
                                            {(participant.summonerSpell1.id !== 0 || participant.summonerSpell2.id !== 0) && (
                                                <div className="flex-shrink-0 w-[32px] min-w-[32px]">
                                                    <SummonerSpellDisplay
                                                        summonerSpell1={participant.summonerSpell1}
                                                        summonerSpell2={participant.summonerSpell2}
                                                        summonerspellIconsSize={28}
                                                        boxSize={32}
                                                    />
                                                </div>
                                            )}

                                            {/* Runes */}
                                            {participant.runes?.length > 0 && (
                                                <div className="flex-shrink-0 w-[32px] min-w-[32px]">
                                                    <RuneDisplay boxSize={32} keyStoneIconSize={30} secendaryRuneIconSize={20} runes={participant.runes} />
                                                </div>
                                            )}

                                        </div>

                                        {/* Items and Augments */}
                                        <div className="flex flex-row sm:flex-col 2xl:flex-row justify-center items-center">
                                            <ItemDisplay itemSize={32} items={participant.items} />
                                            {gameMode === "Arena" && participant.arenaStats && participant.arenaStats.augments.length > 0 && (
                                                <div className="w-full 2xl:w-auto">
                                                    <AugmentDisplay itemSize={32} augments={participant.arenaStats.augments} />
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    
                                </div>
                                {/* Stats */}
                                    <div className="flex flex-col justify-center w-full min-w-0">
                                        <MatchStats participant={participant} gameMode={gameMode} />
                                    </div>

                                {/* Right: Participants */}
                                <div className="flex-1 w-full min-w-0 max-w-full sm:min-w-[280px] border-t lg:border-t-0 lg:border-l border-gray-500/50 pt-4 lg:pt-0 lg:pl-4">
                                    <ParticipantList
                                        participants={match.matchDetails.participants}
                                        gameMode={gameMode}
                                        region={region}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Match details - expandable box */}
                {isDetailsOpen && (
                    <MatchDetails match={match} mainPlayerPUUID={participant.puuid} region={region}/>
                )}
            </div>
        </>
    );
}