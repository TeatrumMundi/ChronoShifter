import { Participant, RecentMatch } from "@/interfaces/productionTypes";
import { RunesSection } from "./RunesSection";
import { ItemTimelineSection } from "./ItemTimelineSection";
import { SkillOrderSection } from "./SkillOrderSection";
import { getPlayerFromTimelines } from "@/utils/fetchLeagueAPI/riotEndPoints/getMatchTimelineByMatchID";

interface MatchBuildTabProps {
    mainPlayer: Participant;
    recentMatch: RecentMatch;
}

export function MatchBuildTab({ mainPlayer, recentMatch }: MatchBuildTabProps) {
    // Add safety check for recentMatch existence
    if (!recentMatch) {
        return (
            <div className="p-4 text-center text-gray-500">
                <p>Match data not available</p>
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

    // If no timeline data is available, show a fallback message or basic info
    if (!recentMatch.timelineData || recentMatch.timelineData.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                <p>Timeline data not available for this match</p>
                <RunesSection mainPlayer={enrichedPlayer} />
            </div>
        );
    }

    return (
        <div className="p-0">
            <RunesSection mainPlayer={enrichedPlayer} />
            <ItemTimelineSection mainPlayer={enrichedPlayer} />
            <SkillOrderSection mainPlayer={enrichedPlayer} />
        </div>
    );
}