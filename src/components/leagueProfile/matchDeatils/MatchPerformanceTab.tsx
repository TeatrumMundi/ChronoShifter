import { Participant } from "@/interfaces/productionTypes";
import { ChampionIcon } from "../ChampionIcon";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

interface MatchPerformanceTabProps {
    team1: Participant[];
    team2: Participant[];
    mainPlayerPUUID: string;
    region: string;
}

interface ParticipantRowProps {
    participant: Participant;
    isMain: boolean;
    region: string;
}

type SortKey = "kills" | "kda" | "damage" | "gold" | "wards" | "cs";
type SortOrder = "asc" | "desc";

function ParticipantRow({ participant, isMain, region, sortKey}: ParticipantRowProps & { sortKey: SortKey }) {
    return (
        <tr
            className={` ${isMain 
                ? (participant.win ? "bg-green-900/70" : "bg-red-900/70") 
                : (participant.win ? "bg-green-950/70" : "bg-red-950/70")}
                `}   
        >
            <td className="px-2 py-1 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <ChampionIcon
                        champion={participant.champion}
                        size={40}
                        showTooltip={true}
                        level={participant.champLevel}
                        className="flex-shrink-0"
                    />
                    <Link
                        href={`/${participant.riotIdTagline}/${participant.riotIdGameName}/${region}`}
                        className="text-white hover:text-blue-400 transition-colors text-sm"
                        title={`${participant.riotIdGameName}#${participant.riotIdTagline}`}
                        aria-label={`View profile for ${participant.riotIdGameName}`}
                    >
                        {participant.riotIdGameName}
                    </Link>
                </div>
            </td>
            <td className={`px-2 py-1 text-center text-sm whitespace-nowrap ${sortKey === "kills" ? "bg-blue-500/20" : ""}`}>
                {participant.kills}
            </td>
            <td className={`px-2 py-1 text-center text-sm whitespace-nowrap ${sortKey === "kda" ? "bg-blue-500/20" : ""}`}>
                {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})
            </td>
            <td className={`px-2 py-1 text-center text-sm whitespace-nowrap ${sortKey === "damage" ? "bg-blue-500/20" : ""}`}>
                {participant.totalDamageDealtToChampions.toLocaleString()}
            </td>
            <td className={`px-2 py-1 text-center text-sm whitespace-nowrap ${sortKey === "gold" ? "bg-blue-500/20" : ""}`}>
                {participant.goldEarned.toLocaleString()}
            </td>
            <td className={`px-2 py-1 text-center text-sm whitespace-nowrap ${sortKey === "wards" ? "bg-blue-500/20" : ""}`}>
                {participant.wardsPlaced}
            </td>
            <td className={`px-2 py-1 text-center text-sm whitespace-nowrap ${sortKey === "cs" ? "bg-blue-500/20" : ""}`}>
                {participant.totalMinionsKilled + participant.neutralMinionsKilled}
            </td>
        </tr>
    );
}

export function MatchPerformanceTab({ team1, team2, mainPlayerPUUID, region }: MatchPerformanceTabProps) {
    const [sortKey, setSortKey] = useState<SortKey>("damage");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("desc");
        }
    };

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

    const SortableHeader = ({ sortKeyValue, children }: { sortKeyValue: SortKey; children: React.ReactNode }) => (
        <th 
            className={`px-2 py-1 text-center cursor-pointer hover:bg-gray-700/50 transition-colors text-sm whitespace-nowrap ${
                sortKey === sortKeyValue ? "bg-blue-500/20" : ""
            }`}
            onClick={() => handleSort(sortKeyValue)}
        >
            <div className="flex items-center justify-center gap-1">
                {children}
                <ChevronDown 
                    size={16}
                    className={`transition-transform duration-200 flex-shrink-0 ${
                        sortKey === sortKeyValue 
                            ? sortOrder === "desc" ? "rotate-0" : "rotate-180" 
                            : "opacity-50"
                    }`}
                />
            </div>
        </th>
    );

    return (
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <table className="min-w-full text-sm">
                <thead>
                    <tr>
                        <th className="px-2 py-1 text-left text-sm whitespace-nowrap">Player</th>
                        <SortableHeader sortKeyValue="kills">Kills</SortableHeader>
                        <SortableHeader sortKeyValue="kda">KDA</SortableHeader>
                        <SortableHeader sortKeyValue="damage">Damage</SortableHeader>
                        <SortableHeader sortKeyValue="gold">Gold</SortableHeader>
                        <SortableHeader sortKeyValue="wards">Wards</SortableHeader>
                        <SortableHeader sortKeyValue="cs">CS</SortableHeader>
                    </tr>
                </thead>
                <tbody>
                    {sortedParticipants.map((participant) => (
                        <ParticipantRow
                            key={participant.puuid}
                            participant={participant}
                            isMain={participant.puuid === mainPlayerPUUID}
                            region={region}
                            sortKey={sortKey}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}