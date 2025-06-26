import { useState, useMemo, memo, lazy, Suspense, useCallback, startTransition } from "react";
import { Match } from "@/interfaces/productionTypes";
import { motion } from "framer-motion";

// Lazy load all heavy components with preload
const MatchGameTab = lazy(() => import("./GameTab/MatchGameTab").then(m => ({ default: m.MatchGameTab })));
const MatchArenaGameTab = lazy(() => import("./GameTab/MatchArenaGameTab").then(m => ({ default: m.MatchArenaGameTab })));
const MatchPerformanceTab = lazy(() => import("./PerformanceTab/MatchPerformanceTab").then(m => ({ default: m.MatchPerformanceTab })));
const MatchBuildTab = lazy(() => import("./BuildTab/MatchBuildTab").then(m => ({ default: m.MatchBuildTab })));
const MatchTimelineTab = lazy(() => import("./TimeLineTab/MatchTimeLineTab").then(m => ({ default: m.MatchTimeLineTab })));

// Centralized tab configuration
const TABS_CONFIG = {
    game: {
        id: 'game' as const,
        label: 'Game',
        component: MatchGameTab
    },
    performance: {
        id: 'performance' as const,
        label: 'Performance', 
        component: MatchPerformanceTab
    },
    build: {
        id: 'build' as const,
        label: 'Build',
        component: MatchBuildTab
    },
    timeline: {
        id: 'timeline' as const,
        label: 'Timeline',
        component: MatchTimelineTab
    }
} as const;

type TabId = keyof typeof TABS_CONFIG;
const DEFAULT_TAB: TabId = 'game';

interface MatchDetailsProps {
    match: Match;
    mainPlayerPUUID: string;
    region: string;
    gameMode: string;
}

