"use client";

import Image from "next/image";
import { Background, Footer, SearchForm } from "@/components/common";

type ErrorPageProps = {
    imagePath: string;
    errorMessage: string;
};

export default function ErrorPage({ imagePath, errorMessage }: ErrorPageProps) {
    return (
        <div className="relative w-full min-h-screen overflow-hidden px-4 py-10">
            {/* Background */}
            <Background quality={75} className="opacity-20"/>

            {/* Massage */}
            <div 
                className="max-w-lg mx-auto mb-6"
                style={{ fontFamily: "var(--font-lato)" }} 
            >
                <div className="bg-gray-700/30 rounded-sm p-4 md:p-6 shadow-lg text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-[.20em] mb-2">
                        Error
                    </h2>
                    <p className="text-red-100 tracking-wide font-sans">
                        {errorMessage}
                    </p>
                </div>
            </div>

            {/* Picture */}
            <div className="max-w-md mx-auto mb-4 relative aspect-square w-full">
                <Image
                    src={imagePath}
                    alt={errorMessage}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-sm shadow-md mx-auto object-contain"
                    priority
                />
            </div>

            {/* Footer */}
            <Footer />

            {/* SearchForm */}
            <div className="max-w-3xl w-full mx-auto mt-2">
                <SearchForm position="static" />
            </div>

            
        </div>
    );
}