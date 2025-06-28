"use client";

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type SearchFormProps = {
    position?: "centered" | "static";
    className?: string;
};

type RecentPlayer = {
    name: string;
    tag: string;
    region: string;
};

type Region = "AMERICAS" | "EUROPE" | "ASIA";

const REGIONS: Region[] = ["AMERICAS", "EUROPE", "ASIA"];
const MAX_RECENT_PLAYERS = 3;
const RECENT_PLAYERS_KEY = "recentPlayers";

export function SearchForm({ position = "centered", className }: SearchFormProps) {
    const router = useRouter();
    const [region, setRegion] = useState<Region>("EUROPE");
    const [error, setError] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [recentPlayers, setRecentPlayers] = useState<RecentPlayer[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(RECENT_PLAYERS_KEY);
        if (saved) {
            try {
                setRecentPlayers(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse recent players:", e);
            }
        }
    }, []);

    const saveRecentPlayer = useCallback((name: string, tag: string, region: string) => {
        const newPlayer = { name, tag, region };
        const updated = [
            newPlayer, 
            ...recentPlayers.filter(p => !(p.name === name && p.tag === tag && p.region === region))
        ].slice(0, MAX_RECENT_PLAYERS);
        
        setRecentPlayers(updated);
        localStorage.setItem(RECENT_PLAYERS_KEY, JSON.stringify(updated));
    }, [recentPlayers]);

    const navigateToProfile = useCallback((name: string, tag: string, region: string) => {
        const url = `/lol/${tag.toLowerCase()}/${name.toLowerCase()}/${region.toLowerCase()}`;
        router.push(url);
    }, [router]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const nickTag = formData.get("nickTag") as string;
        const [name, tag] = nickTag.split("#");
        
        if (!name || !tag) {
            setError("Correct input: NICKNAME#TAG");
            return;
        }
        
        setError("");
        saveRecentPlayer(name, tag, region);
        navigateToProfile(name, tag, region);
    };

    const handleRecentPlayerClick = (player: RecentPlayer) => {
        setIsFocused(false);
        navigateToProfile(player.name, player.tag, player.region);
    };

    const containerClasses = `px-4 ${
        position === "centered"
            ? "absolute top-6/10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl"
            : className ?? "mb-4"
    }`;

    const inputClasses = [
        "min-w-0 px-2 xs:px-3 py-2 pr-10 sm:pr-12",
        "text-xs xs:text-sm sm:text-lg md:text-xl",
        "bg-white/20 border-t border-b border-r border-white/30",
        "rounded-r-sm focus:outline-none text-white placeholder-white/30",
        "tracking-widest transition-all duration-200",
        isFocused && recentPlayers.length > 0 && !error ? "rounded-b-none" : ""
    ].filter(Boolean).join(" ");
    
    return (
        <div className={containerClasses}>
            <form className="relative flex items-center" onSubmit={handleSubmit} noValidate>
                <div 
                    className="flex w-full relative shadow-md transition-shadow duration-200 backdrop-blur-sm"
                    style={{ fontFamily: "var(--font-verminVibes)" }}
                >
                    <div className="flex-shrink-0 min-w-0 w-16 xs:w-24 sm:w-32">
                        <RegionSelector region={region} setRegion={setRegion} />
                    </div>
                    
                    <div className="flex-1 flex flex-col relative min-w-0">
                        <input
                            type="text"
                            name="nickTag"
                            placeholder="NICKNAME#TAG"
                            className={inputClasses}
                            autoComplete="off"
                            spellCheck="false"
                            maxLength={22}
                            required
                            onInput={() => setError("")}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                        />
                        
                        <ErrorMessage error={error} />
                        <RecentSearches 
                            isVisible={isFocused && recentPlayers.length > 0 && !error}
                            players={recentPlayers}
                            onPlayerClick={handleRecentPlayerClick}
                        />
                    </div>
                </div>
                
                <SearchButton />
            </form>
        </div>
    );
}

// Extracted components for better organization
function ErrorMessage({ error }: { error: string }) {
    if (!error) return null;
    
    return (
        <div
            style={{ fontFamily: "var(--font-lato)" }} 
            className="absolute left-0 top-full mt-1 w-full bg-red-700/20 text-white text-base rounded shadow px-3 py-1 animate-fade-in z-10 tracking-widest"
        >
            {error}
        </div>
    );
}

function RecentSearches({ 
    isVisible, 
    players, 
    onPlayerClick 
}: { 
    isVisible: boolean;
    players: RecentPlayer[];
    onPlayerClick: (player: RecentPlayer) => void;
}) {
    if (!isVisible) return null;
    
    return (
        <div
            style={{ fontFamily: "var(--font-verminVibes)" }}
            className="absolute left-0 top-full w-full bg-white/20 backdrop-blur-sm border border-white/30 border-t-0 rounded-b-sm shadow-md z-20"
        >
            <div className="px-3 py-2 text-xs text-white/70 border-b border-white/20 tracking-widest">
                RECENT SEARCHES
            </div>
            {players.map((player, index) => (
                <div
                    key={`${player.name}-${player.tag}-${player.region}-${index}`}
                    onClick={() => onPlayerClick(player)}
                    className="px-3 py-2 text-white hover:bg-white/10 cursor-pointer transition-colors duration-150 tracking-widest text-xs xs:text-sm border-b border-white/10 last:border-b-0 flex justify-between items-center"
                >
                    <span className="truncate">
                        {player.name}#{player.tag}
                    </span>
                    <span className="text-white/60 text-xs ml-2 flex-shrink-0">
                        {player.region}
                    </span>
                </div>
            ))}
        </div>
    );
}

function SearchButton() {
    return (
        <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-sm p-1.5 aspect-square transition duration-200 ease-in-out hover:scale-105 disabled:opacity-50"
            aria-label="Search"
        >
            <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
            </svg>
        </button>
    );
}

function RegionSelector({ 
    region, 
    setRegion 
}: { 
    region: Region;
    setRegion: (region: Region) => void;
}) {
    const buttonClasses = [
        "w-full px-1 xs:px-3 py-2 text-xs xs:text-sm sm:text-lg md:text-xl",
        "bg-white/20 border-t border-b border-l border-white/30 rounded-l-sm",
        "focus:outline-none text-white tracking-widest",
        "min-w-0 truncate overflow-hidden text-ellipsis"
    ].join(" ");

    const optionClasses = [
        "cursor-pointer px-1 xs:px-3 py-2 hover:bg-white/5",
        "tracking-wide text-xs xs:text-sm truncate overflow-hidden text-ellipsis"
    ].join(" ");

    return (
        <Listbox value={region} onChange={setRegion}>
            {({ open }) => (
                <div className="relative min-w-0">
                    <ListboxButton className={`${buttonClasses} ${open ? "rounded-bl-none border-b-transparent" : ""}`}>
                        {region}
                    </ListboxButton>
                    <ListboxOptions className="absolute z-[9999] w-full left-0 bg-white/20 text-white rounded-b-sm outline-none border-b border-l border-r border-white/30 tracking-widest min-w-0">
                        {REGIONS.map(regionOption => (
                            <ListboxOption 
                                key={regionOption}
                                value={regionOption} 
                                className={optionClasses}
                            >
                                {regionOption}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            )}
        </Listbox>
    );
}