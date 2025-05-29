"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchForm } from "./SearchForm";
import { ScrollText } from "lucide-react";

export default function Navbar() {
    return (
        <div 
            className="sticky top-0 z-50 bg-gradient-to-b from-purple-600 to-indigo-600 shadow-md w-full h-35 md:h-15"
            style={{ fontFamily: "var(--font-verminVibes)" }}
        >
            <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-4 h-full">
                    {/* LOGO */}
                    <div className="h-8/10 flex items-center pl-2">
                        <Link href="/" className="flex items-center h-full">
                            <Image
                                src="/logo/navbar_logo.png"
                                alt="ChronoShifter Logo"
                                width={80}
                                height={80}
                                priority
                                className="object-cover transition-transform duration-200 h-full w-auto"
                            />
                        </Link>
                    </div>

                    {/* PATCH BUTTON */}
                    <Link
                        href="/patch"
                        className="text-xl tracking-widest text-gray-200 hover:bg-white/20 px-3 transition-colors duration-300 h-full flex items-center"
                    >
                        <ScrollText className="mr-3"/>
                        PATCH
                    </Link>
                </div>

                {/* SEARCH FORM */}
                <div className="flex items-center">
                    <SearchForm position="static" className="flex items-center mb-5 md:mb-0" />
                </div>
            </div>
        </div>
    );
}