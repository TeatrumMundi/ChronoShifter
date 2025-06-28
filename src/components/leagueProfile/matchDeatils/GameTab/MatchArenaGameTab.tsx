import React, { memo, useMemo, useCallback } from "react";
import { SummonerSpellDisplay } from "@/components/leagueProfile/SummonerSpellDisplay";
import { ChampionIcon } from "@/components/common/Icons/ChampionIcon";
import { RuneDisplay } from "@/components/leagueProfile/RuneDisplay";
import { ItemDisplay } from "@/components/leagueProfile/ItemDisplay";
import { AugmentDisplay } from "@/components/leagueProfile/AugmentDisplay";
import { Participant } from "@/interfaces/productionTypes";
import { getOrdinalPlacement } from "@/utils/helpers";
import Link from "next/link";

interface MatchArenaGameTabProps {
    participants: Participant[];
    mainPlayerPUUID: string;
}

interface ArenaParticipantRowProps {
    participant: Participant;
    isMain: boolean;
}

// Memoized participant info component for Arena
const ArenaParticipantInfo = memo(function ArenaParticipantInfo({ participant }: { participant: Participant }) {
    const handleLinkClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);
    
    return (
        <div className="flex items-center gap-3">
            <ChampionIcon
                champion={participant.champion}
                size={40}
                showTooltip={true}
                level={participant.champLevel}
            />
            <SummonerSpellDisplay
                summonerSpell1={participant.summonerSpell1}
                summonerSpell2={participant.summonerSpell2}
                summonerspellIconsSize={18}
                boxSize={13}
            />
            <RuneDisplay
                runes={participant.runes}
                boxSize={14}
                keyStoneIconSize={18}
                secendaryRuneIconSize={12}
            />
            <Link
                href={`/${participant.riotIdTagline}/${participant.riotIdGameName}/${participant.region}`}
                className="text-white/90 hover:text-blue-300 transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis font-medium"
                title={`${participant.riotIdGameName}#${participant.riotIdTagline}`}
                aria-label={`View profile for ${participant.riotIdGameName}`}
                onClick={handleLinkClick}
            >
                {participant.riotIdGameName}
            </Link>
        </div>
    );
});

const ArenaParticipantRow = memo(function ArenaParticipantRow({ participant, isMain }: ArenaParticipantRowProps) {
    const placement = participant.arenaStats?.placement || 0;
    
    const rowClasses = useMemo(() => {
        const baseClasses = "transition-all duration-200 border border-white/10";
        let backgroundClasses = "";
        
        if (isMain) {
            // Highlight main player based on placement
            if (placement <= 2) {
                backgroundClasses = "bg-gradient-to-r from-emerald-500/25 via-emerald-400/20 to-emerald-500/25 border-emerald-400/50 shadow-lg shadow-emerald-500/10";
            } else if (placement <= 4) {
                backgroundClasses = "bg-gradient-to-r from-blue-500/25 via-blue-400/20 to-blue-500/25 border-blue-400/50 shadow-lg shadow-blue-500/10";
            } else {
                backgroundClasses = "bg-gradient-to-r from-rose-500/25 via-rose-400/20 to-rose-500/25 border-rose-400/50 shadow-lg shadow-rose-500/10";
            }
        } else {
            // Subtle background for other players based on placement
            if (placement <= 2) {
                backgroundClasses = "bg-gradient-to-r from-emerald-500/8 via-emerald-400/5 to-emerald-500/8 border-emerald-400/20";
            } else if (placement <= 4) {
                backgroundClasses = "bg-gradient-to-r from-blue-500/8 via-blue-400/5 to-blue-500/8 border-blue-400/20";
            } else {
                backgroundClasses = "bg-gradient-to-r from-rose-500/8 via-rose-400/5 to-rose-500/8 border-rose-400/20";
            }
        }
        
        return `${baseClasses} ${backgroundClasses}`;
    }, [isMain, placement]);

    const cellTextClasses = isMain ? "text-white font-semibold" : "text-white/90 font-medium";

    return (
        <tr className={rowClasses}>
            <td className="px-4 py-1">
                <ArenaParticipantInfo participant={participant} />
            </td>
            <td className={`px-4 py-1 text-center ${cellTextClasses}`}>
                {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})
            </td>
            <td className={`px-4 py-1 text-center ${cellTextClasses}`}>
                {participant.totalDamageDealtToChampions.toLocaleString()}
            </td>
            <td className={`px-4 py-1 text-center ${cellTextClasses}`}>
                {participant.totalDamageTaken.toLocaleString()}
            </td>
            <td className={`px-4 py-1 text-center ${cellTextClasses}`}>
                {participant.goldEarned.toLocaleString()}
            </td>
            <td className="px-4 py-1">
                <div className="flex justify-center w-[50px] mx-auto">
                    <ItemDisplay 
                        items={participant.items}
                        itemSize={20}
                    />
                </div>
            </td>
            <td className="px-4 py-1">
                <div className="flex justify-center">
                    <AugmentDisplay 
                        augments={participant.arenaStats?.augments || []}
                        itemSize={20}
                    />
                </div>
            </td>
        </tr>
    );
});

