import { Participant } from "@/interfaces/productionTypes";
import { RunesSection } from "./RunesSection";
import { ItemTimelineSection } from "./ItemTimelineSection";
import { SkillOrderSection } from "./SkillOrderSection";
import { useEffect, useState } from "react";

interface MatchBuildTabProps {
    mainPlayer: Participant;
    matchID: string;
}

export function MatchBuildTab({ mainPlayer, matchID }: MatchBuildTabProps) {
    const [enrichedPlayer, setEnrichedPlayer] = useState<Participant>(mainPlayer);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await fetch(`/api/match/${matchID}/timeline?region=${mainPlayer.region}&puuid=${mainPlayer.puuid}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch timeline data');
                }
                
                const timelineData = await response.json();
                
                setEnrichedPlayer({
                    ...mainPlayer,
                    timelineData: timelineData[0]
                });
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch timeline data';
                setError(errorMessage);
                
                // Set enriched player without timeline data
                setEnrichedPlayer(mainPlayer);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTimeline();
    }, [matchID, mainPlayer.puuid, mainPlayer.region, mainPlayer]);

    if (isLoading) {
        return (
            <div className="p-4 flex justify-center">
                <div className="text-gray-500">Loading timeline data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <RunesSection mainPlayer={mainPlayer} />
                <ItemTimelineSection mainPlayer={mainPlayer} />
                <SkillOrderSection mainPlayer={mainPlayer} />
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