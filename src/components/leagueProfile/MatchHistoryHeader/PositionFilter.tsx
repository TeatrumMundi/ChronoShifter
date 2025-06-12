"use client";

import Image from "next/image";

interface PositionFilterProps {
    selectedPosition: string;
    onPositionChange: (position: string) => void;
}

export function PositionFilter({ selectedPosition, onPositionChange }: PositionFilterProps) {
    const positions = [
        { name: "ALL", icon: "/position/Specialist_icon.webp" },
        { name: "Top", icon: "/position/Top_icon.webp" },
        { name: "Jungle", icon: "/position/Jungle_icon.webp" },
        { name: "Middle", icon: "/position/Middle_icon.webp" },
        { name: "Bottom", icon: "/position/Bottom_icon.webp" },
        { name: "Support", icon: "/position/Support_icon.webp" }
    ];

    return (
        <div className="flex rounded-lg backdrop-blur-sm border border-white/20 overflow-hidden h-8 w-full sm:w-auto justify-center"
            style={{
                background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.08) 0%, 
                    rgba(255, 255, 255, 0.05) 100%),
                    rgba(255, 255, 255, 0.03)`
            }}>
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 to-white/3 pointer-events-none" />
            
            {positions.map((position) => (
                <button
                    key={position.name}
                    onClick={() => onPositionChange(position.name)}
                    className={`relative z-10 flex items-center justify-center w-8 h-8 transition-all duration-200
                        ${selectedPosition === position.name 
                            ? 'bg-blue-600/40 backdrop-blur-sm border-x border-blue-400/30' 
                            : 'hover:bg-white/10'
                        }`}
                    title={position.name}
                >
                    <Image 
                        src={position.icon} 
                        alt={position.name}
                        width={20}
                        height={20}
                        className="object-contain"
                    />
                </button>
            ))}
        </div>
    );
}