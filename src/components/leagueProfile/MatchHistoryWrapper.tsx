import { Match } from "@/interfaces/productionTypes";
import { MatchHistory } from "./MatchHistory";
import {
    getRecentMatchesIDsByPuuid,
    getMatchDetailsByMatchID,
    getMatchTimelineByMatchID
} from "@/utils/fetchLeagueAPI";
import { saveMatchHistory } from "@/utils/database/saveMatchData";

interface MatchHistoryWrapperProps {
    puuid: string;
    region: string;
    activeRegion: string;
}

export async function MatchHistoryWrapper({ puuid, region, activeRegion }: MatchHistoryWrapperProps) {
    // Fetch recent match IDs
    const recentMatchesIDs = await getRecentMatchesIDsByPuuid(puuid, activeRegion, 0, 5);

    // Fetch complete match data for each recent match ID
    const recentMatches = await Promise.all(
        recentMatchesIDs.map(async (matchId, index) => {
            try {
                // Fetch match details and timeline data in parallel
                const [matchDetails, timelineData] = await Promise.all([
                    getMatchDetailsByMatchID(matchId, activeRegion, region),
                    getMatchTimelineByMatchID(matchId, activeRegion)
                ]);
                
                if (!matchDetails) {
                    console.warn(`No match details returned for match ${matchId}`);
                    return null;
                }
                if (!timelineData || timelineData.length === 0) {
                    console.warn(`No timeline data returned for match ${matchId}`);
                    return null;
                }
                
                // Create complete Match object with integrated timeline data
                const completeMatch: Match = {
                    ...matchDetails,
                    timelineData: timelineData
                };
                
                return completeMatch;
            } catch (error) {
                console.warn(`Failed to fetch match data for match ${matchId} (index ${index}):`, error);
                return null;
            }
        })
    );

    // Filter out any null values from the recent matches
    const validMatches = recentMatches.filter((match): match is Match => match !== null);
    
    if (validMatches.length > 0) {
        try {
            await saveMatchHistory(validMatches);
            console.log(`Successfully saved ${validMatches.length} matches to database`);
        } catch (error) {
            console.error('Failed to save match history to database:', error);
        }
    }

    return (
        <MatchHistory 
            puuid={puuid}
            region={region}
            recentMatches={validMatches}
        />
    );
}
