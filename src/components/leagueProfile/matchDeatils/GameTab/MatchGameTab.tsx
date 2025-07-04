import { SummonerSpellDisplay } from "@/components/leagueProfile/SummonerSpellDisplay";
import { ChampionIcon } from "@/components/common/Icons/ChampionIcon";
import { RuneDisplay } from "@/components/leagueProfile/RuneDisplay";
import { ItemDisplay } from "@/components/leagueProfile/ItemDisplay";
import { Participant } from "@/interfaces/productionTypes";
import { getOrdinalPlacement } from "@/utils/helpers";
import { memo, useMemo, useCallback } from "react";
import Link from "next/link";

interface MatchGameTabProps {
    team1: Participant[];
    team2: Participant[];
    mainPlayerPUUID: string;
    time: number;
}

interface ParticipantRowProps {
    participant: Participant;
    isMain: boolean;
    time: number;
}

// Memoized styling functions
const getPlacementStyle = (placement: number): string => {
    switch (placement) {
        case 1:
            return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
        case 2:
            return "bg-gray-400/15 text-gray-200 border-gray-400/30";
        case 3:
            return "bg-amber-600/15 text-amber-300 border-amber-600/30";
        case 4:
        case 5:
            return "bg-green-600/15 text-green-300 border-green-600/30";
        case 6:
        case 7:
            return "bg-blue-600/15 text-blue-300 border-blue-600/30";
        case 8:
        case 9:
            return "bg-orange-600/15 text-orange-300 border-orange-600/30";
        case 10:
            return "bg-red-600/15 text-red-300 border-red-600/30";
        default:
            return "bg-gray-600/15 text-gray-300 border-gray-600/30";
    }
};

const getScoreStyleBase = (placement: number): string => {
    switch (placement) {
        case 1:
            return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
        case 2:
            return "bg-gray-400/15 text-gray-200 border-gray-400/30";
        case 3:
            return "bg-amber-600/15 text-amber-300 border-amber-600/30";
        case 4:
        case 5:
            return "bg-green-600/15 text-green-300 border-green-600/30";
        case 6:
        case 7:
            return "bg-blue-600/15 text-blue-300 border-blue-600/30";
        case 8:
        case 9:
            return "bg-orange-600/15 text-orange-300 border-orange-600/30";
        case 10:
            return "bg-red-600/15 text-red-300 border-red-600/30";
        default:
            return "bg-gray-600/15 text-gray-300 border-gray-600/30";
    }
};

const getScoreStyle = (placement: number): string => {
    const baseStyle = "px-3 py-1.5 rounded-lg font-semibold text-xs border w-14 text-center backdrop-blur-sm shadow-sm";
    return `${baseStyle} ${getScoreStyleBase(placement)}`;
};

const getPlacementBoxStyle = (placement: number): string => {
    const baseStyle = "text-xs px-2 py-1 rounded-lg w-12 text-center backdrop-blur-sm border font-semibold";
    return `${baseStyle} ${getPlacementStyle(placement)}`;
};

