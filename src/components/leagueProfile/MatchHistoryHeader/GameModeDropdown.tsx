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
                className={`bg-gray-800/80 px-3 py-1.5 pr-8 text-sm text-gray-300 focus:outline-none cursor-pointer w-full sm:min-w-[140px] text-left h-8 transition-all duration-200 ${
                    isDropdownOpen ? 'rounded-t-sm rounded-b-none' : 'rounded-sm'
                }`}
            >
                <span className="block truncate">{selectedGameMode}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown 
                        size={16} 
                        className={`text-gray-400 transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180' : 'rotate-0'
                        }`} 
                    />
                </span>
            </button>
            
            {isDropdownOpen && (
                <div className="absolute z-50 w-full max-h-60 overflow-auto rounded-b-sm bg-gray-800 shadow-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {gameModeOptions.map((mode) => (
                        <button
                            key={mode.name}
                            onClick={() => handleOptionSelect(mode.name)}
                            className={`
                                w-full text-left px-3 py-2 text-sm transition-colors duration-150
                                ${selectedGameMode === mode.name 
                                    ? 'bg-blue-600 text-white font-medium' 
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }
                            `}
                        >
                            {mode.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}