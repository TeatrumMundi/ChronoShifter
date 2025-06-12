"use client";

import { Participant } from "@/interfaces/productionTypes";
import { useState, useEffect, JSX } from "react";

type StatItem = {
    label: string;
    value: string | JSX.Element;
    tooltip?: string;
    className?: string;
    highlight?: boolean;
} | null;

export function MatchStats({ participant, gameMode }: {
    participant: Participant;
    gameMode: string;
}) {
    const isArena = gameMode === "Arena";
    const isSupport = participant.teamPosition === "UTILITY";
    const [formattedStats, setFormattedStats] = useState<StatItem[]>([]);

    useEffect(() => {
        const formatNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

        const stats: StatItem[] = [
            {
                label: "KDA",
                value: (
                    <div className="flex items-center gap-0.5">
                        <span className="text-emerald-300 font-bold">{participant.kills}</span>
                        <span className="text-white/60">/</span>
                        <span className="text-rose-300 font-bold">{participant.deaths}</span>
                        <span className="text-white/60">/</span>
                        <span className="text-blue-300 font-bold">{participant.assists}</span>
                    </div>
                ),
                tooltip: "Kills / Deaths / Assists (KDA)",
            },
            {
                label: "Gold",
                value: formatNumber(participant.goldEarned),
                tooltip: "Gold earned in the match",
                className: "text-yellow-300 font-semibold",
            },
        ];

        if (isArena) {
            stats.push(
                {
                    label: "Healed",
                    value: formatNumber(participant.totalHealsOnTeammates),
                    tooltip: "Total heals on teammates",
                    className: "text-green-300 font-semibold",
                },
                {
                    label: "Shielded",
                    value: formatNumber(participant.totalDamageShieldedOnTeammates),
                    tooltip: "Total shields on teammates",
                    className: "text-blue-300 font-semibold",
                },
                {
                    label: "Damage",
                    value: formatNumber(participant.totalDamageDealtToChampions),
                    tooltip: "Total damage dealt",
                    className: "text-red-300 font-semibold",
                }
            );
        } else if (isSupport) {
            stats.push(
                {
                    label: "Healed",
                    value: formatNumber(participant.totalHealsOnTeammates),
                    tooltip: "Total heals on teammates",
                    className: "text-green-300 font-semibold",
                },
                {
                    label: "Shielded",
                    value: formatNumber(participant.totalDamageShieldedOnTeammates),
                    tooltip: "Total shields on teammates",
                    className: "text-blue-300 font-semibold",
                }
            );
        } else {
            stats.push(
                {
                    label: "Damage",
                    value: formatNumber(participant.totalDamageDealtToChampions),
                    tooltip: "Total damage dealt",
                    className: "text-red-300 font-semibold",
                },
                {
                    label: "CS",
                    value: (
                        <div className="flex items-center gap-1">
                            <span>{participant.allMinionsKilled}</span>
                            <span className="text-white/60 text-xs">
                                ({Number(participant.minionsPerMinute).toFixed(1)})
                            </span>
                        </div>
                    ),
                    tooltip: "Minions killed (and per minute)",
                    className: participant.minionsPerMinute >= 8 ? "text-emerald-300 font-bold" : "text-white/90",
                    highlight: participant.minionsPerMinute >= 8,
                }
            );
        }

        if (!isArena) {
            stats.push(
                {
                    label: "Vision",
                    value: (
                        <div className="flex items-center gap-1">
                            <span>{participant.visionScore}</span>
                            <span className="text-white/60 text-xs">
                                ({participant.visionPerMinute})
                            </span>
                        </div>
                    ),
                    tooltip: "Vision Score",
                    className: participant.visionPerMinute >= 2 ? "text-emerald-300 font-bold" : "text-white/90",
                    highlight: participant.visionPerMinute >= 2,
                },
                {
                    label: "Wards",
                    value: participant.wardsPlaced.toString(),
                    tooltip: "Wards Placed",
                    className: "text-purple-300 font-semibold",
                }
            );
        }

        setFormattedStats(stats);
    }, [participant, gameMode, isArena, isSupport]);

    return (
        <div className="w-full">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
                {formattedStats.map((stat) =>
                    stat ? (
                        <div
                            key={stat.label}
                            title={stat.tooltip}
                            className={`
                                relative p-1.5 rounded-md backdrop-blur-sm border
                                bg-white/5 border-white/15
                                hover:bg-white/10 hover:border-white/25
                                transition-all duration-200 ease-out
                                ${stat.highlight ? 'ring-1 ring-emerald-400/30 bg-emerald-500/5' : ''}
                            `}
                        >
                            {/* Stat Content */}
                            <div className="flex flex-col space-y-0.5">
                                {/* Label */}
                                <span className="text-xs font-medium text-white/60 uppercase tracking-wide">
                                    {stat.label}
                                </span>
                                
                                {/* Value */}
                                <div className={`text-xs font-semibold ${stat.className || 'text-white/90'}`}>
                                    {stat.value}
                                </div>
                            </div>

                            {/* Highlight glow for good performance */}
                            {stat.highlight && (
                                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-emerald-400/5 to-green-400/5 pointer-events-none" />
                            )}
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
}