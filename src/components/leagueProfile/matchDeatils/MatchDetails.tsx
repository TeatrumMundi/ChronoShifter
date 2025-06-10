import { useState, useMemo, memo, lazy, Suspense } from "react";
import { RecentMatch } from "@/interfaces/productionTypes";
import { debounce } from "lodash";

// Lazy load all heavy components
const MatchGameTab = lazy(() => import("./GameTab/MatchGameTab").then(m => ({ default: m.MatchGameTab })));
const MatchPerformanceTab = lazy(() => import("./PerformanceTab/MatchPerformanceTab").then(m => ({ default: m.MatchPerformanceTab })));
const MatchBuildTab = lazy(() => import("./BuildTab/MatchBuildTab").then(m => ({ default: m.MatchBuildTab })));
const MatchTimelineTab = lazy(() => import("./TimeLineTab/MatchTimeLineTab").then(m => ({ default: m.MatchTimeLineTab })));

interface MatchDetailsProps {
    match: RecentMatch;
    mainPlayerPUUID: string;
    region: string;
}

export const MatchDetails = memo(function MatchDetails({ match, mainPlayerPUUID, region }: MatchDetailsProps) {
    const [activeTab, setActiveTab] = useState<"game" | "performance" | "build" | "timeLine">("game");

    // Memoize team splitting based on teamId
    const { team1, team2 } = useMemo(() => {
        const teams = match.matchDetails.participants.reduce((acc, participant) => {
            if (!acc[participant.teamId]) {
                acc[participant.teamId] = [];
            }
            acc[participant.teamId].push(participant);
            return acc;
        }, {} as Record<number, typeof match.matchDetails.participants>);

        const teamIds = Object.keys(teams).map(Number).sort();
        
        return {
            team1: teams[teamIds[0]] || [],
            team2: teams[teamIds[1]] || []
        };
    }, [match]);

    const mainPlayer = useMemo(() =>
        match.matchDetails.participants.find(p => p.puuid === mainPlayerPUUID),
        [match.matchDetails.participants, mainPlayerPUUID]
    );

    // Memoize tab content to prevent unnecessary re-renders
    const tabContent = useMemo(() => {
        const LoadingSpinner = () => (
            <div className="flex items-center justify-center p-8 min-h-[200px]">
                <div className="relative">
                    {/* Outer rotating ring */}
                    <div className="w-16 h-16 border-2 border-transparent border-t-blue-500 border-r-blue-400 rounded-full animate-spin"></div>
                    
                    {/* Middle pulsing ring */}
                    <div className="absolute top-2 left-2 w-12 h-12 border-2 border-transparent border-b-cyan-400 border-l-cyan-300 rounded-full animate-spin animate-reverse"></div>
                    
                    {/* Inner glowing core */}
                    <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                    
                    {/* Center dot */}
                    <div className="absolute top-6 left-6 w-4 h-4 bg-white rounded-full animate-ping"></div>
                    
                    {/* Floating particles */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-300"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-300 rounded-full animate-bounce delay-500"></div>
                </div>
                
                {/* Loading text with typewriter effect */}
                <div className="ml-6">
                    <div className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Loading
                        <span className="animate-pulse">...</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1 animate-pulse">
                        Preparing data
                    </div>
                </div>
            </div>
        );
        
        switch (activeTab) {
            case "game":
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                        <MatchGameTab
                            team1={team1}
                            team2={team2}
                            mainPlayerPUUID={mainPlayerPUUID}
                            region={region}
                            time={match.matchDetails.gameDuration}
                        />
                    </Suspense>
                );
            case "performance":
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                        <MatchPerformanceTab
                            team1={team1}
                            team2={team2}
                            mainPlayerPUUID={mainPlayerPUUID}
                            region={region}
                        />
                    </Suspense>
                );
            case "build":
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                        {mainPlayer ? (
                            <MatchBuildTab
                                mainPlayer={mainPlayer}
                                recentMatch={match}
                            />
                        ) : (
                            <div className="p-4 text-center text-red-400">Main player not found.</div>
                        )}
                    </Suspense>
                );
            case "timeLine":
                return (
                    <Suspense fallback={<LoadingSpinner />}>
                        <MatchTimelineTab
                            team1={team1}
                            team2={team2}
                            mainPlayerPUUID={mainPlayerPUUID}
                            recentMatch={match}
                        />
                    </Suspense>
                );
            default:
                return null;
        }
    }, [activeTab, team1, team2, mainPlayerPUUID, region, match, mainPlayer]);

    // Debounce tab changes if users click rapidly
    const debouncedSetActiveTab = useMemo(
        () => debounce((tab: "game" | "performance" | "build" | "timeLine") => {
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
                    isActive={activeTab === "timeLine"} 
                    onClick={() => debouncedSetActiveTab("timeLine")}
                >
                    Time Line
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