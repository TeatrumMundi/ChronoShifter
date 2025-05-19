"use client";

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type SearchFormProps = {
    position?: "centered" | "static";
    className?: string;
};


export function SearchForm({ position = "centered", className }: SearchFormProps) {
    const router = useRouter();
    const [region, setRegion] = useState("EUROPE");
    const [error, setError] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const nickTag = formData.get("nickTag") as string;
        const [name, tag] = nickTag.split("#");
        if (!name || !tag) {
            setError("Correct input: NICKNAME#TAG");
            return;
        }
        setError("");
        router.push(`/${tag.toLocaleLowerCase()}/${name.toLocaleLowerCase()}/${region.toLocaleLowerCase()}`);
    };
    
    return (
        <div className={`px-4 
            ${position === "centered"
            ? "absolute top-6/10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl"
            : `${className ?? "mb-4"}`}`}
        >
            <form
                className="relative flex items-center "
                onSubmit={handleSubmit}
                noValidate
            >
                <div 
                    className="flex w-full relative shadow-md transition-shadow duration-200 backdrop-blur-sm"
                    style={{ fontFamily: "var(--font-verminVibes)" }}
                >
                <div className="flex-shrink-0 min-w-0 xs:w-24 sm:w-32">
                    <RegionSelector region={region} setRegion={setRegion} />
                </div>
                <div className="flex-1 flex flex-col relative min-w-0">
                <input
                    type="text"
                    name="nickTag"
                    placeholder="NICKNAME#TAG"
                    className="min-w-0 px-3 py-2 text-sm xs:text-base sm:text-lg md:text-xl 
                    bg-white/20 border-t border-b border-r border-white/30 
                    rounded-r-sm
                    focus:outline-none text-white placeholder-white/30 tracking-widest transition-all duration-200"
                    autoComplete="off"
                    spellCheck="false"
                    maxLength={22}
                    required
                    onInput={() => setError("")}
                />
                    {error && (
                        <div
                            style={{ fontFamily: "var(--font-lato)" }} 
                            className="absolute left-0 top-full mt-1 w-full bg-red-700/20 text-white text-base rounded shadow px-3 py-1 animate-fade-in z-10 tracking-widest">
                            {error}
                        </div>
                    )}
                </div>
                </div>
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30
                    rounded-sm p-1.5 aspect-square transition duration-200 ease-in-out hover:scale-105 disabled:opacity-50"
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
        </div>
    );
}

function RegionSelector({ region, setRegion }: { region: string, setRegion: (r: string) => void }) {
    return (
        <Listbox value={region} onChange={setRegion}>
            {({ open }) => (
                <div className="relative min-w-0">
                    <ListboxButton
                        className={`xs:w-24 sm:w-32 px-3 py-2 text-sm xs:text-base sm:text-lg md:text-xl
                            bg-white/20 border-t border-b border-l border-white/30 rounded-l-sm
                            focus:outline-none text-white tracking-widest
                            ${open ? "rounded-bl-none border-b-transparent" : ""}
                            min-w-0 xs:truncate xs:overflow-hidden xs:text-ellipsis
                        `}
                    >
                        {region}
                    </ListboxButton>
                    <ListboxOptions
                        className="absolute z-[9999] w-full left-0 bg-white/20 text-white rounded-b-sm
                        outline-none border-b border-l border-r border-white/30 tracking-widest min-w-0"
                    >
                        <ListboxOption value="AMERICAS" className="cursor-pointer px-4 py-2 hover:bg-white/5 tracking-wide xs:truncate xs:overflow-hidden xs:text-ellipsis">{'AMERICAS'}</ListboxOption>
                        <ListboxOption value="EUROPE" className="cursor-pointer px-4 py-2 hover:bg-white/5 tracking-wide xs:truncate xs:overflow-hidden xs:text-ellipsis">{'EUROPE'}</ListboxOption>
                        <ListboxOption value="ASIA" className="cursor-pointer px-4 py-2 hover:bg-white/5 tracking-wide xs:truncate xs:overflow-hidden xs:text-ellipsis">{'ASIA'}</ListboxOption>
                    </ListboxOptions>
                </div>
            )}
        </Listbox>
    );
}