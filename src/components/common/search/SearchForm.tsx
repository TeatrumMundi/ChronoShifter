"use client";

import React, { useActionState, useState } from "react";
import { handleSearch } from "./handleSearch";

const initialState = {
    error: null as string | null,
};

type RegionSelectorProps = {
    onChange: (region: string) => void;
    isDropdownOpen: boolean;
};

function RegionSelector({ onChange }: RegionSelectorProps) {
    return (
        <select
            name="server"
            defaultValue="EUNE"
            className="h-full pl-2 pr-6 py-2 text-xs xs:pl-3 xs:pr-8 xs:py-3 xs:text-sm sm:text-base md:text-lg lg:text-xl 
            bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:border-white/50 
            text-white appearance-none tracking-[0.2em] transition-all duration-200 rounded-tl-lg rounded-bl-lg"
            autoComplete="off"
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="REGION" disabled className="bg-blue-800/20 backdrop-blur-sm tracking-[0.2em]">REGION</option>
            <option value="NA" className="bg-blue-900/50">NA</option>
            <option value="EUW" className="bg-indigo-800/50">EUW</option>
            <option value="EUNE" className="bg-indigo-900/50">EUNE</option>
            <option value="KR" className="bg-purple-800/50">KR</option>
            <option value="BR" className="bg-purple-900/50">BR</option>
            <option value="JP" className="bg-pink-800/50">JP</option>
            <option value="RU" className="bg-pink-900/50">RU</option>
            <option value="OCE" className="bg-teal-800/50">OCE</option>
            <option value="TR" className="bg-teal-900/50">TR</option>
            <option value="LAN" className="bg-rose-800/50">LAN</option>
            <option value="LAS" className="bg-rose-900/50">LAS</option>
            <option value="SEA" className="bg-cyan-800/50">SEA</option>
            <option value="TW" className="bg-cyan-900/50">TW</option>
            <option value="VN" className="bg-emerald-800/50">VN</option>
            <option value="ME" className="bg-emerald-900/50">ME</option>
        </select>
    );
}

type SearchFormProps = {
    position?: "centered" | "static";
    className?: string;
};

export default function SearchForm({ position = "centered", className }: SearchFormProps) {
    const [state, dispatch] = useActionState(handleSearch, initialState);
    const [query, setQuery] = useState<string>("");
    const [region, setRegion] = useState<string>("EUNE");
    const [lastSearch, setLastSearch] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        try {
            // You may want to pass region and query to handleSearch here
            await dispatch(new FormData(e.target as HTMLFormElement));
            setLastSearch(query);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className={`w-full max-w-3xl px-4 ${position === "centered"
            ? "absolute top-6/10 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            : `mx-auto ${className ?? "mb-4"}`}`}>
            <form onSubmit={handleSubmit} className="relative flex items-center">
                <div className="flex w-full relative shadow-md transition-shadow duration-200">
                    <div className="rounded-tl-lg rounded-bl-lg">
                        <RegionSelector onChange={setRegion} isDropdownOpen={false} />
                    </div>

                    <input
                        type="text"
                        name="nickTag"
                        placeholder="NICKNAME#TAG"
                        className="flex-1 px-3 py-2 text-sm xs:text-base sm:text-lg md:text-xl 
                        bg-white/20 backdrop-blur-sm border-t border-b border-r border-white/30 
                        rounded-tr-lg rounded-r-lg
                        focus:outline-none focus:border-white/50 text-white placeholder-white/70 tracking-widest transition-all duration-200"
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={22}
                        required
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30
                    rounded p-1.5 aspect-square transition duration-200 ease-in-out hover:scale-105 disabled:opacity-50"
                    aria-label="Search"
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>

            {lastSearch && (
                <div className="mt-4 text-white text-center">
                    Ostatnio wyszukiwane: <span className="font-bold">{lastSearch}</span>
                </div>
            )}

            {state.error && (
                <div className="mt-2">
                    <div className="p-2 bg-red-900/80 backdrop-blur-sm rounded text-white text-sm text-center tracking-widest">
                        {state.error}
                    </div>
                </div>
            )}
        </div>
    );
}