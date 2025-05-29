import { Participant, RecentMatch } from "@/interfaces/productionTypes";

export function formatRole(position?: string): string {
    const roleMap: Record<string, string> = {
        BOTTOM: "ADC",
        UTILITY: "Support",
        MIDDLE: "Mid",
    };
    return roleMap[position?.toUpperCase() ?? ""] || position || "";
}

export function getOrdinalPlacement(placement: number): string {
    const ordinals = ["th", "st", "nd", "rd"];
    const v = placement % 100;
    return placement + (ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0]);
}

export function secToHHMMSS(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num: number): string => num < 10 ? `0${num}` : num.toString();

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    }
    if (minutes > 0) {
        return `${pad(minutes)}:${pad(remainingSeconds)}`;
    }
    return `00:${pad(remainingSeconds)}`;
}

export function timeAgo(timestamp: number | bigint): string {
    const now = BigInt(Date.now());
    const ts = BigInt(timestamp);
    const difference = now - ts;

    const intervals = {
        year: BigInt(31536000000),
        month: BigInt(2592000000),
        day: BigInt(86400000),
        hour: BigInt(3600000),
        minute: BigInt(60000),
        second: BigInt(1000),
    };

    if (difference < intervals.minute) {
        const seconds = difference / intervals.second;
        return `${seconds} second${seconds !== BigInt(1) ? 's' : ''} ago`;
    } else if (difference < intervals.hour) {
        const minutes = difference / intervals.minute;
        return `${minutes} minute${minutes !== BigInt(1) ? 's' : ''} ago`;
    } else if (difference < intervals.day) {
        const hours = difference / intervals.hour;
        return `${hours} hour${hours !== BigInt(1) ? 's' : ''} ago`;
    } else if (difference < intervals.month) {
        const days = difference / intervals.day;
        return `${days} day${days !== BigInt(1) ? 's' : ''} ago`;
    } else if (difference < intervals.year) {
        const months = difference / intervals.month;
        return `${months} month${months !== BigInt(1) ? 's' : ''} ago`;
    } else {
        const years = difference / intervals.year;
        return `${years} year${years !== BigInt(1) ? 's' : ''} ago`;
    }
}

export function getKDA(kills: number, deaths: number, assists: number): string {
    if (deaths === 0) {
        return "Perfect";
    }
    const kda = ((kills + assists) / deaths).toFixed(2);
    return kda.toString();
}

export function getMinionsPerMinute(seconds: number, totalMinions: number): number {
    const minutes = Math.floor((seconds % 3600) / 60);
    if (minutes === 0) return 0; // Avoid division by zero
    return Number((totalMinions / minutes).toFixed(2));
}

export function getParticipantByPuuid(matchData: RecentMatch, puuid: string): Participant | null {
    return matchData.matchDetails.participants.find(participant => participant.puuid === puuid) ?? null;
}

export const ServerMAP: Record<string, string> = {
    EUN1: "eune",
    EUW1: "euw",
    JP1: "jp",
    KR: "kr",
    LA1: "lan",
    LA2: "las",
    ME1: "me",
    NA1: "na",
    OC1: "oce",
    RU: "ru",
    SG2: "sea",
    TR1: "tr",
    TW2: "tw",
    VN2: "vn"
};

export function calculatePerformanceScore(participant: Participant, timeInSeconds: number): number {
    const isUtility = participant.individualPosition.toUpperCase() === "UTILITY";
    const timeInMinutes = timeInSeconds / 60;
    
    // Per-minute benchmarks (good performance rates)
    const benchmarks = {
        killsPerMinute: 0.4,
        assistsPerMinute: 0.6,
        deathsPerMinute: 0.25,
        goldPerMinute: 350,
        visionScorePerMinute: 1.2,
        wardsPerMinute: 0.5,
        damagePerMinute: 800,
        healsPerMinute: 150,
        shieldsPerMinute: 120,
    };

    // Calculate per-minute stats
    const stats = {
        killsPerMin: participant.kills / timeInMinutes,
        assistsPerMin: participant.assists / timeInMinutes,
        deathsPerMin: participant.deaths / timeInMinutes,
        goldPerMin: participant.goldEarned / timeInMinutes,
        visionScorePerMin: participant.visionScore / timeInMinutes,
        wardsPerMin: participant.wardsPlaced / timeInMinutes,
        damagePerMin: participant.totalDamageDealtToChampions / timeInMinutes,
        healsPerMin: participant.totalHealsOnTeammates / timeInMinutes,
        shieldsPerMin: participant.totalDamageShieldedOnTeammates / timeInMinutes,
    };

    // Normalize stats against benchmarks (cap at 100% for each metric)
    const normalizedStats = {
        kills: Math.min(1, stats.killsPerMin / benchmarks.killsPerMinute),
        assists: Math.min(1, stats.assistsPerMin / benchmarks.assistsPerMinute),
        deaths: Math.min(1, 1 - (stats.deathsPerMin / benchmarks.deathsPerMinute)), // Inverted (fewer deaths = better)
        gold: Math.min(1, stats.goldPerMin / benchmarks.goldPerMinute),
        visionScore: Math.min(1, stats.visionScorePerMin / benchmarks.visionScorePerMinute),
        wards: Math.min(1, stats.wardsPerMin / benchmarks.wardsPerMinute),
        damage: Math.min(1, stats.damagePerMin / benchmarks.damagePerMinute),
        heals: Math.min(1, stats.healsPerMin / benchmarks.healsPerMinute),
        shields: Math.min(1, stats.shieldsPerMin / benchmarks.shieldsPerMinute),
        cs: Math.min(1, participant.minionsPerMinute / 8), // 8 CS/min is good benchmark
    };

    let score: number;

    if (isUtility) {
        // Support scoring - emphasize vision, healing, shielding, and assists
        score =
            normalizedStats.heals * 25 +
            normalizedStats.shields * 20 +
            normalizedStats.visionScore * 15 +
            normalizedStats.wards * 10 +
            normalizedStats.assists * 15 +
            normalizedStats.kills * 5 +
            normalizedStats.deaths * 10;
    } else {
        // Other roles - emphasize damage, kills, gold, and CS
        score =
            normalizedStats.kills * 25 +
            normalizedStats.damage * 20 +
            normalizedStats.gold * 15 +
            normalizedStats.cs * 15 +
            normalizedStats.assists * 10 +
            normalizedStats.visionScore * 5 +
            normalizedStats.deaths * 10;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
}

// Helper function to clean and format the item description.
// It replaces <br> and <li> tags with newlines, then removes remaining tags.
export const cleanItemDescription = (text: string): string => {
    return text
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<li>/gi, "\n")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .trim();
};