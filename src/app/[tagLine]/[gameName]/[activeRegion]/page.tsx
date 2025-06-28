"use server";

import { saveLeagueAccountDetails } from "@/utils/database/saveLeagueAccountDetails";
import { LeagueRank, Match, RiotAccountDetails } from "@/interfaces/productionTypes";
import PlayerInfo from "@/components/leagueProfile/PlayerBanner/PlayerInfo";
import { MatchHistory } from "@/components/leagueProfile/MatchHistory";
import RankDisplay from "@/components/leagueProfile/RankDisplay";
import { getOrDefaultLeagueRank } from "@/utils/helpers";
import Navbar from "@/components/common/Navbar";
import {
    getAccountByRiotID,
    getActiveRegionByPuuid,
    getSummonerByPuuid,
    getRankedLeagueEntries,
    getRecentMatchesIDsByPuuid,
    getMatchDetailsByMatchID,
    getMatchTimelineByMatchID
} from "@/utils/fetchLeagueAPI";

export default async function Home({params}: { params: Promise<{ tagLine: string; gameName: string; activeRegion: string }>}) 
{
    // Destructure params to get tagLine, gameName, and activeRegion (Europe, Asia, Americas)
    const { tagLine, gameName, activeRegion } = await params;

    // First, get riot account details (required for subsequent calls)
    const riotAccountDetails : RiotAccountDetails = await getAccountByRiotID(tagLine, gameName, activeRegion);
    const region = await getActiveRegionByPuuid(riotAccountDetails.puuid, activeRegion);
    
    // Run region detection and account details fetch in parallel since they both only need puuid and activeRegion
    const [leagueAccountsDetails, leagueRanks, recentMatchesIDs] = await Promise.all([
        getSummonerByPuuid(riotAccountDetails.puuid, activeRegion, region),
        getRankedLeagueEntries(riotAccountDetails.puuid, region),
        getRecentMatchesIDsByPuuid(riotAccountDetails.puuid, activeRegion, 0, 5)
    ]);

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

    // Extract or create default ranks and save data in parallel
    const leagueSoloRank: LeagueRank = getOrDefaultLeagueRank(leagueRanks, "RANKED_SOLO_5x5");
    const leagueFlexRank: LeagueRank = getOrDefaultLeagueRank(leagueRanks, "RANKED_FLEX_SR");
    
    // Save LeagueAccountDetails to database and create/link accounts
    await saveLeagueAccountDetails(leagueAccountsDetails, leagueSoloRank, leagueFlexRank);

    return (
        <div className="relative w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 min-h-screen">
            {/* NAVBAR */}
            <Navbar/>
            {/* MAIN CONTENT */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-12 gap-4">
                    {/* Player Info - Full Width */}
                    <div className="col-span-12 mt-10">
                        <PlayerInfo 
                            gameName={riotAccountDetails.gameName}
                            tagLine={riotAccountDetails.tagLine}
                            profileIconId={leagueAccountsDetails.profileIconId}
                            summonerLevel={leagueAccountsDetails.summonerLevel}
                        />
                    </div>
                    
                    {/* Rank Display - Left Side */}
                    <div className="col-span-12 2xl:col-span-3">
                        <RankDisplay 
                            leagueSoloRank={leagueSoloRank}
                            leagueFlexRank={leagueFlexRank}
                        />
                    </div>
                  
                    
                    <div className="col-span-12 2xl:col-span-9">
                        <MatchHistory 
                            puuid={riotAccountDetails.puuid}
                            region={leagueAccountsDetails.region}
                            recentMatches={recentMatches.filter((m): m is Match => m !== null)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ tagLine: string; gameName: string; activeRegion: string }>}) 
{
    const { tagLine, gameName, activeRegion } = await params;

    return {
      title: `ChronoShifter - ${gameName}#${tagLine.toUpperCase()} - ${activeRegion}`,
      description: `Riot account data for ${gameName}#${tagLine} in ${activeRegion}`,
    };
}