"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

type GameButton = {
    src: string;
    text: string;
    shortText: string;
    disabled: boolean;
    route?: string;
};

export function Footer() {
    const router = useRouter();
    const pathname = usePathname();

    const buttons: GameButton[] = [
        {
            src: "main/footer/LOL_Icon.svg",
            text: "League of Legends",
            shortText: "LOL",
            disabled: false,
            route: "/",
        },
        {
            src: "main/footer/TFT_Icon.svg",
            text: "Teamfight Tactics",
            shortText: "TFT",
            disabled: true,
        },
        {
            src: "main/footer/VAL_Icon.svg",
            text: "Valorant",
            shortText: "VAL",
            disabled: true,
        },
    ];

    const handleClick = (route?: string) => {
        if (route) {
            router.push(route);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute bottom-7 left-1/2 transform -translate-x-1/2 flex gap-5 w-full max-w-[900px] px-5"
            >
                {buttons.map((item) => {
                    const isActive = pathname === item.route && !item.disabled;

                    return (
                        <div key={item.shortText} className="relative group w-1/3">
                            <button
                                onClick={() => handleClick(item.route)}
                                disabled={item.disabled}
                                aria-label={item.text}
                                className={`flex items-center justify-center gap-2 rounded-[20px] px-4 py-1 text-sm font-medium tracking-wider whitespace-nowrap w-full transition duration-200 ease-in-out
                                ${
                                    item.disabled
                                        ? "bg-gray-800 bg-opacity-50 cursor-not-allowed"
                                        : isActive
                                            ? "bg-white text-black shadow-md hover:bg-white/80 cursor-pointer"
                                            : "bg-black bg-opacity-80 text-white hover:bg-opacity-70 cursor-pointer"
                                }`}
                                >
                                <div
                                    className={`transition duration-400 ${
                                        !item.disabled ? "group-hover:scale-110 group-hover:drop-shadow-lg" : ""
                                    }`}
                                >
                                    <Image
                                        src={item.src}
                                        alt={item.text}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 flex-shrink-0"
                                    />
                                </div>

                                <span className="hidden sm:inline text-ellipsis overflow-hidden">
                                    {item.text}
                                </span>
                                <span className="sm:hidden text-ellipsis overflow-hidden">
                                    {item.shortText}
                                </span>
                            </button>


                            {item.disabled && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap tracking-[.25em] pointer-events-none select-none">
                                    Coming Soon
                                </div>
                            )}
                        </div>
                    );
                })}
            </motion.div>

            <a
                href="https://github.com/TeatrumMundi"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-0 left-0 bg-gray-800 bg-opacity-50 text-white text-xs px-3 py-1 rounded-tr-md tracking-widest"
            >
                ©2025 Teatrum Mundi
            </a>
        </>
    );
}