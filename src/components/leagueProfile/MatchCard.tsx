"use client";

import { Participant, RecentMatch } from "@/interfaces/productionTypes";
import { calculatePerformanceScore, formatRole, getOrdinalPlacement, queueIdToGameMode, secToHHMMSS, timeAgo } from "@/utils/helpers";
import { MatchStats } from "./MatchStats";
import { ItemDisplay } from "./ItemDisplay";
import { ChampionIcon } from "./ChampionIcon";
import { ParticipantList } from "./ParticipantList";
import { RuneDisplay } from "./RuneDisplay";
import { AugmentDisplay } from "./AugmentDisplay";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { SummonerSpellDisplay } from "./SummonerSpellDisplay";

interface MatchCardProps {
    participant: Participant;
    match: RecentMatch;
    region: string;
}

export function MatchCard({ participant, match, region: region }: MatchCardProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"game" | "performance" | "build" | "stats">("game");

    const gameMode: string = queueIdToGameMode[match.matchDetails.queueId] || "Unknown";
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
                    <div className={`absolute left-0 top-0 h-full w-[30px] flex flex-col z-10`}>
                        <div className={`w-full h-full rounded-l-sm 
                            ${participant.win ? "bg-green-400" : "bg-red-400"}
                            ${isDetailsOpen ? "rounded-b-none" : ""}`} />

                        <button
                            className={`absolute left-1/2 -translate-x-1/2 bottom-1 z-20 rounded-xs p-0.15 shadow flex items-center justify-center
                            ${participant.win ? "bg-green-800 hover:bg-green-800/50" : "bg-red-800 hover:bg-red-800/50"}`}
                            onClick={() => setIsDetailsOpen((prev) => !prev)}
                        >
                            {isDetailsOpen ? (
                                <ChevronUp size={20} className="text-white" />
                            ) : (
                                <ChevronDown size={20} className="text-white" />
                            )}
                        </button>
                    </div>

                    {/* Main Card */}
                    <div
                        className={`p-5 pl-[34px] shadow-lg font-sans ${bgColor} flex-1 overflow-visible rounded-sm 
                            ${isDetailsOpen ? "rounded-b-none" : ""}`}
                    >
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div
                                className="flex flex-col items-center justify-center text-center tracking-wider
                                border-b sm:border-b-0 sm:border-r border-gray-500/50
                                pb-2 sm:pb-0 sm:pr-2
                                w-full sm:w-auto sm:flex-none sm:basis-[120px] sm:min-w-[100px] sm:max-w-[140px]
                                space-y-1"
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
                                            <div className="relative w-[72px] h-[72px]">
                                                <ChampionIcon champion={participant.champion} size={72} />
                                                <div className="absolute bottom-0 rounded-tr-sm rounded-bl-sm left-0 bg-black/50 text-white text-xs px-1">
                                                    {participant.champLevel}
                                                </div>
                                            </div>

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
                    <div
                        className="w-full bg-gray-900/95 rounded-b-sm p-4 border-t border-gray-700 animate-fade-in transition-all duration-300"
                    >
                        {/* Top row with 4 buttons */}
                        <div className="flex flex-row gap-3 mb-4">
                            <button
                                className={`flex-1 px-4 py-1 rounded-xs font-semibold transition ${
                                    activeTab === "game"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                                }`}
                                onClick={() => setActiveTab("game")}
                            >
                                Game
                            </button>
                            <button
                                className={`flex-1 px-4 py-1 rounded-xs font-semibold transition ${
                                    activeTab === "performance"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                                }`}
                                onClick={() => setActiveTab("performance")}
                            >
                                Performance
                            </button>
                            <button
                                className={`flex-1 px-4 py-1 rounded-xs font-semibold transition ${
                                    activeTab === "build"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                                }`}
                                onClick={() => setActiveTab("build")}
                            >
                                Build
                            </button>
                            <button
                                className={`flex-1 px-4 py-1 rounded-xs font-semibold transition ${
                                    activeTab === "stats"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                                }`}
                                onClick={() => setActiveTab("stats")}
                            >
                                Stats
                            </button>
                        </div>
                        <div className="text-white">
                            <strong>Match details:</strong>
                            <div>
                                {activeTab === "game" && (
                                    <div className="overflow-x-auto mt-2">
                                        <table className="min-w-full border border-gray-700 text-xs sm:text-sm">
                                            <thead>
                                                <tr className="bg-blue-900/80 text-blue-200">
                                                    <th className="px-2 py-1 border-b border-gray-700 text-left">Player</th>
                                                    <th className="px-2 py-1 border-b border-gray-700 text-center">Carry</th>
                                                    <th className="px-2 py-1 border-b border-gray-700 text-center">KDA</th>
                                                    <th className="px-2 py-1 border-b border-gray-700 text-center">Damage</th>
                                                    <th className="px-2 py-1 border-b border-gray-700 text-center">Gold</th>
                                                    <th className="px-2 py-1 border-b border-gray-700 text-center">CS</th>
                                                    <th className="px-2 py-1 border-b border-gray-700 text-center">Wards</th>
                                                    <th className="px-2 py-1 border-b border-gray-700 text-center">Items</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...Array(5)].map((_, i) => (
                                                    <tr key={i} className="bg-gray-900/70">
                                                        <td className="px-2 py-1 border-b border-gray-800">{match.matchDetails.participants[i].riotIdGameName}</td>
                                                        <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                            {calculatePerformanceScore(match.matchDetails.participants[i])}
                                                        </td>
                                                        <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                            {match.matchDetails.participants[i].kills}/
                                                            {match.matchDetails.participants[i].deaths}/
                                                            {match.matchDetails.participants[i].assists}
                                                            {" "}({match.matchDetails.participants[i].kda})
                                                        </td>
                                                        <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                            {match.matchDetails.participants[i].totalDamageDealtToChampions}
                                                        </td>
                                                        <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                            {match.matchDetails.participants[i].goldEarned}
                                                        </td>
                                                        <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                            {match.matchDetails.participants[i].totalMinionsKilled +
                                                                match.matchDetails.participants[i].neutralMinionsKilled}
                                                        </td>
                                                        <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                            {match.matchDetails.participants[i].wardsPlaced}
                                                        </td>
                                                        <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                            <div className="flex justify-center w-[40px] mx-auto">
                                                                <ItemDisplay 
                                                                    items={match.matchDetails.participants[i].items}
                                                                    itemSize={20}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {activeTab === "performance" && "Performance tab content goes here."}
                                {activeTab === "build" && "Build tab content goes here."}
                                {activeTab === "stats" && "Stats tab content goes here."}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}