// Arena team names mapping based on League creatures/themes
const getArenaTeamName = (teamId: number): string => {
    const teamNames = [
        "", // 0 - unused, teams start from 1
        "Team Poros",       // 1 
        "Team Minions",     // 2
        "Team Scuttles",    // 3
        "Team Krugs",       // 4
        "Team Raptors",     // 5
        "Team Sentinels",   // 6
        "Team Wolves",      // 7
        "Team Gromps"       // 8
    ];
    
    return teamNames[teamId] || `Team ${teamId}`;
};

const ArenaTeamHeader = memo(function ArenaTeamHeader({ 
    teamId, 
    placement 
}: { 
    teamId: number; 
    placement: number; 
}) {
    const getTeamStyle = () => {
        if (placement <= 2) {
            return "bg-gradient-to-r from-emerald-500/20 via-emerald-400/15 to-emerald-500/20 text-emerald-200 border-emerald-400/40";
        } else if (placement <= 4) {
            return "bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20 text-blue-200 border-blue-400/40";
        } else {
            return "bg-gradient-to-r from-rose-500/20 via-rose-400/15 to-rose-500/20 text-rose-200 border-rose-400/40";
        }
    };

    return (
        <tr>
            <th colSpan={7} className={`px-4 text-left backdrop-blur-sm border shadow-sm ${getTeamStyle()}`}>
                <span className="font-bold text-lg">
                    {getArenaTeamName(teamId)} - {getOrdinalPlacement(placement)} Place
                </span>
            </th>
        </tr>
    );
});

export const MatchArenaGameTab = memo(function MatchArenaGameTab({ participants, mainPlayerPUUID }: MatchArenaGameTabProps) {
    // Group participants by arena teams
    const arenaTeams = useMemo(() => {
        const teams: Record<number, Participant[]> = {};
        
        participants.forEach(participant => {
            const teamId = participant.arenaStats?.playerSubteamId || 0;
            if (!teams[teamId]) {
                teams[teamId] = [];
            }
            teams[teamId].push(participant);
        });

        // Sort teams by placement (best placement first)
        return Object.entries(teams)
            .sort(([, teamA], [, teamB]) => {
                const placementA = teamA[0]?.arenaStats?.placement || 999;
                const placementB = teamB[0]?.arenaStats?.placement || 999;
                return placementA - placementB;
            })
            .map(([teamId, teamParticipants]) => ({
                teamId: parseInt(teamId),
                participants: teamParticipants,
                placement: teamParticipants[0]?.arenaStats?.placement || 0
            }));
    }, [participants]);

    const tableHeaders = useMemo(() => (
        <thead>
            <tr className="border-b border-white/20">
                <th className="px-4 py-3 text-left text-white/80 font-semibold">Player</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">KDA</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">Damage</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">Taken</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">Gold</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">Items</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">Augments</th>
            </tr>
        </thead>
    ), []);

    return (
        <div className="relative rounded-xl backdrop-blur-xl border border-white/20 overflow-hidden
            bg-gradient-to-br from-white/5 via-white/3 to-white/5
            shadow-xl shadow-black/10">
            
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/2 to-transparent" />
            
            <div className="relative z-5 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5">
                <table className="min-w-full text-sm">
                    {tableHeaders}
                    <tbody className="divide-y divide-white/10">
                        {arenaTeams.map((team) => (
                            <React.Fragment key={team.teamId}>
                                <ArenaTeamHeader 
                                    teamId={team.teamId} 
                                    placement={team.placement} 
                                />
                                {team.participants.map((participant) => (
                                    <ArenaParticipantRow
                                        key={participant.puuid}
                                        participant={participant}
                                        isMain={participant.puuid === mainPlayerPUUID}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
