"use client";

import { MatchHistoryHeader } from "./MatchHistoryHeader/MatchHistoryHeader";
import { RiotAccount } from "@/interfaces/productionTypes";
import { gameModeOptions, getParticipantByPuuid, positionToApiMap } from "@/utils/helpers";
import { MatchCard } from "./MatchCard";
import { useState } from "react";

interface MatchHistoryProps {
    riotAccount: RiotAccount;
}

export function MatchHistory({ riotAccount }: MatchHistoryProps) {
    const [selectedGameMode, setSelectedGameMode] = useState("All Matches");
    const [selectedPosition, setSelectedPosition] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter matches based on selected game mode, position and search query
    const filteredMatches = riotAccount.leagueAccount.recentMatches.filter((match) => {

        // Filter by game mode
        const selectedMode = gameModeOptions.find(mode => mode.name === selectedGameMode);
        let gameModeMatch = true;
        
        if (selectedMode && selectedMode.queueIds.length > 0) {
            gameModeMatch = selectedMode.queueIds.includes(match.matchDetails.queueId);
        }

        // Filter by position
        let positionMatch = true;
        if (selectedPosition !== "ALL") {
            const participant = getParticipantByPuuid(match, riotAccount.riotAccountDetails.puuid);
            if (participant) {
                const allowedPositions = positionToApiMap[selectedPosition] || [];
                positionMatch = allowedPositions.includes(participant.teamPosition);
            }
        }

        // Filter by search query
        let searchMatch = true;
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase().trim();
            searchMatch = match.matchDetails.participants.some(participant => {
                // Check player names
                const playerNameMatch = 
                    participant.riotIdGameName?.toLowerCase().includes(query) ||
                    participant.summonerName?.toLowerCase().includes(query) ||
                    `${participant.riotIdGameName}#${participant.riotIdTagline}`.toLowerCase().includes(query);
                
                // Check champion names
                const championMatch = participant.champion.name?.toLowerCase().includes(query);
                
                return playerNameMatch || championMatch;
            });
        }

        return gameModeMatch && positionMatch && searchMatch;
    });

    const recentMatches = filteredMatches.slice(0, 5);

    return (
        <div 
            className="space-y-2"
            style={{ fontFamily: "var(--font-lato)" }}
        >
            <MatchHistoryHeader
                selectedGameMode={selectedGameMode}
                selectedPosition={selectedPosition}
                searchQuery={searchQuery}
                onGameModeChange={setSelectedGameMode}
                onPositionChange={setSelectedPosition}
                onSearchChange={setSearchQuery}
            />

            {recentMatches.length === 0 && (
                <div className="p-6 bg-gray-800/80 rounded-sm text-gray-300 text-center tracking-[.25em]">
                    {searchQuery.trim() !== "" ? "No matches found for your search." : "No match data found."}
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
                            region={riotAccount.leagueAccount.leagueAccountsDetails.region}
                        />
                    );
                })
                .filter(Boolean)} 
        </div>
    );
}