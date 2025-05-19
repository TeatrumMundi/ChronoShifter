"use client";

import { RiotAccount } from "@/interfaces/productionTypes";
import { MatchCard } from "./MatchCard";
import { getParticipantByPuuid } from "@/utils/helpers";

interface MatchHistoryProps {
    riotAccount: RiotAccount;
}

export function MatchHistory({ riotAccount }: MatchHistoryProps) {
    const recentMatches = riotAccount.leagueAccount.recentMatches.slice(0, 5);

    return (
        <div className="space-y-2">
            {recentMatches.length === 0 && (
                <div className="p-6 bg-gray-800/80 rounded-xl text-gray-300 text-center tracking-[.25em]">
                    No match data found.
                </div>
            )}

            {recentMatches
                .map((match) => {
                    const participant = getParticipantByPuuid(match, riotAccount.riotAccountDetails.puuid);
                    if (!participant) return null;
                    return (
                        <MatchCard
                            key={match.matchId}
                            match={match}
                            participant={participant}
                            activeRegion={riotAccount.leagueAccount.leagueAccountsDetails.activeRegion}
                        />
                    );
                })
                .filter(Boolean)} 
        </div>
    );
}