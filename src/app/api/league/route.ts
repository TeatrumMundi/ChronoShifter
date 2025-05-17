import { NextRequest, NextResponse } from "next/server";
import { createLeagueAccount } from "@/utils/fetchLeagueAPI/accountData";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const tagLine = searchParams.get("tagLine") || "";
    const gameName = searchParams.get("gameName") || "";
    const region = searchParams.get("region") || "";

    try {
        const account = await createLeagueAccount(tagLine, gameName, region);
        return NextResponse.json(account);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch League account data." + error }, { status: 500 });
    }
}