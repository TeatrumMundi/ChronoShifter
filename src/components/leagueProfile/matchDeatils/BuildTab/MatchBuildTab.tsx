import { memo } from "react";
import { Participant, Match } from "@/interfaces/productionTypes";
import { RunesSection } from "./RunesSection";
import { ItemTimelineSection } from "./ItemTimelineSection";
import { SkillOrderSection } from "./SkillOrderSection";
import { getPlayerFromTimelines } from "@/utils/fetchLeagueAPI/getMatchTimelineByMatchID";

interface MatchBuildTabProps {
    mainPlayer: Participant;
    recentMatch: Match;
}

export const MatchBuildTab = memo(function MatchBuildTab({ mainPlayer, recentMatch }: MatchBuildTabProps) {
    // Add safety check for recentMatch existence
    if (!recentMatch) {
        return (
            <div className="relative rounded-xl backdrop-blur-xl border border-white/20 overflow-hidden
                bg-gradient-to-br from-white/5 via-white/3 to-white/5 shadow-xl shadow-black/10">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/2 to-transparent" />
                <div className="relative z-5 p-6 text-center text-white/70">
                    <p>Match data not available</p>
                </div>
            </div>
        );
    }

    // Add safety check for timelineData existence
    const playerTimelineData = recentMatch.timelineData && recentMatch.timelineData.length > 0
        ? getPlayerFromTimelines(recentMatch.timelineData, mainPlayer.puuid)
        : null;

    // Create enriched player object with timeline data
    const enrichedPlayer = {
        ...mainPlayer,
        timelineData: playerTimelineData || undefined
    };

    // Check if runes data is available
    const hasRunes = mainPlayer.runes && mainPlayer.runes.length > 0;

    // If no timeline data is available, show a fallback message or basic info
    if (!recentMatch.timelineData || recentMatch.timelineData.length === 0) {
        return (
            <div className="space-y-4">
                <div className="relative rounded-xl backdrop-blur-xl border border-white/20 overflow-hidden
                    bg-gradient-to-br from-white/5 via-white/3 to-white/5 shadow-xl shadow-black/10">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/2 to-transparent" />
                    <div className="relative z-5 p-6 text-center text-white/70">
                        <p>Timeline data not available for this match</p>
                    </div>
                </div>
                {hasRunes && <RunesSection mainPlayer={enrichedPlayer} />}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {hasRunes && <RunesSection mainPlayer={enrichedPlayer} />}
            <ItemTimelineSection mainPlayer={enrichedPlayer} />
            <SkillOrderSection mainPlayer={enrichedPlayer} />
        </div>
    );
});