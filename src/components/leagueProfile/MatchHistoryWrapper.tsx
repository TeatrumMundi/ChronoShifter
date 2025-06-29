import { MatchHistory } from "./MatchHistory";
import { getMatchHistory } from "@/utils/services";

interface MatchHistoryWrapperProps {
    puuid: string;
    region: string;
    activeRegion: string;
    force?: boolean; // Optional prop to force refresh
}

export async function MatchHistoryWrapper({ puuid, region, activeRegion, force = false }: MatchHistoryWrapperProps) {
    try {
        // Fetch recent matches for the player
        const recentMatches = await getMatchHistory(puuid, region, activeRegion, 0, 5, force);
        
        console.log(`✅ Retrieved ${recentMatches.length} matches for player`);

        return (
            <MatchHistory 
                puuid={puuid}
                recentMatches={recentMatches}
            />
        );
    } catch (error) {
        console.error('Failed to fetch match history:', error);
        
        // Return empty match history on error
        return (
            <MatchHistory 
                puuid={puuid}
                recentMatches={[]}
            />
        );
    }
}
