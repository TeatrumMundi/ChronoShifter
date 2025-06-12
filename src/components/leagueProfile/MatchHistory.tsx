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

    return (
        <div 
            className="space-y-2 relative"
            style={{ fontFamily: "var(--font-lato)" }}
        >
            <div className="relative z-10">
                <MatchHistoryHeader
                    selectedGameMode={selectedGameMode}
                    selectedPosition={selectedPosition}
                    searchQuery={searchQuery}
                    onGameModeChange={setSelectedGameMode}
                    onPositionChange={setSelectedPosition}
                    onSearchChange={setSearchQuery}
                />
            </div>

            {filteredMatches.length === 0 && (
                <div className="relative p-6 rounded-xl backdrop-blur-xl border border-white/20
                    bg-gradient-to-br from-white/8 via-white/5 to-white/3
                    shadow-xl shadow-black/5 text-center">
                    
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/3 to-purple-400/3 pointer-events-none" />
                    
                    <div className="relative z-10">
                        <p className="text-white/90 tracking-widest text-sm font-medium">
                            {searchQuery.trim() !== "" ? "No matches found for your search." : "No match data found."}
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-2 relative z-0">
                {filteredMatches
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
        </div>
    );
}