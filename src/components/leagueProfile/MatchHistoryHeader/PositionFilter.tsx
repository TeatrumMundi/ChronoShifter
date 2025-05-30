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
        <div className="flex bg-gray-800/80 rounded-sm overflow-hidden h-8 w-full sm:w-auto justify-center">
            {positions.map((position) => (
                <button
                    key={position.name}
                    onClick={() => onPositionChange(position.name)}
                    className={`
                        flex items-center justify-center w-8 h-8 transition-all duration-200
                        ${selectedPosition === position.name ? 'bg-blue-600' : 'hover:bg-gray-700'}
                    `}
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