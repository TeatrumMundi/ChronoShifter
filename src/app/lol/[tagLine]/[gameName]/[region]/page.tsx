"use server";

import { saveLeagueAccountDetails } from "@/utils/database/saveLeagueAccountDetails";
import { LeagueRank, RiotAccountDetails } from "@/interfaces/productionTypes";
import PlayerInfo from "@/components/leagueProfile/PlayerBanner/PlayerInfo";
import { MatchHistoryWrapper } from "@/components/leagueProfile/MatchHistoryWrapper";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import RankDisplay from "@/components/leagueProfile/RankDisplay";
import { getOrDefaultLeagueRank } from "@/utils/helpers";
import Navbar from "@/components/common/Navbar";
import { Suspense } from "react";
import {
    getAccountByRiotID,
    getActiveRegionByPuuid,
    getSummonerByPuuid,
    getRankedLeagueEntries
} from "@/utils/fetchLeagueAPI";

export default async function Home({params}: { params: Promise<{ tagLine: string; gameName: string; region: string }>}) 
{
    // Destructure params to get tagLine, gameName, and region (Europe, Asia, Americas)
    const { tagLine, gameName, region } = await params;

    // First, get riot account details (required for subsequent calls)
    const riotAccountDetails : RiotAccountDetails = await getAccountByRiotID(tagLine, gameName, region);
    const activeRegion = await getActiveRegionByPuuid(riotAccountDetails.puuid, region);
    
    // Run region detection and account details fetch in parallel since they both only need puuid and region
    const [leagueAccountsDetails, leagueRanks] = await Promise.all([
        getSummonerByPuuid(riotAccountDetails.puuid, region, activeRegion),
        getRankedLeagueEntries(riotAccountDetails.puuid, activeRegion)
    ]);

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
                        <Suspense fallback={<LoadingSpinner />}>
                            <MatchHistoryWrapper 
                                puuid={riotAccountDetails.puuid}
                                region={region}
                                activeRegion={activeRegion}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ tagLine: string; gameName: string; region: string }>}) 
{
    const { tagLine, gameName, region } = await params;

    return {
      title: `ChronoShifter - ${gameName}#${tagLine.toUpperCase()} - ${region}`,
      description: `Riot account data for ${gameName}#${tagLine} in ${region}`,
    };
}