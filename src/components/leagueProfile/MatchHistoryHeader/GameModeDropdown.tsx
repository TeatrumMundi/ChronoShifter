"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { gameModeOptions } from "@/utils/helpers";

interface GameModeDropdownProps {
    selectedGameMode: string;
    onGameModeChange: (gameMode: string) => void;
}

export function GameModeDropdown({ selectedGameMode, onGameModeChange }: GameModeDropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleOptionSelect = (modeName: string) => {
        onGameModeChange(modeName);
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative w-full sm:w-auto">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`backdrop-blur-sm border border-white/20 px-3 py-1.5 pr-8 text-sm text-white/90 
                    focus:outline-none cursor-pointer w-full sm:min-w-[140px] text-left h-8 
                    transition-all duration-200 hover:bg-white/10 hover:border-white/30
                    ${isDropdownOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
                style={{
                    background: `linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.08) 0%, 
                        rgba(255, 255, 255, 0.05) 100%),
                        rgba(255, 255, 255, 0.03)`
                }}
            >
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/3 pointer-events-none rounded-lg" />
                
                <span className="relative z-10 block truncate">{selectedGameMode}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none z-10">
                    <ChevronDown 
                        size={16} 
                        className={`text-white/60 transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180' : 'rotate-0'
                        }`} 
                    />
                </span>
            </button>
            
            {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 max-h-60 overflow-auto rounded-b-lg backdrop-blur-xl 
                    border border-t-0 border-white/30 shadow-2xl shadow-black/20 z-50
                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    style={{
                        background: `linear-gradient(135deg, 
                            rgba(30, 41, 59, 0.95) 0%, 
                            rgba(15, 23, 42, 0.92) 100%),
                            rgba(255, 255, 255, 0.08)`
                    }}>
                    {/* Backdrop for readability */}
                    <div className="absolute inset-0 rounded-b-lg bg-slate-900/60 backdrop-blur-sm pointer-events-none" />
                    
                    {gameModeOptions.map((mode) => (
                        <button
                            key={mode.name}
                            onClick={() => handleOptionSelect(mode.name)}
                            className={`relative z-10 w-full text-left px-3 py-2 text-sm transition-all duration-200
                                ${selectedGameMode === mode.name 
                                    ? 'bg-blue-600/40 text-white font-medium backdrop-blur-sm' 
                                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {mode.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}