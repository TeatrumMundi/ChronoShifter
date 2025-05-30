"use client";

import { PositionFilter } from "./PositionFilter";
import { GameModeDropdown } from "./GameModeDropdown";
import { SearchInput } from "./SearchInput";

interface MatchHistoryHeaderProps {
    selectedGameMode: string;
    selectedPosition: string;
    searchQuery: string;
    onGameModeChange: (gameMode: string) => void;
    onPositionChange: (position: string) => void;
    onSearchChange: (query: string) => void;
}

export function MatchHistoryHeader({
    selectedGameMode,
    selectedPosition,
    searchQuery,
    onGameModeChange,
    onPositionChange,
    onSearchChange
}: MatchHistoryHeaderProps) {
    return (
        <div className="text-gray-300 bg-gray-900/60 rounded-sm text-lg font-semibold overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-stretch gap-3">
                <span className="bg-blue-600 flex items-center justify-center px-4 py-2 -ml-4 lg:-ml-0 lg:pl-4">
                    Match History
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 py-2 lg:py-0">
                    <PositionFilter 
                        selectedPosition={selectedPosition}
                        onPositionChange={onPositionChange}
                    />
                    
                    <GameModeDropdown 
                        selectedGameMode={selectedGameMode}
                        onGameModeChange={onGameModeChange}
                    />

                    <SearchInput 
                        searchQuery={searchQuery}
                        onSearchChange={onSearchChange}
                    />
                </div>
            </div>
        </div>
    );
}