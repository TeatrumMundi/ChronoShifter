import { useState, useMemo, memo, lazy, Suspense } from "react";
import { RecentMatch } from "@/interfaces/productionTypes";
import { debounce } from "lodash";

// Lazy load heavy components
const MatchGameTab = lazy(() => import("./MatchGameTab").then(m => ({ default: m.MatchGameTab })));

interface MatchDetailsProps {
    match: RecentMatch;
    mainPlayerPUUID: string;
    region: string;
}

export const MatchDetails = memo(function MatchDetails({ match, mainPlayerPUUID, region }: MatchDetailsProps) {
    const [activeTab, setActiveTab] = useState<"game" | "performance" | "build" | "stats">("game");

    // Memoize team splitting - avoid recalculation on every render
    const { team1, team2 } = useMemo(() => ({
        team1: match.matchDetails.participants.slice(0, 5),
        team2: match.matchDetails.participants.slice(5, 10)
    }), [match.matchDetails.participants]);

    // Memoize tab content to prevent unnecessary re-renders
    const tabContent = useMemo(() => {
        const LoadingSpinner = () => <div className="p-4 text-center">Loading...</div>;
        
        switch (activeTab) {
            case "game":
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                        <MatchGameTab
                            team1={team1}
                            team2={team2}
                            mainPlayerPUUID={mainPlayerPUUID}
                            region={region}
                        />
                    </Suspense>
                );
            case "performance":
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                    </Suspense>
                );
            case "build":
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                    </Suspense>
                );
            case "stats":
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                    </Suspense>
                );
            default:
                return null;
        }
    }, [activeTab, team1, team2, mainPlayerPUUID, region]);

    // Debounce tab changes if users click rapidly
    const debouncedSetActiveTab = useMemo(
        () => debounce((tab: "game" | "performance" | "build" | "stats") => {
            setActiveTab(tab);
        }, 50),
        []
    );

    return (
        <div className="w-full bg-gray-900/95 rounded-b-sm">
            {/* Top row with 4 buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 m-4">
                <TabButton 
                    isActive={activeTab === "game"} 
                    onClick={() => debouncedSetActiveTab("game")}
                >
                    Game
                </TabButton>
                <TabButton 
                    isActive={activeTab === "performance"} 
                    onClick={() => debouncedSetActiveTab("performance")}
                >
                    Performance
                </TabButton>
                <TabButton 
                    isActive={activeTab === "build"} 
                    onClick={() => debouncedSetActiveTab("build")}
                >
                    Build
                </TabButton>
                <TabButton 
                    isActive={activeTab === "stats"} 
                    onClick={() => debouncedSetActiveTab("stats")}
                >
                    Stats
                </TabButton>
            </div>
            <div className="text-white">
                {tabContent}
            </div>
        </div>
    );
});

const TabButton = memo(function TabButton({ 
    isActive, 
    onClick, 
    children 
}: { 
    isActive: boolean; 
    onClick: () => void; 
    children: React.ReactNode; 
}) {
    return (
        <button
            className={`w-full px-4 py-2 rounded-xs font-semibold transition ${
                isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
            }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
});