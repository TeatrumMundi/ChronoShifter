import { createRiotAccount } from "@/utils/fetchLeagueAPI/accountData";
import { RiotAccount } from "@/interfaces/productionTypes";
import AccountProfile from "@/components/leagueProfile/AccountProfile";
import { notFound } from "next/navigation";

export default async function Home({params}: 
{ params: 
  Promise<{ tagLine: string; gameName: string; activeRegion: string }>}) 
{
  const { tagLine, gameName, activeRegion } = await params;


    const riotAccount: RiotAccount = await createRiotAccount(tagLine, gameName, activeRegion);

    if (!riotAccount) {notFound();}

    return <AccountProfile riotAccount={riotAccount}/>;
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