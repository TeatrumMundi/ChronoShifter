"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LeagueAccount } from "@/interfaces/interfaces";

export default function Home() {
    const params = useParams();
    const [leagueAccount, setLeagueAccount] = useState<LeagueAccount>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params) return;
        const { tagLine, gameName, activeRegion } = params as { tagLine: string; gameName: string; activeRegion: string };

        fetch(`/api/league?tagLine=${tagLine}&gameName=${gameName}&region=${activeRegion}`)
            .then(res => res.json())
            .then(account => setLeagueAccount(account))
            .catch(() => setError("Failed to fetch League account data."));
    }, [params]);

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {leagueAccount && (
                <>
                    <p>{leagueAccount.riotAccount.puuid}</p>
                    <p>{leagueAccount.riotAccount.tagLine}</p>
                    <p>{leagueAccount.riotAccount.gameName}</p>
                    <p>{leagueAccount.leagueAccountsDetails.summonerLevel}</p>
                    <p>{leagueAccount.leagueAccountsDetails.profileIconId}</p>
                    <p>{leagueAccount.leagueRank[1].rank}</p>
                    <p>{leagueAccount.leagueRank[1].leaguePoints}</p>
                    <p>{leagueAccount.leagueRank[1].queueType}</p>
                    <p>{leagueAccount.leagueRank[1].tier}</p>
                    <p>{leagueAccount.leagueRank[1].wins}</p>
                    <p>{leagueAccount.leagueRank[1].losses}</p>
                    <p>{leagueAccount.leagueRank[1].winRate}</p>
                    <p>{leagueAccount.leagueRank[1].hotStreak ? "Hot Streak" : "Not Hot Streak"}</p>
                    <p>{leagueAccount.leagueRank[0].rank}</p>
                    <p>{leagueAccount.leagueRank[0].leaguePoints}</p>
                    <p>{leagueAccount.leagueRank[0].queueType}</p>
                    <p>{leagueAccount.leagueRank[0].tier}</p>
                    <p>{leagueAccount.leagueRank[0].wins}</p>
                    <p>{leagueAccount.leagueRank[0].losses}</p>
                    <p>{leagueAccount.leagueRank[0].winRate}</p>
                    <p>{leagueAccount.leagueRank[0].hotStreak ? "Hot Streak" : "Not Hot Streak"}</p>
                </>
            )}
        </div>
    );
}