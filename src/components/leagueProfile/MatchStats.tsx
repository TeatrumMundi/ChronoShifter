"use client";

import { Participant } from "@/interfaces/productionTypes";
import { Swords, Eye, Coins, Flame, BarChart3, Cross, ShieldPlus, RadioTower } from "lucide-react";
import { useState, useEffect, JSX } from "react";

type StatItem = {
    label: string;
    value: string | JSX.Element;
    icon: JSX.Element;
    tooltip?: string;
    className?: string;
} | null;

export function MatchStats({ participant, gameMode }: {
    participant: Participant;
    gameMode: string;
}) {
    const isArena = gameMode === "Arena";
    const isSupport = participant.teamPosition === "UTILITY";
    const [formattedStats, setFormattedStats] = useState<StatItem[]>([]);
    const isWin : boolean = participant.win;

    useEffect(() => {
        const kda = parseFloat(participant.kda);
        let kdaColor = "text-yellow-500";
        if (kda >= 4) kdaColor = "text-green-500";
        else if (kda < 1) kdaColor = "text-red-500";

        const formatNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

        const stats: StatItem[] = [
            {
                label: "KDA",
                value: (
                    <>
                        {participant.kills}/
                        <span className="text-red-500">{participant.deaths}</span>/
                        {participant.assists}
                        <span className={`ml-1 ${kdaColor}`}>({participant.kda})</span>
                    </>
                ),
                tooltip: "Kills / Deaths / Assists (KDA)",
                icon: <Swords className="w-4 h-4" />,
            },
            {
                label: "Gold",
                value: formatNumber(participant.goldEarned),
                tooltip: "Gold earned in the match",
                icon: <Coins className="w-4 h-4" />,
            },
        ];

        if (isArena) {
            stats.push(
                {
                    label: "Healed",
                    value: formatNumber(participant.totalHealsOnTeammates),
                    tooltip: "Total heals on teammates",
                    icon: <Cross className="w-4 h-4" />,
                },
                {
                    label: "Shielded",
                    value: formatNumber(participant.totalDamageShieldedOnTeammates),
                    tooltip: "Total shields on teammates",
                    icon: <ShieldPlus className="w-4 h-4" />,
                },
                {
                    label: "Damage",
                    value: formatNumber(participant.totalDamageDealtToChampions),
                    tooltip: "Total damage dealt",
                    icon: <Flame className="w-4 h-4" />,
                }
            );
        } else if (isSupport) {
            stats.push(
                {
                    label: "Healed",
                    value: formatNumber(participant.totalHealsOnTeammates),
                    tooltip: "Total heals on teammates",
                    icon: <Cross className="w-4 h-4" />,
                },
                {
                    label: "Shielded",
                    value: formatNumber(participant.totalDamageShieldedOnTeammates),
                    tooltip: "Total shields on teammates",
                    icon: <ShieldPlus className="w-4 h-4" />,
                }
            );
        } else {
            stats.push(
                {
                    label: "Damage",
                    value: formatNumber(participant.totalDamageDealtToChampions),
                    tooltip: "Total damage dealt",
                    icon: <Flame className="w-4 h-4" />,
                },
                {
                    label: "Minions",
                    value: `${participant.allMinionsKilled} (${Number(participant.minionsPerMinute).toFixed(1)})`,
                    tooltip: "Minions killed (and per minute)",
                    icon: <BarChart3 className="w-4 h-4" />,
                    className: participant.minionsPerMinute >= 8 ? "text-green-500 font-semibold" : "",
                }
            );
        }

        if (!isArena) {
            stats.push(
                {
                    label: "Vision",
                    value: `${participant.visionScore.toString()}  (${participant.visionPerMinute})`,
                    tooltip: "Vision Score",
                    icon: <Eye className="w-4 h-4" />,
                    className: participant.visionPerMinute >= 2 ? "text-green-500 font-semibold" : "",
                },
                {
                    label: "Wards",
                    value: participant.wardsPlaced.toString(),
                    tooltip: "Wards Placed",
                    icon: <RadioTower className="w-4 h-4" />,
                }
            );
        }

        setFormattedStats(stats);
    }, [participant, gameMode, isArena, isSupport]);

    return (
        <div 
            className={`w-full px-2 py-2 rounded-sm bg-gradient-to-br shadow-inner border border-zinc-700 flex flex-col gap-2
            ${isWin ? "from-green-300/80 to-green-400/80" : "from-red-300/80 to-red-400/80"}
        `}>
            <div
                className={`
                    grid 
                    grid-cols-2 
                    sm:grid-cols-3 
                    gap-x-2 gap-y-2 
            `}
            >
                {formattedStats.map((stat) =>
                    stat ? (
                        <div
                            key={stat.label}
                            title={stat.tooltip}
                            className={`
                            flex flex-col items-center justify-center 
                            w-full h-full
                            px-2 py-1 rounded-sm 
                            bg-zinc-900/80 border border-zinc-700 
                            hover:border-blue-400 transition-all shadow-sm
                        `}
                        >
                            <div className="flex items-center justify-center mb-1">
                                <span className="inline-flex items-center justify-center rounded-sm bg-zinc-800 border border-zinc-700 w-7 h-7 mr-1">
                                    {stat.icon}
                                </span>
                                <span className="text-xs text-zinc-400 font-semibold">{stat.label}</span>
                            </div>
                            <span className={`text-sm font-bold text-zinc-100 ${stat.className ?? ""}`}>
                                {stat.value}
                            </span>
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
}