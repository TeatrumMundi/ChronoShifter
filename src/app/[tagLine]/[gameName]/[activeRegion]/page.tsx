"use server";

import { RiotAccount } from "@/interfaces/productionTypes";
import PlayerInfo from "@/components/leagueProfile/PlayerBanner/PlayerInfo";
import { MatchHistory } from "@/components/leagueProfile/MatchHistory";
import RankDisplay from "@/components/leagueProfile/RankDisplay";
import { notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import { createRiotAccount } from "@/utils/fetchLeagueAPI/createRiotAccount";

export default async function Home({params}: { params: Promise<{ tagLine: string; gameName: string; activeRegion: string }>}) 
{
const { tagLine, gameName, activeRegion } = await params;

    const riotAccount: RiotAccount = await createRiotAccount(tagLine, gameName, activeRegion);

    if (!riotAccount) {notFound();}

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
                            gameName={riotAccount.riotAccountDetails.gameName}
                            tagLine={riotAccount.riotAccountDetails.tagLine}
                            profileIconId={riotAccount.leagueAccount.leagueAccountsDetails.profileIconId}
                            summonerLevel={riotAccount.leagueAccount.leagueAccountsDetails.summonerLevel}
                        />
                    </div>
                    
                    {/* Rank Display - Left Side */}
                    <div className="col-span-12 2xl:col-span-3">
                        <RankDisplay 
                            leagueSoloRank={riotAccount.leagueAccount.leagueSoloRank}
                            leagueFlexRank={riotAccount.leagueAccount.leagueFlexRank}
                        />
                    </div>
                    
                    {/* Match History - Right Side */}
                    <div className="col-span-12 2xl:col-span-9">
                        <MatchHistory riotAccount={riotAccount} />
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