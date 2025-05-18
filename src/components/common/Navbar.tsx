"use client";

import Link from "next/link";
import SearchForm from "@/components/common/SearchForm";

export default function Navbar() {
    return (
        <div className="sticky top-0 z-50 bg-gradient-to-b from-purple-900 via-indigo-900 to-transparent shadow-md w-full">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 py-3 px-4">
                <div className="flex items-center gap-4">
                    {/* LOGO */}
                    <div className="text-white font-bold text-xl tracking-widest whitespace-nowrap">
                        ChronoShifter
                    </div>

                    {/* PATCH BUTTON */}
                    <Link
                        href="/patch"
                        className="text-sm tracking-widest text-gray-200 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md transition-colors duration-300"
                    >
                        PATCH
                    </Link>
                </div>

                {/* SEARCH FORM */}
                <div>
                    <SearchForm position="static" className="mb-0" />
                </div>
            </div>
        </div>
    );
}