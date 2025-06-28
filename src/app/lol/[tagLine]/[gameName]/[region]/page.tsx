"use server";

import { saveLeagueAccountDetails } from "@/utils/database/saveLeagueAccountDetails";
import { getLeagueAccountFromDatabase } from "@/utils/database/getLeagueAccountFromDatabase";
import { LeagueRank, RiotAccountDetails, LeagueAccountDetails } from "@/interfaces/productionTypes";
import PlayerInfo from "@/components/leagueProfile/PlayerBanner/PlayerInfo";
import { MatchHistoryWrapper } from "@/components/leagueProfile/MatchHistoryWrapper";
import { LoadingSpinner } from "@/components/common";
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

export default async function Home({params, searchParams}: { 
    params: Promise<{ tagLine: string; gameName: string; region: string }>;
    searchParams: Promise<{ refresh?: string }>;
}) {
    // Destructure params to get tagLine, gameName, and region (Europe, Asia, Americas)
    const { tagLine, gameName, region } = await params;
    const { refresh } = await searchParams;
    
    // Check if user wants to force refresh (bypass cache)
    const forceRefresh = refresh === 'true';

    // First, try to get data from database (unless force refresh is requested)
    console.log(`\n🔎 Checking database for user: ${gameName}#${tagLine} in region: ${region}${forceRefresh ? ' (force refresh)' : ''}\n`);
    const cachedData = forceRefresh ? null : await getLeagueAccountFromDatabase(gameName, tagLine, region);
    
    let riotAccountDetails: RiotAccountDetails;
    let leagueAccountsDetails: LeagueAccountDetails;
    let leagueSoloRank: LeagueRank;
    let leagueFlexRank: LeagueRank;
    let activeRegion: string;
    let isFromCache = false;

    if (cachedData && !forceRefresh) {
        // Use cached data from database
        console.log(`\n✅ Found cached data for ${gameName}#${tagLine}\n`);
        riotAccountDetails = cachedData.riotAccountDetails;
        leagueAccountsDetails = cachedData.leagueAccountDetails;
        leagueSoloRank = cachedData.leagueSoloRank;
        leagueFlexRank = cachedData.leagueFlexRank;
        activeRegion = cachedData.activeRegion;
        isFromCache = true;
    } else {
        // No cached data found or force refresh requested, fetch from API
        const reason = forceRefresh ? 'force refresh requested' : 'no cached data found';
        console.log(`\n📡 Fetching from API for ${gameName}#${tagLine}: ${reason}\n`);
        
        // First, get riot account details (required for subsequent calls)
        riotAccountDetails = await getAccountByRiotID(tagLine, gameName, region);
        activeRegion = await getActiveRegionByPuuid(riotAccountDetails.puuid, region);
        
        // Run region detection and account details fetch in parallel since they both only need puuid and region
        const [leagueAccountsDetailsApi, leagueRanks] = await Promise.all([
            getSummonerByPuuid(riotAccountDetails.puuid, region, activeRegion),
            getRankedLeagueEntries(riotAccountDetails.puuid, activeRegion)
        ]);

        leagueAccountsDetails = leagueAccountsDetailsApi;

        // Extract or create default ranks and save data in parallel
        leagueSoloRank = getOrDefaultLeagueRank(leagueRanks, "RANKED_SOLO_5x5");
        leagueFlexRank = getOrDefaultLeagueRank(leagueRanks, "RANKED_FLEX_SR");
        
        // Save LeagueAccountDetails to database and create/link accounts
        await saveLeagueAccountDetails(leagueAccountsDetails, leagueSoloRank, leagueFlexRank);
        console.log(`\n💾 Saved ${forceRefresh ? 'refreshed' : 'new'} data for ${gameName}#${tagLine} to database\n`);
        isFromCache = false;
    }

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
                            region={region}
                            isFromCache={isFromCache}
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

export async function generateMetadata({ params }: { params: Promise<{ tagLine: string; gameName: string; region: string }> }) {
    const { tagLine, gameName, region } = await params;

    return {
      title: `ChronoShifter - ${gameName}#${tagLine.toUpperCase()} - ${region}`,
      description: `Riot account data for ${gameName}#${tagLine} in ${region}`,
    };
}