"use client";

import { Participant, RecentMatch } from "@/interfaces/productionTypes";
import { formatRole, getOrdinalPlacement, queueIdToGameMode, secToHHMMSS, timeAgo } from "@/utils/helpers";
import { MatchStats } from "./MatchStats";
import { ItemDisplay } from "./ItemDisplay";
import { ChampionIcon } from "./ChampionIcon";
import { ParticipantList } from "./ParticipantList";
import { RuneDisplay } from "./RuneDisplay";
import { AugmentDisplay } from "./AugmentDisplay";

interface MatchCardProps {
    participant: Participant;
    match: RecentMatch;
    region: string;
}

export function MatchCard({ participant, match, region: region }: MatchCardProps) {
    const gameMode: string = queueIdToGameMode[match.matchDetails.queueId] || "Unknown";
    const isArena: boolean = gameMode === "Arena";
    const placement = participant.arenaStats?.placement;

    const winText = isArena && placement
        ? getOrdinalPlacement(placement)
        : participant.win ? "WIN" : "LOSS";

    const winTextColor = isArena
        ? placement && placement <= 4 ? "neon-green" : "neon-red"
        : participant.win ? "neon-green" : "neon-red";

    const bgColor = isArena
        ? placement && placement <= 4 ? "bg-green-900/90" : "bg-red-900/90"
        : participant.win ? "bg-green-900/90" : "bg-red-900/90";

    return (
        <div className="relative flex flex-col h-full w-full">
            {/* Vertical win/loss bar */}
            <div
                className={`absolute left-0 top-0 h-full w-[18px] rounded-l-sm
                    ${participant.win ? "bg-green-400" : "bg-red-400"}`}
            />

            {/* Main Card */}
            <div
                className={`p-5 rounded-sm shadow-lg font-sans ${bgColor} ml-[4px] flex-1 overflow-visible`}
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

                    {/* Main Content + Participant List */}
                    <div className="flex flex-col lg:flex-row flex-1 min-w-0 gap-4">
                        {/* Left: Champion + Items + Runes + Augments + Stats */}
                        <div className="flex flex-col gap-4 flex-1 sm:flex-row">
                            {/* Champion + Items + Runes + Augments */}
                            <div className="flex flex-col sm:flex-col xl:flex-row justify-center items-center gap-1 w-full sm:min-w-[200px] sm:max-w-[300px]">

                                {/* Champion Icon + Runes */}
                              <div className="flex items-center justify-center gap-1">
                                    <div className="relative w-[72px] h-[72px]">
                                        <ChampionIcon champion={participant.champion} size={72} />
                                        <div className="absolute bottom-0 rounded-tr-sm rounded-bl-sm left-0 bg-black/50 text-white text-xs px-1">
                                            {participant.champLevel}
                                        </div>
                                    </div>

                                    {/* Runes */}
                                    {participant.runes?.length > 0 && (
                                        <div className="flex-shrink-0 w-[40px] min-w-[40px]">
                                            <RuneDisplay runes={participant.runes} />
                                        </div>
                                    )}

                                </div>

                                {/* Items and Augments */}
                               <div className="flex flex-row sm:flex-col 2xl:flex-row justify-center items-center gap-3">
                                    <ItemDisplay items={participant.items} />
                                     {gameMode === "Arena" &&
                                        participant.arenaStats &&
                                        participant.arenaStats.augments.length > 0 && (
                                            <div className="w-full 2xl:w-auto">
                                                <AugmentDisplay augments={participant.arenaStats.augments} />
                                            </div>
                                        )}
                                </div>

                            </div>

                            {/* Stats */}
                            <div className="flex flex-col justify-center w-full min-w-0">
                                <MatchStats participant={participant} gameMode={gameMode} />
                            </div>
                        </div>

                        {/* Right: Participants */}
                        <div className="flex-1 w-full min-w-0 max-w-full sm:min-w-[280px] lg:w-[360px] lg:max-w-[380px] border-t lg:border-t-0 lg:border-l border-gray-500/50 pt-4 lg:pt-0 lg:pl-4">
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
    );
}