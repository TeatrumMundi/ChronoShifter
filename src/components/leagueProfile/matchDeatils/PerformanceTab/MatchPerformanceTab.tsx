import { Participant } from "@/interfaces/productionTypes";
import Link from "next/link";
import { useState, useMemo, memo, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ChampionIcon } from "@/components/common/Icons/ChampionIcon";

interface MatchPerformanceTabProps {
    team1: Participant[];
    team2: Participant[];
    mainPlayerPUUID: string;
}

interface ParticipantRowProps {
    participant: Participant;
    isMain: boolean;
    sortKey: SortKey;
}

type SortKey = "kills" | "kda" | "damage" | "gold" | "wards" | "cs";
type SortOrder = "asc" | "desc";

// Memoized participant info component
const ParticipantInfo = memo(function ParticipantInfo({ participant }: { participant: Participant }) {
    const handleLinkClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);
    
    return (
        <div className="flex items-center gap-3">
            <ChampionIcon
                champion={participant.champion}
                size={36}
                showTooltip={true}
                level={participant.champLevel}
                className="flex-shrink-0"
            />
            <Link
                href={`/${participant.riotIdTagline}/${participant.riotIdGameName}/${participant.region}`}
                className="text-white/90 hover:text-blue-300 transition-colors duration-200 font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                title={`${participant.riotIdGameName}#${participant.riotIdTagline}`}
                aria-label={`View profile for ${participant.riotIdGameName}`}
                onClick={handleLinkClick}
            >
                {participant.riotIdGameName}
            </Link>
        </div>
    );
});

// Memoized participant row component
const ParticipantRow = memo(function ParticipantRow({ participant, isMain, sortKey }: ParticipantRowProps) {
    const rowClasses = useMemo(() => {
        const baseClasses = "transition-all duration-200 border border-white/10 backdrop-blur-sm";
        const backgroundClasses = isMain 
            ? (participant.win 
                ? "bg-gradient-to-r from-emerald-500/20 via-emerald-400/15 to-emerald-500/20 border-emerald-400/40 shadow-emerald-500/10" 
                : "bg-gradient-to-r from-rose-500/20 via-rose-400/15 to-rose-500/20 border-rose-400/40 shadow-rose-500/10")
            : (participant.win 
                ? "bg-gradient-to-r from-emerald-500/10 via-emerald-400/8 to-emerald-500/10 border-emerald-400/25" 
                : "bg-gradient-to-r from-rose-500/10 via-rose-400/8 to-rose-500/10 border-rose-400/25");
        
        return `${baseClasses} ${backgroundClasses}`;
    }, [isMain, participant.win]);

    const getCellHighlight = useCallback((cellKey: SortKey) => {
        return sortKey === cellKey ? "bg-blue-400/15 border border-blue-400/30" : "";
    }, [sortKey]);

    return (
        <tr className={rowClasses}>
            <td className="px-4 py-1">
                <ParticipantInfo participant={participant} />
            </td>
            <td className={`px-4 py-1 text-center text-white/90 font-medium ${getCellHighlight("kills")}`}>
                {participant.kills}
            </td>
            <td className={`px-4 py-1 text-center text-white/90 font-medium ${getCellHighlight("kda")}`}>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-white/70">{participant.kills}/{participant.deaths}/{participant.assists}</span>
                    <span className="font-semibold">{participant.kda}</span>
                </div>
            </td>
            <td className={`px-4 py-1 text-center text-white/90 font-medium ${getCellHighlight("damage")}`}>
                {participant.totalDamageDealtToChampions.toLocaleString()}
            </td>
            <td className={`px-4 py-1 text-center text-white/90 font-medium ${getCellHighlight("gold")}`}>
                {participant.goldEarned.toLocaleString()}
            </td>
            <td className={`px-4 py-1 text-center text-white/90 font-medium ${getCellHighlight("wards")}`}>
                {participant.wardsPlaced}
            </td>
            <td className={`px-4 py-1 text-center text-white/90 font-medium ${getCellHighlight("cs")}`}>
                {participant.totalMinionsKilled + participant.neutralMinionsKilled}
            </td>
        </tr>
    );
});

