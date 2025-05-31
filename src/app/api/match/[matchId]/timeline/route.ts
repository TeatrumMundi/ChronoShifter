import { getMatchTimelineByMatchID } from "@/utils/fetchLeagueAPI/riotEndPoints/getMatchTimelineByMatchID";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ matchId: string }> }
) {
    try {
        const { searchParams } = new URL(request.url);
        const region = searchParams.get('region');
        const puuid = searchParams.get('puuid');

        if (!region || !puuid) {
            return NextResponse.json(
                { error: 'Missing region or puuid parameter' },
                { status: 400 }
            );
        }

        const { matchId } = await params;
        const timelineData = await getMatchTimelineByMatchID(matchId, region, puuid);
        
        return NextResponse.json(timelineData);
    } catch (error) {
        console.error('Error fetching timeline data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch timeline data' },
            { status: 500 }
        );
    }
}