"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchForm } from "./SearchForm";

export default function Navbar() {
    return (
        <div 
            className="sticky top-0 z-50 w-full h-35 md:h-15
                backdrop-blur-xl border-b border-white/20
                shadow-2xl shadow-black/10"
            style={{ 
                fontFamily: "var(--font-verminVibes)",
                background: `linear-gradient(135deg, 
                    rgba(147, 51, 234, 0.15) 0%, 
                    rgba(99, 102, 241, 0.12) 100%),
                    rgba(255, 255, 255, 0.03)`
            }}
        >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/3 to-indigo-400/3" />
            
            <div className="relative z-5 w-full h-full flex flex-col md:flex-row items-center justify-between gap-3 px-4">
                <div className="flex items-center gap-4 h-full">
                    {/* LOGO */}
                    <div className="h-8/10 flex items-center">
                        <Link href="/" className="flex items-center h-full">
                            <div className="relative p-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                                <Image
                                    src="/logo/navbar_logo.png"
                                    alt="ChronoShifter Logo"
                                    width={80}
                                    height={80}
                                    priority
                                    className="object-cover transition-transform duration-200 h-full w-auto hover:scale-105"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* PATCH BUTTON */}
{/*                     <Link
                        href="/patch"
                        className="relative px-4 py-2 rounded-lg
                            bg-white/10 backdrop-blur-sm border border-white/20
                            text-xl tracking-widest text-white/90 
                            hover:bg-white/20 hover:text-white
                            transition-all duration-300 
                            shadow-md shadow-black/5
                            flex items-center gap-3"
                    >
                        <ScrollText className="w-5 h-5"/>
                        PATCH
                    </Link> */}
                </div>

                {/* SEARCH FORM */}
                <div className="flex items-center">
                    <div className="relative">
                        <SearchForm position="static" className="flex items-center mb-5 md:mb-0" />
                    </div>
                </div>
            </div>
        </div>
    );
}