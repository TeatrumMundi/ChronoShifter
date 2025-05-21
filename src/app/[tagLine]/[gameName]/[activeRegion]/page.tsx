import { createRiotAccount } from "@/utils/fetchLeagueAPI/accountData";
import { RiotAccount } from "@/interfaces/productionTypes";
import AccountProfile from "@/components/leagueProfile/AccountProfile";
import { notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";

export default async function Home({params}: 
{ params: 
  Promise<{ tagLine: string; gameName: string; activeRegion: string }>}) 
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
                    <div className="col-span-12 mt-10">
                        <AccountProfile riotAccount={riotAccount} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: 
{ params: 
  Promise<{ tagLine: string; gameName: string; activeRegion: string }>}) {
  const { tagLine, gameName, activeRegion } = await params;

  return {
    title: `ChronoShifter - ${gameName}#${tagLine.toUpperCase()} - ${activeRegion}`,
    description: `Riot account data for ${gameName}#${tagLine} in ${activeRegion}`,
  };
}