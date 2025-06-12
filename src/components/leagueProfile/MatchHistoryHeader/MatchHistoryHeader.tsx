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
        <div className="relative rounded-xl backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/10"
            style={{
                background: `linear-gradient(135deg, 
                    rgba(59, 130, 246, 0.15) 0%, 
                    rgba(37, 99, 235, 0.12) 100%),
                    rgba(255, 255, 255, 0.05)`
            }}>
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/5 to-indigo-400/3 pointer-events-none" />
            
            <div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-stretch">
                <div className="px-4 py-3 rounded-t-xl lg:rounded-t-none lg:rounded-l-xl
                    bg-blue-600/20 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-white/20
                    flex items-center justify-center lg:justify-start">
                    <span className="text-lg font-semibold text-white/95">
                        Match History
                    </span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 py-2">
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