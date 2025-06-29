"use server";

import PlayerInfo from "@/components/leagueProfile/PlayerBanner/PlayerInfo";
import { MatchHistoryWrapper } from "@/components/leagueProfile/MatchHistoryWrapper";
import { LoadingSpinner } from "@/components/common";
import RankDisplay from "@/components/leagueProfile/RankDisplay";
import { getOrDefaultLeagueRank } from "@/utils/helpers";
import Navbar from "@/components/common/Navbar";
import { Suspense } from "react";
import { getActiveRegionByPuuid, getRankedLeagueEntries } from "@/utils/fetchLeagueAPI";
import { getLeagueAccountDetails, getRiotAccountDetails } from "@/utils/services";

export default async function Home({params}: { 
    params: Promise<{ tagLine: string; gameName: string; region: string }>;
}) {
    // Destructure params to get tagLine, gameName, and region (Europe, Asia, Americas)
    const { tagLine, gameName, region } = await params;

    // Decode URL-encoded characters
    const decodedTagLine = decodeURIComponent(tagLine);
    const decodedGameName = decodeURIComponent(gameName);
    const decodedRegion = decodeURIComponent(region);

    console.log(`\nLoading profile for ${decodedGameName}#${decodedTagLine} in region: ${decodedRegion}:\n`);

    // Get riot account details
    const riotAccountDetails = await getRiotAccountDetails(decodedTagLine, decodedGameName, decodedRegion);
    const activeRegion = await getActiveRegionByPuuid(riotAccountDetails.puuid, decodedRegion);
    
    // Run account details fetch and ranked entries in parallel
    const [leagueAccountsDetails, leagueRanks] = await Promise.all([
        getLeagueAccountDetails(riotAccountDetails.puuid, decodedRegion, activeRegion),
        getRankedLeagueEntries(riotAccountDetails.puuid, activeRegion)
    ]);

    // Extract or create default ranks
    const leagueSoloRank = getOrDefaultLeagueRank(leagueRanks, "RANKED_SOLO_5x5");
    const leagueFlexRank = getOrDefaultLeagueRank(leagueRanks, "RANKED_FLEX_SR");

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
                            region={decodedRegion}
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
                        <Suspense fallback={<LoadingSpinner />}>
                            <MatchHistoryWrapper 
                                puuid={riotAccountDetails.puuid}
                                region={decodedRegion}
                                activeRegion={activeRegion}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ tagLine: string; gameName: string; region: string }> }) {
    const { tagLine, gameName, region } = await params;
    
    // Decode URL parameters
    const decodedTagLine = decodeURIComponent(tagLine);
    const decodedGameName = decodeURIComponent(gameName);
    const decodedRegion = decodeURIComponent(region);

    return {
      title: `ChronoShifter - ${decodedGameName}#${decodedTagLine.toUpperCase()} - ${decodedRegion}`,
      description: `Riot account data for ${decodedGameName}#${decodedTagLine} in ${decodedRegion}`,
    };
}