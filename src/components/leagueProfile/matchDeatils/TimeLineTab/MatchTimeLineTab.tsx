import { Participant, Match } from "@/interfaces/productionTypes";
import { ChampionKillEvent, EliteMonsterKillEvent } from "@/interfaces/proudctionTimeLapTypes";
import { ChampionIcon } from "@/components/common/Icons/ChampionIcon";
import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface MatchStatsTabProps {
    team1: Participant[];
    team2: Participant[];
    mainPlayerPUUID: string;
    recentMatch: Match;
}

interface ExtendedChampionKillEvent extends ChampionKillEvent {
    isMainPlayerTeam: boolean;
    killerName?: string;
    victimName?: string;
}

interface ExtendedEliteMonsterEvent extends EliteMonsterKillEvent {
    isMainPlayerTeam: boolean;
    killerName?: string;
}

type CombinedEvent = (ExtendedChampionKillEvent & { eventType: 'kill' }) | (ExtendedEliteMonsterEvent & { eventType: 'elite_monster' });

export function MatchTimeLineTab({ team1, team2, mainPlayerPUUID, recentMatch }: MatchStatsTabProps) {
    const [hoveredEventIndex, setHoveredEventIndex] = useState<number | null>(null);
    const [isHoveredFromMap, setIsHoveredFromMap] = useState<boolean>(false);
    const eventListRef = useRef<HTMLDivElement>(null);
    const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

    const mainPlayerTeam = useMemo(() => {
        const mainPlayer = [...team1, ...team2].find(p => p.puuid === mainPlayerPUUID);
        return mainPlayer?.teamId;
    }, [team1, team2, mainPlayerPUUID]);

    const participantLookup = useMemo(() => {
        const lookup = new Map<string, Participant>();
        [...team1, ...team2].forEach(participant => {
            lookup.set(participant.riotIdGameName, participant);
        });
        return lookup;
    }, [team1, team2]);

    const allEvents = useMemo(() => {
        const killEvents: ExtendedChampionKillEvent[] = [];
        const eliteMonsterEvents: ExtendedEliteMonsterEvent[] = [];
        const processedKills = new Set<string>();
        const processedEliteMonsters = new Set<string>();
        const allParticipants = [...team1, ...team2];

        if (!recentMatch.timelineData?.length) return [];

        const participantIdMap = new Map<number, Participant>();
        allParticipants.forEach(participant => {
            if (participant.participantId) {
                participantIdMap.set(participant.participantId, participant);
            }
        });

        recentMatch.timelineData.forEach((timeline) => {
            timeline.frames?.forEach((frame) => {
                frame.events?.forEach((event) => {
                    if (event.type === "CHAMPION_KILL") {
                        const killEvent = event as ChampionKillEvent;
                        const killId = `${killEvent.timestamp}-${killEvent.killerId}-${killEvent.victimId}-${killEvent.position?.x}-${killEvent.position?.y}`;
                        
                        if (processedKills.has(killId) || !killEvent.position) return;
                        
                        const killer = killEvent.killerId !== undefined ? participantIdMap.get(killEvent.killerId) : undefined;
                        const victim = killEvent.victimId !== undefined ? participantIdMap.get(killEvent.victimId) : undefined;
                        const isMainPlayerTeam = killer?.teamId === mainPlayerTeam;

                        processedKills.add(killId);
                        killEvents.push({
                            ...killEvent,
                            isMainPlayerTeam,
                            killerName: killer?.riotIdGameName,
                            victimName: victim?.riotIdGameName
                        });
                    } else if (event.type === "ELITE_MONSTER_KILL") {
                        const eliteEvent = event as EliteMonsterKillEvent;
                        const eliteId = `${eliteEvent.timestamp}-${eliteEvent.killerId}-${eliteEvent.monsterType}-${eliteEvent.monsterSubType || 'none'}`;
                        
                        if (processedEliteMonsters.has(eliteId)) return;
                        
                        const killer = eliteEvent.killerId !== undefined ? participantIdMap.get(eliteEvent.killerId) : undefined;
                        const isMainPlayerTeam = killer?.teamId === mainPlayerTeam;

                        processedEliteMonsters.add(eliteId);
                        eliteMonsterEvents.push({
                            ...eliteEvent,
                            isMainPlayerTeam,
                            killerName: killer?.riotIdGameName
                        });
                    }
                });
            });
        });

        const combined: CombinedEvent[] = [
            ...killEvents.map(event => ({ ...event, eventType: 'kill' as const })),
            ...eliteMonsterEvents.map(event => ({ ...event, eventType: 'elite_monster' as const }))
        ];

        return combined.sort((a, b) => a.timestamp - b.timestamp);
    }, [team1, team2, mainPlayerTeam, recentMatch.timelineData]);

    const sortedKillEvents = useMemo(() => {
        return allEvents.filter((event): event is ExtendedChampionKillEvent & { eventType: 'kill' } => event.eventType === 'kill');
    }, [allEvents]);

    useEffect(() => {
        if (hoveredEventIndex !== null && isHoveredFromMap && eventRefs.current[hoveredEventIndex] && eventListRef.current) {
            const eventElement = eventRefs.current[hoveredEventIndex];
            const listElement = eventListRef.current;
            
            if (eventElement) {
                const containerRect = listElement.getBoundingClientRect();
                const eventRect = eventElement.getBoundingClientRect();
                const currentScrollTop = listElement.scrollTop;
                const containerHeight = listElement.clientHeight;
                const eventRelativeTop = eventRect.top - containerRect.top + currentScrollTop;
                const eventHeight = eventElement.offsetHeight;
                const isAboveView = eventRelativeTop < currentScrollTop;
                const isBelowView = eventRelativeTop + eventHeight > currentScrollTop + containerHeight;
                
                if (isAboveView || isBelowView) {
                    const scrollTo = eventRelativeTop - (containerHeight / 2) + (eventHeight / 2);
                    listElement.scrollTo({
                        top: Math.max(0, scrollTo),
                        behavior: 'smooth'
                    });
                }
            }
        }
    }, [hoveredEventIndex, isHoveredFromMap]);

    const handleMapDotHover = (killEventIndex: number) => {
        const combinedIndex = allEvents.findIndex((event) => 
            event.eventType === 'kill' && 
            sortedKillEvents.findIndex(killEvent => killEvent === event) === killEventIndex
        );
        setHoveredEventIndex(combinedIndex);
        setIsHoveredFromMap(true);
    };

    const handleMapDotLeave = () => {
        setHoveredEventIndex(null);
        setIsHoveredFromMap(false);
    };

    const handleEventListHover = (index: number) => {
        setHoveredEventIndex(index);
        setIsHoveredFromMap(false);
    };

    const handleEventListLeave = () => {
        setHoveredEventIndex(null);
        setIsHoveredFromMap(false);
    };

    useEffect(() => {
        eventRefs.current = eventRefs.current.slice(0, allEvents.length);
    }, [allEvents.length]);

    const convertCoordinates = (x: number, y: number) => {
        const mapWidth = 512;
        const mapHeight = 512;
        const percentX = Math.max(0, Math.min(100, (x / 15000) * 100));
        const percentY = Math.max(0, Math.min(100, (1 - (y / 15000)) * 100));
        return {
            x: (percentX / 100) * mapWidth,
            y: (percentY / 100) * mapHeight
        };
    };

    const formatGameTime = (timestamp: number) => {
        const seconds = Math.floor(timestamp / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const teamStats = useMemo(() => {
        const yourTeamKills = sortedKillEvents.filter(e => e.isMainPlayerTeam).length;
        const enemyTeamKills = sortedKillEvents.filter(e => !e.isMainPlayerTeam).length;
        return { yourTeamKills, enemyTeamKills };
    }, [sortedKillEvents]);

    const getMonsterDisplayInfo = (monsterType?: string, monsterSubType?: string) => {
        const type = monsterType?.toUpperCase();
        const subType = monsterSubType?.toUpperCase();
        let displayName = 'Elite Monster';
        let iconPath = null;
        
        const monsterMap: Record<string, { name: string; icon: string }> = {
            'HORDE': { name: 'Voidgrub', icon: '/epicMonsters/HORDE.webp' },
            'BARON_NASHOR': { name: 'Baron Nashor', icon: '/epicMonsters/BARON_NASHOR.webp' },
            'RIFTHERALD': { name: 'Rift Herald', icon: '/epicMonsters/RIFTHERALD.webp' },
            'ATAKHAN': { name: 'Atakhan', icon: '/epicMonsters/ATAKHAN.webp' }
        };

        if (type && monsterMap[type]) {
            ({ name: displayName, icon: iconPath } = monsterMap[type]);
        } else if (type === 'DRAGON') {
            const dragonMap: Record<string, string> = {
                'AIR_DRAGON': 'Cloud Drake',
                'FIRE_DRAGON': 'Infernal Drake',
                'EARTH_DRAGON': 'Mountain Drake',
                'WATER_DRAGON': 'Ocean Drake',
                'HEXTECH_DRAGON': 'Hextech Drake',
                'CHEMTECH_DRAGON': 'Chemtech Drake',
                'ELDER_DRAGON': 'Elder Dragon'
            };
            displayName = dragonMap[subType || ''] || 'Dragon';
            iconPath = `/epicMonsters/Dragons/${subType || 'DRAGON'}.webp`;
        } else {
            displayName = monsterType || 'Elite Monster';
        }
        
        return { displayName, iconPath };
    };

    const renderEventItem = (event: CombinedEvent, index: number) => {
        const isHovered = hoveredEventIndex === index;
        
        if (event.eventType === 'elite_monster') {
            const killer = participantLookup.get(event.killerName || '');
            const { displayName, iconPath } = getMonsterDisplayInfo(event.monsterType, event.monsterSubType);
            
            return (
                <div 
                    key={`elite-${index}`}
                    ref={el => { eventRefs.current[index] = el; }}
                    className={`flex items-center justify-between gap-3 py-2 px-4 rounded-sm mb-2 transition-all duration-200 cursor-pointer ${
                        isHovered 
                            ? (event.isMainPlayerTeam ? 'bg-yellow-900/40 ring-1 ring-yellow-500/50' : 'bg-purple-900/40 ring-1 ring-purple-500/50')
                            : (event.isMainPlayerTeam ? 'bg-yellow-900/20 hover:bg-yellow-900/30' : 'bg-purple-900/20 hover:bg-purple-900/30')
                    }`}
                    onMouseEnter={() => handleEventListHover(index)}
                    onMouseLeave={handleEventListLeave}
                >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        {killer?.champion && (
                            <ChampionIcon
                                champion={killer.champion}
                                size={20}
                                showTooltip={false}
                                className="flex-shrink-0"
                            />
                        )}
                        
                        <div className="min-w-0 flex-1">
                            <div className={`text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                isHovered ? 'text-white' : 'text-gray-200'
                            }`}>
                                {killer ? (
                                    <Link
                                        href={`/${killer.riotIdTagline}/${killer.riotIdGameName}/${killer.region}`}
                                        className={`transition-all duration-200 hover:underline ${
                                            event.isMainPlayerTeam 
                                                ? (isHovered ? 'text-yellow-300 hover:text-yellow-200' : 'text-yellow-400 hover:text-yellow-300')
                                                : (isHovered ? 'text-purple-300 hover:text-purple-200' : 'text-purple-400 hover:text-purple-300')
                                        }`}
                                        title={`View profile for ${killer.riotIdGameName}#${killer.riotIdTagline}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {event.killerName}
                                    </Link>
                                ) : (
                                    <span className={`transition-all duration-200 ${
                                        event.isMainPlayerTeam 
                                            ? (isHovered ? 'text-yellow-300' : 'text-yellow-400')
                                            : (isHovered ? 'text-purple-300' : 'text-purple-400')
                                    }`}>
                                        {event.killerName || 'Unknown'}
                                    </span>
                                )}
                                
                                <span className="text-gray-400 mx-2">killed</span>
                                <span className={`transition-all duration-200 ${
                                    isHovered ? 'text-orange-300' : 'text-orange-400'
                                }`}>
                                    {displayName}
                                </span>
                                {iconPath ? (
                                    <Image
                                        src={iconPath}
                                        alt={displayName}
                                        width={24}
                                        height={24}
                                        className="flex-shrink-0 rounded-xs"
                                    />
                                ) : (
                                    <div className={`w-6 h-6 rounded-xs flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                                        event.isMainPlayerTeam 
                                            ? 'bg-yellow-600 text-yellow-100' 
                                            : 'bg-purple-600 text-purple-100'
                                    }`}>
                                        🐲
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                        <div className={`text-sm font-mono transition-all duration-200 ${
                            isHovered ? 'text-blue-300' : 'text-blue-400'
                        }`}>
                            {formatGameTime(event.timestamp)}
                        </div>
                    </div>
                </div>
            );
        } else {
            const killer = participantLookup.get(event.killerName || '');
            const victim = participantLookup.get(event.victimName || '');
            const killEventIndex = sortedKillEvents.findIndex(killEvent => 
                killEvent.timestamp === event.timestamp && 
                killEvent.killerName === event.killerName
            );
            
            return (
                <div 
                    key={`kill-${index}`}
                    ref={el => { eventRefs.current[index] = el; }}
                    className={`flex items-center justify-between gap-3 py-2 px-4 rounded-sm mb-2 transition-all duration-200 cursor-pointer ${
                        isHovered 
                            ? (event.isMainPlayerTeam ? 'bg-green-900/40 ring-1 ring-green-500/50' : 'bg-red-900/40 ring-1 ring-red-500/50')
                            : (event.isMainPlayerTeam ? 'bg-green-900/20 hover:bg-green-900/30' : 'bg-red-900/20 hover:bg-red-900/30')
                    }`}
                    onMouseEnter={() => handleEventListHover(index)}
                    onMouseLeave={handleEventListLeave}
                >
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                        {killer?.champion && (
                            <ChampionIcon
                                champion={killer.champion}
                                size={20}
                                showTooltip={false}
                                className="flex-shrink-0"
                            />
                        )}
                        
                        <div className="min-w-0 flex-1">
                            <div className={`text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                isHovered ? 'text-white' : 'text-gray-200'
                            }`}>
                                {killer ? (
                                    <Link
                                        href={`/${killer.riotIdTagline}/${killer.riotIdGameName}/${killer.region}`}
                                        className={`transition-all duration-200 hover:underline ${
                                            event.isMainPlayerTeam 
                                                ? (isHovered ? 'text-green-300 hover:text-green-200' : 'text-green-400 hover:text-green-300')
                                                : (isHovered ? 'text-red-300 hover:text-red-200' : 'text-red-400 hover:text-red-300')
                                        }`}
                                        title={`View profile for ${killer.riotIdGameName}#${killer.riotIdTagline}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {event.killerName}
                                    </Link>
                                ) : (
                                    <span className={`transition-all duration-200 ${
                                        event.isMainPlayerTeam 
                                            ? (isHovered ? 'text-green-300' : 'text-green-400')
                                            : (isHovered ? 'text-red-300' : 'text-red-400')
                                    }`}>
                                        {event.killerName || 'Unknown'}
                                    </span>
                                )}
                                
                                <span className="text-gray-400 mx-2">killed</span>
                                
                                {victim?.champion && (
                                    <ChampionIcon
                                        champion={victim.champion}
                                        size={20}
                                        showTooltip={false}
                                        className="flex-shrink-0"
                                    />
                                )}
                                
                                {victim ? (
                                    <Link
                                        href={`/${victim.riotIdTagline}/${victim.riotIdGameName}/${victim.region}`}
                                        className={`transition-all duration-200 hover:underline ${
                                            !event.isMainPlayerTeam 
                                                ? (isHovered ? 'text-green-300 hover:text-green-200' : 'text-green-400 hover:text-green-300')
                                                : (isHovered ? 'text-red-300 hover:text-red-200' : 'text-red-400 hover:text-red-300')
                                        }`}
                                        title={`View profile for ${victim.riotIdGameName}#${victim.riotIdTagline}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {event.victimName}
                                    </Link>
                                ) : (
                                    <span className={`transition-all duration-200 ${
                                        !event.isMainPlayerTeam 
                                            ? (isHovered ? 'text-green-300' : 'text-green-400')
                                            : (isHovered ? 'text-red-300' : 'text-red-400')
                                    }`}>
                                        {event.victimName || 'Unknown'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                        <div className={`text-sm font-mono transition-all duration-200 ${
                            isHovered ? 'text-blue-300' : 'text-blue-400'
                        }`}>
                            {formatGameTime(event.timestamp)}
                        </div>
                        <div className={`text-xs transition-all duration-200 ${
                            isHovered ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            #{killEventIndex + 1}
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="p-4">
            <div className="mb-6">         
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                        <div className="relative inline-block">
                            <Image
                                src="/maps/Summoner_Rift_Minimap.webp"
                                alt="Summoner's Rift Map"
                                width={512}
                                height={512}
                                className="rounded-sm border border-gray-800"
                            />
                            
                            {sortedKillEvents.map((event, index) => {
                                const coords = convertCoordinates(event.position!.x, event.position!.y);
                                const combinedIndex = allEvents.findIndex((event) => 
                                    event.eventType === 'kill' && 
                                    sortedKillEvents.findIndex(killEvent => killEvent === event) === index
                                );
                                const isHovered = hoveredEventIndex === combinedIndex;
                                return (
                                    <div
                                        key={index}
                                        className={`absolute rounded-xs border border-white transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                                            isHovered 
                                                ? 'w-4 h-4 z-20 scale-125' 
                                                : 'w-2 h-2 z-10 hover:scale-150'
                                        } ${
                                            event.isMainPlayerTeam 
                                                ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                                                : 'bg-red-500 shadow-lg shadow-red-500/50'
                                        } ${
                                            isHovered 
                                                ? (event.isMainPlayerTeam ? 'shadow-xl shadow-green-500/80 ring-1 ring-green-400' : 'shadow-xl shadow-red-500/80 ring-1 ring-red-400')
                                                : ''
                                        }`}
                                        style={{
                                            left: `${coords.x}px`,
                                            top: `${coords.y}px`,
                                        }}
                                        title={`${event.killerName || 'Unknown'} killed ${event.victimName || 'Unknown'} at ${formatGameTime(event.timestamp)}`}
                                        onMouseEnter={() => handleMapDotHover(index)}
                                        onMouseLeave={handleMapDotLeave}
                                    />
                                );
                            })}
                            
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 rounded-b-sm py-1 overflow-hidden">
                                <div className="flex flex-wrap justify-center gap-4 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-xs border border-white"></div>
                                        <span className="text-green-400">Your Team ({teamStats.yourTeamKills})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-xs border border-white"></div>
                                        <span className="text-red-400">Enemy Team ({teamStats.enemyTeamKills})</span>
                                    </div>
                                    <div className="text-gray-400">
                                        Total: {sortedKillEvents.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        {allEvents.length > 0 ? (
                            <div>
                                <div 
                                    ref={eventListRef}
                                    className="bg-gray-800/30 rounded-sm p-2 h-[512px] overflow-y-auto"
                                >
                                    {allEvents.map(renderEventItem)}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 h-[512px] flex flex-col items-center justify-center">
                                <div className="text-lg mb-2">No Events Found</div>
                                <p className="text-sm">No kill or elite monster events found in timeline data</p>
                                <p className="text-xs mt-2">Timeline data: {recentMatch.timelineData?.length || 0} entries available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}