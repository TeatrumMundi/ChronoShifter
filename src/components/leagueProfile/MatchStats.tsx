"use client";

import { Participant } from "@/interfaces/productionTypes";
import { useState, useEffect, JSX } from "react";

type StatItem = {
    label: string;
    value: string | JSX.Element;
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
            },
            {
                label: "Gold",
                value: formatNumber(participant.goldEarned),
                tooltip: "Gold earned in the match",
            },
        ];

        if (isArena) {
            stats.push(
                {
                    label: "Healed",
                    value: formatNumber(participant.totalHealsOnTeammates),
                    tooltip: "Total heals on teammates",
                },
                {
                    label: "Shielded",
                    value: formatNumber(participant.totalDamageShieldedOnTeammates),
                    tooltip: "Total shields on teammates",
                },
                {
                    label: "Damage",
                    value: formatNumber(participant.totalDamageDealtToChampions),
                    tooltip: "Total damage dealt",
                }
            );
        } else if (isSupport) {
            stats.push(
                {
                    label: "Healed",
                    value: formatNumber(participant.totalHealsOnTeammates),
                    tooltip: "Total heals on teammates",
                },
                {
                    label: "Shielded",
                    value: formatNumber(participant.totalDamageShieldedOnTeammates),
                    tooltip: "Total shields on teammates",
                }
            );
        } else {
            stats.push(
                {
                    label: "Damage",
                    value: formatNumber(participant.totalDamageDealtToChampions),
                    tooltip: "Total damage dealt",
                },
                {
                    label: "Minions",
                    value: `${participant.allMinionsKilled} (${Number(participant.minionsPerMinute).toFixed(1)})`,
                    tooltip: "Minions killed (and per minute)",
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
                    className: participant.visionPerMinute >= 2 ? "text-green-500 font-semibold" : "",
                },
                {
                    label: "Wards",
                    value: participant.wardsPlaced.toString(),
                    tooltip: "Wards Placed",
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
                    grid-cols-1
                    xs:grid-cols-2
                    sm:grid-cols-3 
                    gap-x-2
                    sm:gap-y-2
            `}
            >
                {formattedStats.map((stat) =>
                    stat ? (
                        <div
                            key={stat.label}
                            title={stat.tooltip}
                            className={`
                            flex items-center justify-center 
                            w-full h-full
                            px-2 py-1 rounded-sm 
                            bg-zinc-900/80 border border-zinc-700 
                            gap-2
                        `}
                        >
                            <span className="text-xs text-zinc-400 font-semibold">{stat.label}</span>
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