export const MatchDetails = memo(function MatchDetails({ match, mainPlayerPUUID, region, gameMode }: MatchDetailsProps) {
    const [activeTab, setActiveTab] = useState<TabId>(DEFAULT_TAB);

    // Filter tabs based on game mode
    const availableTabs = useMemo(() => {
        if (gameMode === 'Arena') { // Arena game mode
            return {
                game: TABS_CONFIG.game,
                build: TABS_CONFIG.build
            };
        }
        return TABS_CONFIG;
    }, [gameMode]);

    // Memoize team splitting - only recalculate when match changes
    const { team1, team2, mainPlayer, isWin } = useMemo(() => {
        const teams = match.participants.reduce((acc, participant) => {
            if (!acc[participant.teamId]) {
                acc[participant.teamId] = [];
            }
            acc[participant.teamId].push(participant);
            return acc;
        }, {} as Record<number, typeof match.participants>);

        const teamIds = Object.keys(teams).map(Number).sort();
        const mainPlayer = match.participants.find(p => p.puuid === mainPlayerPUUID);
        
        return {
            team1: teams[teamIds[0]] || [],
            team2: teams[teamIds[1]] || [],
            mainPlayer,
            isWin: mainPlayer?.win || false
        };
    }, [match, mainPlayerPUUID]);

    // Lightweight loading component
    const LoadingSpinner = memo(() => (
        <div className="flex items-center justify-center p-4 min-h-[120px]">
            <div className="relative">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
            </div>
        </div>
    ));
    LoadingSpinner.displayName = "LoadingSpinner";

    // Optimized tab content renderer with React.startTransition
    const handleTabChange = useCallback((tab: TabId) => {
        startTransition(() => {
            setActiveTab(tab);
        });
    }, []);

    // Render only active tab content to reduce initial load
    const renderActiveTabContent = useMemo(() => {
        switch (activeTab) {
            case 'game':
                // Use Arena-specific component for Arena game mode
                if (gameMode === 'Arena') {
                    return (
                        <MatchArenaGameTab
                            participants={match.participants}
                            mainPlayerPUUID={mainPlayerPUUID}
                            region={region}
                        />
                    );
                }
                return (
                    <MatchGameTab
                        team1={team1}
                        team2={team2}
                        mainPlayerPUUID={mainPlayerPUUID}
                        region={region}
                        time={match.gameDuration}
                    />
                );
            case 'performance':
                return (
                    <MatchPerformanceTab 
                        team1={team1}
                        team2={team2}
                        mainPlayerPUUID={mainPlayerPUUID}
                        region={region}
                    />
                );
            case 'build':
                return mainPlayer ? (
                    <MatchBuildTab
                        mainPlayer={mainPlayer}
                        recentMatch={match}
                    />
                ) : (
                    <div className="p-4 text-center text-red-400">
                        Main player not found.
                    </div>
                );
            case 'timeline':
                return (
                    <MatchTimelineTab
                        team1={team1}
                        team2={team2}
                        mainPlayerPUUID={mainPlayerPUUID}
                        recentMatch={match}
                    />
                );
            default:
                return null;
        }
    }, [activeTab, gameMode, team1, team2, mainPlayerPUUID, region, match, mainPlayer]);

    return (
        <motion.div 
            className={`w-full overflow-hidden relative
                backdrop-blur-xl border-x border-b
                shadow-2xl shadow-black/10 rounded-b-xl
                ${isWin 
                    ? "bg-emerald-500/15 border-emerald-400/30" 
                    : "bg-rose-500/15 border-rose-400/30"
                }`}
            style={{
                background: `linear-gradient(135deg, 
                    ${isWin ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)'} 0%, 
                    ${isWin ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 127, 0.08)'} 100%),
                    rgba(255, 255, 255, 0.03)`
            }}
            initial={{ 
                height: 0, 
                opacity: 0,
                transformOrigin: "top"
            }}
            animate={{ 
                height: "auto", 
                opacity: 1
            }}
            exit={{ 
                height: 0, 
                opacity: 0,
                transformOrigin: "top"
            }}
            transition={{ 
                duration: 0.3, // Reduced duration
                ease: "easeOut", // Simpler easing
                height: { duration: 0.3 },
                opacity: { duration: 0.2 }
            }}
        >
            {/* Simplified background glow */}
            <div className={`absolute inset-0 rounded-b-xl
                ${isWin 
                    ? 'bg-emerald-400/2' 
                    : 'bg-rose-400/2'
                }`} />

            {/* Tab Navigation - reduced animations */}
            <motion.div 
                className="relative p-4 border-b border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <div className={`relative z-5 gap-3 ${
                    gameMode === 'Arena' 
                        ? 'grid grid-cols-2' 
                        : 'grid grid-cols-2 sm:grid-cols-4'
                }`}>
                    {Object.values(availableTabs).map((tab) => (
                        <TabButton 
                            key={tab.id}
                            isActive={activeTab === tab.id} 
                            isWin={isWin}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            {tab.label}
                        </TabButton>
                    ))}
                </div>
            </motion.div>

            {/* Tab Content - simplified animations */}
            <motion.div 
                className="relative p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
            >
                <div className="relative z-5 text-white">
                    <Suspense fallback={<LoadingSpinner />}>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            {renderActiveTabContent}
                        </motion.div>
                    </Suspense>
                </div>
            </motion.div>
        </motion.div>
    );
});

// Simplified TabButton component
const TabButton = memo(function TabButton({ 
    isActive, 
    isWin, 
    onClick, 
    children 
}: { 
    isActive: boolean; 
    isWin: boolean;
    onClick: () => void; 
    children: React.ReactNode; 
}) {
    return (
        <button
            className={`relative w-full px-4 py-2 rounded-lg font-semibold transition-colors duration-150
                backdrop-blur-sm border
                ${isActive
                    ? `${isWin 
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100' 
                        : 'bg-rose-500/20 border-rose-400/40 text-rose-100'
                      }`
                    : 'bg-white/8 border-white/20 text-white/80 hover:bg-white/12 hover:border-white/30'
                }`}
            onClick={onClick}
        >
            <span className="relative z-5 text-sm tracking-wide">
                {children}
            </span>
        </button>
    );
});