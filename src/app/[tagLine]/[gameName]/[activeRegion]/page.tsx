import { createRiotAccount } from "@/utils/fetchLeagueAPI/accountData";
import { RiotAccount } from "@/interfaces/interfaces";
import AccountProfile from "@/components/AccountProfile";

export default async function Home({params}: 
{ params: 
  Promise<{ tagLine: string; gameName: string; activeRegion: string }>}) 
{
  const { tagLine, gameName, activeRegion } = await params;

  try {
    const riotAccount: RiotAccount = await createRiotAccount(
      tagLine,
      gameName,
      activeRegion
    );

    return <AccountProfile riotAccount={riotAccount}/>;
  } catch (error) {
    return (
      <div>
        <p style={{ color: "red" }}>
          Failed to fetch Riot account data: {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
    );
  }
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