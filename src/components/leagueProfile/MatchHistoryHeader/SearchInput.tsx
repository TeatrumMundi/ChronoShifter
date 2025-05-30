"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function SearchInput({ searchQuery, onSearchChange }: SearchInputProps) {
    return (
        <div className="relative w-full sm:w-64">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search teammate or champion"
                className="bg-gray-800/80 rounded-sm px-3 py-1.5 pr-8 text-sm text-gray-300 placeholder-gray-600 focus:outline-none w-full h-8"
            />
            <Search 
                size={16} 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" 
            />
        </div>
    );
}