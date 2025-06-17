import { ChampionIcon } from "@/components/common/Icons/ChampionIcon";
import { Participant } from "@/interfaces/productionTypes";
import React, { useMemo } from "react";
import Link from "next/link";

const TEAM_COLORS: string[] = [
    'bg-yellow-500/25 border-yellow-400/30',
    'bg-cyan-500/25 border-cyan-400/30',
    'bg-blue-500/25 border-blue-400/30',
    'bg-purple-500/25 border-purple-400/30',
    'bg-orange-500/25 border-orange-400/30',
    'bg-pink-500/25 border-pink-400/30',
    'bg-teal-500/25 border-teal-400/30',
    'bg-indigo-500/25 border-indigo-400/30'
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
 * Classic 5v5 layout:
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
        <div className="h-full w-full text-xs">
            <div className="flex flex-col gap-0.5 lg:gap-1 h-full">
                {Array.from({ length: 5 }).map((_, i) => {
                    const leftPlayer = teams.leftTeam[i];
                    const rightPlayer = teams.rightTeam[i];

                    return (
                        <div
                            key={i}
                            className="flex flex-row items-stretch w-full gap-0.5 lg:gap-1 flex-1 h-[28px]"
                        >
                            {/* Left Player - Blue Team */}
                            <div className="flex items-center px-1 rounded-md h-full min-w-0 w-1/2 flex-shrink-0
                                bg-blue-500/20 backdrop-blur-sm border border-blue-400/30
                                hover:bg-blue-500/30 hover:border-blue-400/40
                                transition-all duration-200 ease-out overflow-hidden">
                                {leftPlayer && (
                                    <>
                                        <ChampionIcon
                                            champion={leftPlayer.champion}
                                            size={12}
                                            className="rounded-xl flex-shrink-0"
                                        />
                                        <Link
                                            href={`/${leftPlayer.riotIdTagline}/${leftPlayer.riotIdGameName}/${region}`}
                                            className="text-white/90 hover:text-blue-200 transition-colors 
                                                whitespace-nowrap overflow-hidden truncate flex-1 min-w-0 ml-1
                                                font-medium text-xs"
                                            title={`${leftPlayer.riotIdGameName}#${leftPlayer.riotIdTagline}`}
                                            aria-label={`View profile for ${leftPlayer.riotIdGameName}`}
                                        >
                                            {leftPlayer.riotIdGameName}
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Right Player - Red Team */}
                            <div className="flex items-center px-1 rounded-md h-full min-w-0 w-1/2 flex-shrink-0
                                bg-red-500/20 backdrop-blur-sm border border-red-400/30
                                hover:bg-red-500/30 hover:border-red-400/40
                                transition-all duration-200 ease-out overflow-hidden">
                                {rightPlayer && (
                                    <>
                                        <Link
                                            href={`/${rightPlayer.riotIdTagline}/${rightPlayer.riotIdGameName}/${region}`}
                                            className="text-white/90 hover:text-red-200 transition-colors 
                                                whitespace-nowrap overflow-hidden truncate flex-1 min-w-0 mr-1 text-right
                                                font-medium text-xs"
                                            title={`${rightPlayer.riotIdGameName}#${rightPlayer.riotIdTagline}`}
                                            aria-label={`View profile for ${rightPlayer.riotIdGameName}`}
                                        >
                                            {rightPlayer.riotIdGameName}
                                        </Link>
                                        <ChampionIcon
                                            champion={rightPlayer.champion}
                                            size={12}
                                            className="rounded-xl flex-shrink-0"
                                        />
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
        <div className="h-full text-xs">
            <div className="flex flex-col gap-0.5 lg:gap-1 h-full">
                {sortedTeamIds.map((teamId, index) => (
                    <div
                        key={teamId}
                        className={`flex items-center p-1 lg:p-1.5 rounded-md backdrop-blur-sm border flex-1 min-h-0
                            ${TEAM_COLORS[index % TEAM_COLORS.length]}
                            hover:bg-white/10 hover:border-white/20
                            transition-all duration-200 ease-out overflow-hidden
                            shadow-sm`}
                    >
                        {teams[teamId].map((player, playerIndex) => (
                            <div key={playerIndex} className="flex items-center gap-1 mr-1 flex-shrink-0 last:mr-0 min-w-0">
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 rounded-sm bg-white/10 backdrop-blur-sm border border-white/15" />
                                    <div className="relative p-0.5">
                                        <ChampionIcon champion={player.champion} size={12} />
                                    </div>
                                </div>
                                <Link
                                    href={`/${player.riotIdTagline}/${player.riotIdGameName}/${region}`}
                                    className="text-xs truncate text-white/90 hover:text-white 
                                        transition-colors font-medium min-w-0 flex-1"
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