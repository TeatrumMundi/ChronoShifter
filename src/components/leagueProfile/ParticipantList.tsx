import { Participant } from "@/interfaces/productionTypes";
import Link from "next/link";
import React, { useMemo } from "react";
import { ChampionIcon } from "./ChampionIcon";

/**
 * Renders a participant list based on the current game mode.
 */
export function ParticipantList({participants, gameMode, region,}: {
    participants: Participant[];
    gameMode: string;
    region: string;
}) {
/*     if (gameMode === "Arena") {
        return (
            <ArenaParticipantList
                participants={participants}
                server={server}
            />
        );
    } */

    return (
        <StandardParticipantList
            participants={participants}
            region={region}
        />
    );
}

/**
 * Classic 5v5 mainPage:
 * - Left column: one team
 * - Right column: opposing team
 */
function StandardParticipantList({participants, region,}: { participants: Participant[]; region: string; }) {
    const teams = useMemo(() => {
        const team100: Participant[] = [];
        const team200: Participant[] = [];

        participants.forEach((p) => {
            if (p.teamId === 100) team100.push(p);
            else if (p.teamId === 200) team200.push(p);
        });

        return {
            leftTeam: team100,
            rightTeam: team200,
        };
    }, [participants]);

    return (
        <div className="h-full w-full text-xs text-gray-400 tracking-normal">
            <div className="grid grid-rows-5 gap-1 h-full">
                {Array.from({ length: 5 }).map((_, i) => {
                    const leftPlayer = teams.leftTeam[i];
                    const rightPlayer = teams.rightTeam[i];

                    return (
                        <div
                            key={i}
                            className="flex flex-row items-stretch w-full gap-2 h-full"
                        >
                            {/* Left Player */}
                            <div className="flex items-center justify-between bg-blue-900/80 p-1 rounded flex-1 hover:bg-blue-900/40 transition-colors h-full">
                            {leftPlayer && (
                                    <>
                                        <Link
                                            href={`/${leftPlayer.riotIdTagline}/${leftPlayer.riotIdGameName}/${region}`}
                                            className="text-xs text-white hover:text-blue-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                                            title={`${leftPlayer.riotIdGameName}#${leftPlayer.riotIdTagline}`}
                                            aria-label={`View profile for ${leftPlayer.riotIdGameName}`}
                                        >
                                            {leftPlayer.riotIdGameName}
                                        </Link>
                                        <ChampionIcon
                                            champion={leftPlayer.champion}
                                            size={16}
                                        />
                                    </>
                                )}
                            </div>

                            {/* Right Player */}
                            <div className="flex items-center justify-between gap-1 bg-violet-900/80 p-1 rounded flex-1 hover:bg-violet-900/40 transition-colors h-full">
                            {rightPlayer && (
                                    <>
                                        <ChampionIcon
                                            champion={rightPlayer.champion}
                                            size={16}
                                        />
                                        <Link
                                            href={`/${rightPlayer.riotIdTagline}/${rightPlayer.riotIdGameName}/${region}`}
                                            className="text-xs text-white hover:text-blue-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                                            title={`${rightPlayer.riotIdGameName}#${rightPlayer.riotIdTagline}`}
                                            aria-label={`View profile for ${rightPlayer.riotIdGameName}`}
                                        >
                                            {rightPlayer.riotIdGameName}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}