import { memo, useMemo, useCallback } from "react";
import { SummonerSpellDisplay } from "@/components/leagueProfile/SummonerSpellDisplay";
import { ChampionIcon } from "@/components/common/Icons/ChampionIcon";
import { RuneDisplay } from "@/components/leagueProfile/RuneDisplay";
import { ItemDisplay } from "@/components/leagueProfile/ItemDisplay";
import { Participant } from "@/interfaces/productionTypes";
import Link from "next/link";
import { getOrdinalPlacement } from "@/utils/helpers";

interface MatchGameTabProps {
    team1: Participant[];
    team2: Participant[];
    mainPlayerPUUID: string;
    region: string;
    time: number;
}

interface ParticipantRowProps {
    participant: Participant;
    isMain: boolean;
    region: string;
    time: number;
}

// Memoized styling functions
const getPlacementStyle = (placement: number): string => {
    switch (placement) {
        case 1:
            return "bg-gradient-to-r from-yellow-500/90 to-yellow-400/90 text-black font-bold shadow-lg shadow-yellow-500/20";
        case 2:
            return "bg-gradient-to-r from-gray-400/90 to-gray-300/90 text-black font-bold shadow-lg shadow-gray-400/20";
        case 3:
            return "bg-gradient-to-r from-amber-600/90 to-amber-500/90 text-white font-bold shadow-lg shadow-amber-600/20";
        case 4:
        case 5:
            return "bg-gradient-to-r from-green-600/80 to-green-500/80 text-white shadow-lg shadow-green-600/20";
        case 6:
        case 7:
            return "bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white shadow-lg shadow-blue-600/20";
        case 8:
        case 9:
            return "bg-gradient-to-r from-orange-600/80 to-orange-500/80 text-white shadow-lg shadow-orange-600/20";
        case 10:
            return "bg-gradient-to-r from-red-600/90 to-red-500/90 text-white font-bold shadow-lg shadow-red-600/20";
        default:
            return "bg-gradient-to-r from-gray-600/80 to-gray-500/80 text-white shadow-lg shadow-gray-600/20";
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

const getDesktopScoreStyle = (placement: number): string => {
    const baseStyle = "px-3 py-1.5 rounded-lg font-semibold text-xs border w-14 text-center backdrop-blur-sm shadow-sm";
    return `${baseStyle} ${getScoreStyleBase(placement)}`;
};

const getDesktopPlacementBoxStyle = (placement: number): string => {
    const baseStyle = "text-xs px-2 py-1 rounded-lg w-12 text-center backdrop-blur-sm border";
    return `${baseStyle} ${getPlacementStyle(placement)}`;
};

// Memoized participant info component
const ParticipantInfo = memo(function ParticipantInfo({ 
    participant, 
    region 
}: { 
    participant: Participant; 
    region: string; 
}) {
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
                href={`/${participant.riotIdTagline}/${participant.riotIdGameName}/${region}`}
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
            <span className={getDesktopScoreStyle(participant.performancePlacement)}>
                {Math.round(participant.performanceScore)}
            </span>
            <span className={getDesktopPlacementBoxStyle(participant.performancePlacement)}>
                {getOrdinalPlacement(participant.performancePlacement)}
            </span>
        </div>
    );
});

const ParticipantRow = memo(function ParticipantRow({ participant, isMain, region }: ParticipantRowProps) {
    const rowClasses = useMemo(() => {
        const baseClasses = "transition-all duration-200 border border-white/10";
        const backgroundClasses = isMain 
            ? (participant.win 
                ? "bg-gradient-to-r from-emerald-500/15 via-emerald-400/10 to-emerald-500/15 border-emerald-400/30" 
                : "bg-gradient-to-r from-rose-500/15 via-rose-400/10 to-rose-500/15 border-rose-400/30")
            : (participant.win 
                ? "bg-gradient-to-r from-emerald-500/8 via-emerald-400/5 to-emerald-500/8 border-emerald-400/20" 
                : "bg-gradient-to-r from-rose-500/8 via-rose-400/5 to-rose-500/8 border-rose-400/20");
        
        return `${baseClasses} ${backgroundClasses}`;
    }, [isMain, participant.win]);

    return (
        <tr className={rowClasses}>
            <td className="px-4 py-1">
                <ParticipantInfo participant={participant} region={region} />
            </td>
            <td className="px-4 py-1 text-center">
                <ScoreDisplay participant={participant} />
            </td>
            <td className="px-4 py-1 text-center text-white/90 font-medium">
                {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})
            </td>
            <td className="px-4 py-1 text-center text-white/90 font-medium">
                {participant.totalDamageDealtToChampions.toLocaleString()}
            </td>
            <td className="px-4 py-1 text-center text-white/90 font-medium">
                {participant.goldEarned.toLocaleString()}
            </td>
            <td className="px-4 py-1 text-center text-white/90 font-medium">
                {participant.totalMinionsKilled + participant.neutralMinionsKilled}
            </td>
            <td className="px-4 py-1 text-center text-white/90 font-medium">
                {participant.wardsPlaced}
            </td>
            <td className="px-4 py-1">
                <div className="flex justify-center w-[45px] mx-auto">
                    <ItemDisplay 
                        items={participant.items}
                        itemSize={20}
                        smMinWidth={95}
                        trinketMaxWidth={14}
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
    region, 
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
                                region={region}
                                time={time}
                            />
                        ))}
                        <TeamHeader isWin={memoizedTeam2[0]?.win} />
                        {memoizedTeam2.map((participant) => (
                            <ParticipantRow
                                key={participant.puuid}
                                participant={participant}
                                isMain={participant.puuid === mainPlayerPUUID}
                                region={region}
                                time={time}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});