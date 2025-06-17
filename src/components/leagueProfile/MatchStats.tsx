import { Participant } from "@/interfaces/productionTypes";
import { JSX } from "react";

type StatItem = {
    label: string;
    value: string | JSX.Element;
    tooltip?: string;
    className?: string;
    highlight?: boolean;
};

export function MatchStats({ participant, gameMode }: {
    participant: Participant;
    gameMode: string;
}) {
    const isArena = gameMode === "Arena";
    const isSupport = participant.teamPosition === "UTILITY";
    const formatNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

    // Helper function to create stat objects
    const createStat = (label: string, value: string | JSX.Element, tooltip: string, className?: string, highlight?: boolean): StatItem => ({
        label, value, tooltip, className, highlight
    });

    // Helper for CS display
    const csValue = (
        <div className="flex items-center gap-1">
            <span>{participant.allMinionsKilled}</span>
            <span className="text-white/60 text-xs">({Number(participant.minionsPerMinute).toFixed(1)})</span>
        </div>
    );

    // Helper for Vision display
    const visionValue = (
        <div className="flex items-center gap-1">
            <span>{participant.visionScore}</span>
            <span className="text-white/60 text-xs">({participant.visionPerMinute})</span>
        </div>
    );

    // Base stats (always shown)
    const baseStats: StatItem[] = [
        createStat("KDA", (
            <div className="flex items-center gap-0.5">
                <span className="text-emerald-300 font-bold">{participant.kills}</span>
                <span className="text-white/60">/</span>
                <span className="text-rose-300 font-bold">{participant.deaths}</span>
                <span className="text-white/60">/</span>
                <span className="text-blue-300 font-bold">{participant.assists}</span>
            </div>
        ), "Kills / Deaths / Assists (KDA)"),
        // Only show gold for non-support roles
        ...(!isSupport ? [
            createStat("Gold", formatNumber(participant.goldEarned), "Gold earned in the match", "text-yellow-300 font-semibold"),
        ] : []),
    ];

    // Conditional stats based on game mode and role
    const conditionalStats: StatItem[] = [
        // Healing and shielding (Arena or Support)
        ...(isArena || isSupport ? [
            createStat("Healed", formatNumber(participant.totalHealsOnTeammates), "Total heals on teammates", "text-green-300 font-semibold"),
            createStat("Shielded", formatNumber(participant.totalDamageShieldedOnTeammates), "Total shields on teammates", "text-blue-300 font-semibold"),
        ] : []),
        
        // Damage (always shown)
        createStat("Damage", formatNumber(participant.totalDamageDealtToChampions), "Total damage dealt", "text-red-300 font-semibold"),
        
        // CS (non-support, non-arena)
        ...(!isSupport && !isArena ? [
            createStat("CS", csValue, "Minions killed (and per minute)", 
                participant.minionsPerMinute >= 8 ? "text-emerald-300 font-bold" : "text-white/90",
                participant.minionsPerMinute >= 8),
        ] : []),
        
        // Vision stats (non-arena)
        ...(!isArena ? [
            createStat("Vision", visionValue, "Vision Score",
                participant.visionPerMinute >= 2 ? "text-emerald-300 font-bold" : "text-white/90",
                participant.visionPerMinute >= 2),
            createStat("Wards", participant.wardsPlaced.toString(), "Wards Placed", "text-purple-300 font-semibold"),
        ] : []),
    ];

    return (
        <div className="w-full">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
                {[...baseStats, ...conditionalStats].map((stat) => (
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
                ))}
            </div>
        </div>
    );
}