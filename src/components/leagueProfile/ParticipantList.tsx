import { Participant } from "@/interfaces/productionTypes";
import Link from "next/link";
import React, { useMemo } from "react";
import { ChampionIcon } from "./ChampionIcon";

const TEAM_COLORS: string[] = [
    'bg-yellow-800/60',
    'bg-cyan-800/60',
    'bg-blue-800/60',
    'bg-purple-800/60',
    'bg-orange-800/60',
    'bg-pink-800/60',
    'bg-teal-800/60',
    'bg-indigo-800/60'
];

/**
 * Renders a participant list based on the current game mode.
 */
export function ParticipantList({participants, gameMode, region,}: {
    participants: Participant[];
    gameMode: string;
    region: string;
}) {
     if (gameMode === "Arena") {
        return (
            <ArenaParticipantList
                participants={participants}
                region={region}
            />
        );
    }

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

function ArenaParticipantList({ participants, region }: {
    participants: Participant[];
    region: string;
}) {
    const teams = useMemo(() => {
        const teamGroups: { [key: number]: Participant[] } = {};

        participants.forEach(participant => {
            const teamId = participant.arenaStats?.playerSubteamId ?? -1;
            if (!teamGroups[teamId]) {
                teamGroups[teamId] = [];
            }
            teamGroups[teamId].push(participant);
        });

        return teamGroups;
    }, [participants]);

    const sortedTeamIds = useMemo(() =>
            Object.keys(teams).map(Number).sort(),
        [teams]
    );

    return (
        <div className="h-full text-sm text-gray-400 tracking-normal">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-full">
                {sortedTeamIds.map((teamId, index) => (
                    <div
                        key={teamId}
                        className={`flex p-1 rounded ${TEAM_COLORS[index % TEAM_COLORS.length]} transition-all duration-200 hover:opacity-80 overflow-hidden`}
                    >
                        {teams[teamId].map((player, playerIndex) => (
                            <div key={playerIndex} className="flex items-center gap-1 mr-2 flex-shrink-0">
                                <ChampionIcon champion={player.champion} size={16} />
                                <Link
                                    href={`/${player.riotIdTagline}/${player.riotIdGameName}/${region}`}
                                    className="text-sm w-[80px] truncate text-white hover:text-blue-400 transition-colors"
                                    title={player.riotIdGameName}
                                >
                                    {player.riotIdGameName}
                                </Link>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}