// Memoized participant info component
const ParticipantInfo = memo(function ParticipantInfo({ participant }: { participant: Participant; }) {
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

// Memoized score and placement display
const ScoreDisplay = memo(function ScoreDisplay({ 
    participant 
}: { 
    participant: Participant; 
}) {
    return (
        <div className="flex items-center justify-center gap-3">
            <span className={getScoreStyle(participant.performancePlacement)}>
                {Math.round(participant.performanceScore)}
            </span>
            <span className={getPlacementBoxStyle(participant.performancePlacement)}>
                {getOrdinalPlacement(participant.performancePlacement)}
            </span>
        </div>
    );
});

const ParticipantRow = memo(function ParticipantRow({ participant, isMain }: ParticipantRowProps) {
    const rowClasses = useMemo(() => {
        const baseClasses = "transition-all duration-200 border border-white/10";
        const backgroundClasses = isMain 
            ? (participant.win 
                ? "bg-gradient-to-r from-emerald-500/25 via-emerald-400/20 to-emerald-500/25 border-emerald-400/50 shadow-lg shadow-emerald-500/10" 
                : "bg-gradient-to-r from-rose-500/25 via-rose-400/20 to-rose-500/25 border-rose-400/50 shadow-lg shadow-rose-500/10")
            : (participant.win 
                ? "bg-gradient-to-r from-emerald-500/8 via-emerald-400/5 to-emerald-500/8 border-emerald-400/20" 
                : "bg-gradient-to-r from-rose-500/8 via-rose-400/5 to-rose-500/8 border-rose-400/20");
        
        return `${baseClasses} ${backgroundClasses}`;
    }, [isMain, participant.win]);

    const cellTextClasses = isMain ? "text-white font-semibold" : "text-white/90 font-medium";

    return (
        <tr className={rowClasses}>
            <td className="px-4 py-1">
                <ParticipantInfo participant={participant} />
            </td>
            <td className="px-4 py-1 text-center">
                <ScoreDisplay participant={participant} />
            </td>
            <td className={`px-4 py-1 text-center ${cellTextClasses}`}>
                {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})
            </td>
            <td className={`px-4 py-1 text-center ${cellTextClasses}`}>
                {participant.totalDamageDealtToChampions.toLocaleString()}
            </td>
            <td className={`px-4 py-1 text-center ${cellTextClasses}`}>
                {participant.goldEarned.toLocaleString()}
            </td>
            <td className={`px-4 py-1 text-center ${cellTextClasses}`}>
                {participant.totalMinionsKilled + participant.neutralMinionsKilled}
            </td>
            <td className={`px-4 py-1 text-center ${cellTextClasses}`}>
                {participant.wardsPlaced}
            </td>
            <td className="px-4 py-1">
                <div className="flex justify-center w-[50px] mx-auto">
                    <ItemDisplay 
                        items={participant.items}
                        itemSize={20}
                    />
                </div>
            </td>
        </tr>
    );
});

const TeamHeader = memo(function TeamHeader({ isWin }: { isWin: boolean }) {
    return (
        <tr>
            <th colSpan={8} className={`px-4 text-left backdrop-blur-sm border shadow-sm
                ${isWin 
                    ? "bg-gradient-to-r from-emerald-500/20 via-emerald-400/15 to-emerald-500/20 text-emerald-200 border-emerald-400/40" 
                    : "bg-gradient-to-r from-rose-500/20 via-rose-400/15 to-rose-500/20 text-rose-200 border-rose-400/40"
                }`}>
                {isWin
                    ? <span className="text-emerald-300 font-bold text-lg">Victory</span>
                    : <span className="text-rose-300 font-bold text-lg">Defeat</span>
                }
            </th>
        </tr>
    );
});

export const MatchGameTab = memo(function MatchGameTab({ 
    team1, 
    team2, 
    mainPlayerPUUID, 
    time 
}: MatchGameTabProps) {
    // Memoize team data to prevent unnecessary re-renders
    const memoizedTeam1 = useMemo(() => team1, [team1]);
    const memoizedTeam2 = useMemo(() => team2, [team2]);

    const tableHeaders = useMemo(() => (
        <thead>
            <tr className="border-b border-white/20">
                <th className="px-4 py-3 text-left text-white/80 font-semibold">Player</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">CS Score</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">KDA</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">Damage</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">Gold</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">CS</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">Wards</th>
                <th className="px-4 py-3 text-center text-white/80 font-semibold">Items</th>
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
                        <TeamHeader isWin={memoizedTeam1[0]?.win} />
                        {memoizedTeam1.map((participant) => (
                            <ParticipantRow
                                key={participant.puuid}
                                participant={participant}
                                isMain={participant.puuid === mainPlayerPUUID}
                                time={time}
                            />
                        ))}
                        <TeamHeader isWin={memoizedTeam2[0]?.win} />
                        {memoizedTeam2.map((participant) => (
                            <ParticipantRow
                                key={participant.puuid}
                                participant={participant}
                                isMain={participant.puuid === mainPlayerPUUID}
                                time={time}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});