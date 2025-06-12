"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function SearchInput({ searchQuery, onSearchChange }: SearchInputProps) {
    return (
        <div className="relative w-full sm:w-64">
            <div className="relative rounded-lg backdrop-blur-sm border border-white/20 h-8 overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.08) 0%, 
                        rgba(255, 255, 255, 0.05) 100%),
                        rgba(255, 255, 255, 0.03)`
                }}>
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 to-white/3 pointer-events-none" />
                
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search teammate or champion"
                    className="relative z-10 w-full h-full px-3 pr-8 text-sm text-white/90 placeholder-white/50 
                        bg-transparent border-0 outline-none focus:ring-0"
                />
                <Search 
                    size={16} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none z-20" 
                />
            </div>
        </div>
    );
}