// Memoized sortable header component
const SortableHeader = memo(function SortableHeader({ 
    sortKeyValue, 
    currentSortKey, 
    currentSortOrder, 
    onSort, 
    children 
}: { 
    sortKeyValue: SortKey; 
    currentSortKey: SortKey;
    currentSortOrder: SortOrder;
    onSort: (key: SortKey) => void;
    children: React.ReactNode;
}) {
    const isActive = currentSortKey === sortKeyValue;
    
    const handleClick = useCallback(() => {
        onSort(sortKeyValue);
    }, [onSort, sortKeyValue]);

    const headerClasses = useMemo(() => {
        const baseClasses = "px-4 py-3 text-center cursor-pointer transition-all duration-200 font-semibold text-white/80 hover:text-white select-none";
        const activeClasses = isActive 
            ? "bg-blue-400/20 text-blue-200 border border-blue-400/40 backdrop-blur" 
            : "hover:bg-white/10";
        
        return `${baseClasses} ${activeClasses}`;
    }, [isActive]);

    return (
        <th 
            className={headerClasses} 
            onClick={handleClick}
            style={isActive ? { 
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)' 
            } : {}}
        >
            <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-semibold">{children}</span>
                <div className="relative">
                    {isActive ? (
                        currentSortOrder === "desc" ? (
                            <ChevronDown size={16} className="text-blue-300" />
                        ) : (
                            <ChevronUp size={16} className="text-blue-300" />
                        )
                    ) : (
                        <ChevronDown size={16} className="opacity-40" />
                    )}
                </div>
            </div>
        </th>
    );
});

export const MatchPerformanceTab = memo(function MatchPerformanceTab({ team1, team2, mainPlayerPUUID }: MatchPerformanceTabProps) {
    const [sortKey, setSortKey] = useState<SortKey>("damage");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const handleSort = useCallback((key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("desc");
        }
    }, [sortKey, sortOrder]);

    const sortedParticipants = useMemo(() => {
        const allParticipants = [...team1, ...team2];
        return [...allParticipants].sort((a, b) => {
            let aValue: number;
            let bValue: number;

            switch (sortKey) {
                case "kills":
                    aValue = a.kills;
                    bValue = b.kills;
                    break;
                case "kda":
                    aValue = parseFloat(a.kda);
                    bValue = parseFloat(b.kda);
                    break;
                case "damage":
                    aValue = a.totalDamageDealtToChampions;
                    bValue = b.totalDamageDealtToChampions;
                    break;
                case "gold":
                    aValue = a.goldEarned;
                    bValue = b.goldEarned;
                    break;
                case "wards":
                    aValue = a.wardsPlaced;
                    bValue = b.wardsPlaced;
                    break;
                case "cs":
                    aValue = a.totalMinionsKilled + a.neutralMinionsKilled;
                    bValue = b.totalMinionsKilled + b.neutralMinionsKilled;
                    break;
                default:
                    return 0;
            }

            if (sortOrder === "asc") {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
    }, [team1, team2, sortKey, sortOrder]);

    return (
        <div className="relative rounded-xl backdrop-blur-xl border border-white/20 overflow-hidden
            bg-gradient-to-br from-white/5 via-white/3 to-white/5
            shadow-xl shadow-black/10">
            
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/2 to-transparent" />
            
            <div className="relative z-5 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/20">
                            <th className="px-4 py-3 text-left text-white/80 font-semibold">Player</th>
                            <SortableHeader 
                                sortKeyValue="kills" 
                                currentSortKey={sortKey} 
                                currentSortOrder={sortOrder} 
                                onSort={handleSort}
                            >
                                Kills
                            </SortableHeader>
                            <SortableHeader 
                                sortKeyValue="kda" 
                                currentSortKey={sortKey} 
                                currentSortOrder={sortOrder} 
                                onSort={handleSort}
                            >
                                KDA
                            </SortableHeader>
                            <SortableHeader 
                                sortKeyValue="damage" 
                                currentSortKey={sortKey} 
                                currentSortOrder={sortOrder} 
                                onSort={handleSort}
                            >
                                Damage
                            </SortableHeader>
                            <SortableHeader 
                                sortKeyValue="gold" 
                                currentSortKey={sortKey} 
                                currentSortOrder={sortOrder} 
                                onSort={handleSort}
                            >
                                Gold
                            </SortableHeader>
                            <SortableHeader 
                                sortKeyValue="wards" 
                                currentSortKey={sortKey} 
                                currentSortOrder={sortOrder} 
                                onSort={handleSort}
                            >
                                Wards
                            </SortableHeader>
                            <SortableHeader 
                                sortKeyValue="cs" 
                                currentSortKey={sortKey} 
                                currentSortOrder={sortOrder} 
                                onSort={handleSort}
                            >
                                CS
                            </SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {sortedParticipants.map((participant) => (
                            <ParticipantRow
                                key={participant.puuid}
                                participant={participant}
                                isMain={participant.puuid === mainPlayerPUUID}
                                sortKey={sortKey}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});