import { useState } from "react";
import { RecentMatch } from "@/interfaces/productionTypes";
import { MatchGameTab } from "./MatchGameTab";

interface MatchDetailsProps {
    match: RecentMatch;
    mainPlayerPUUID: string;
    region: string;
}

export function MatchDetails({ match, mainPlayerPUUID, region }: MatchDetailsProps) {
    const [activeTab, setActiveTab] = useState<"game" | "performance" | "build" | "stats">("game");

    const team1 = match.matchDetails.participants.slice(0, 5);
    const team2 = match.matchDetails.participants.slice(5, 10);

    return (
        <div className="w-full bg-gray-900/95 animate-fade-in transition-all duration-300 rounded-b-sm">
            {/* Top row with 4 buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 m-4">
                <button
                    className={`w-full px-4 py-2 rounded-xs font-semibold transition ${
                        activeTab === "game"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                    }`}
                    onClick={() => setActiveTab("game")}
                >
                    Game
                </button>
                <button
                    className={`w-full px-4 py-2 rounded-xs font-semibold transition ${
                        activeTab === "performance"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                    }`}
                    onClick={() => setActiveTab("performance")}
                >
                    Performance
                </button>
                <button
                    className={`w-full px-4 py-2 rounded-xs font-semibold transition ${
                        activeTab === "build"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                    }`}
                    onClick={() => setActiveTab("build")}
                >
                    Build
                </button>
                <button
                    className={`w-full px-4 py-2 rounded-xs font-semibold transition ${
                        activeTab === "stats"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                    }`}
                    onClick={() => setActiveTab("stats")}
                >
                    Stats
                </button>
            </div>
            <div className="text-white">
                <div>
                    {activeTab === "game" && (
                        <MatchGameTab
                            team1={team1}
                            team2={team2}
                            mainPlayerPUUID={mainPlayerPUUID}
                            region={region}
                        />
                    )}
                    {activeTab === "performance" && "Performance tab content goes here."}
                    {activeTab === "build" && "Build tab content goes here."}
                    {activeTab === "stats" && "Stats tab content goes here."}
                </div>
            </div>
        </div>
    );
}