import { SummonerSpellDisplay } from "@/components/leagueProfile/SummonerSpellDisplay";
import { ChampionIcon } from "@/components/common/Icons/ChampionIcon";
import { RuneDisplay } from "@/components/leagueProfile/RuneDisplay";
import { ItemDisplay } from "@/components/leagueProfile/ItemDisplay";
import { Participant } from "@/interfaces/productionTypes";
import Link from "next/link";
import { getOrdinalPlacement } from "@/utils/helpers";

interface MatchGameTabProps {
    team1: Participant[];
    team2: Participant[];
    mainPlayerPUUID: string;
    region: string;
    time: number;
}

interface ParticipantRowProps {
    participant: Participant;
    isMain: boolean;
    region: string;
    time: number;
}

interface ParticipantTileProps {
    participant: Participant;
    isMain: boolean;
    isWin: boolean;
    region: string;
    isLast?: boolean;
    time: number;
}

// Shared styling functions
const getPlacementStyle = (placement: number): string => {
    switch (placement) {
        case 1:
            return "bg-yellow-500 text-black font-bold"; // Gold for 1st
        case 2:
            return "bg-gray-400 text-black font-bold"; // Silver for 2nd
        case 3:
            return "bg-amber-600 text-white font-bold"; // Bronze for 3rd
        case 4:
        case 5:
            return "bg-green-600 text-white"; // Good performance
        case 6:
        case 7:
            return "bg-blue-600 text-white"; // Average performance
        case 8:
        case 9:
            return "bg-orange-600 text-white"; // Below average
        case 10:
            return "bg-red-600 text-white font-bold"; // Worst
        default:
            return "bg-gray-600 text-white"; // Default
    }
};

const getScoreStyleBase = (placement: number): string => {
    switch (placement) {
        case 1:
            return "bg-yellow-500/20 text-yellow-400"; // Gold theme
        case 2:
            return "bg-gray-400/20 text-gray-300"; // Silver theme
        case 3:
            return "bg-amber-600/20 text-amber-400"; // Bronze theme
        case 4:
        case 5:
            return "bg-green-600/20 text-green-400"; // Good performance
        case 6:
        case 7:
            return "bg-blue-600/20 text-blue-400"; // Average performance
        case 8:
        case 9:
            return "bg-orange-600/20 text-orange-400"; // Below average
        case 10:
            return "bg-red-600/20 text-red-400"; // Worst
        default:
            return "bg-gray-600/20 text-gray-400"; // Default
    }
};

const getDesktopScoreStyle = (placement: number): string => {
    const baseStyle = "px-2 py-0.5 rounded font-semibold text-xs border w-12 text-center";
    const borderColor = placement === 1 ? "border-yellow-500/40" : 
                       placement === 2 ? "border-gray-400/40" :
                       placement === 3 ? "border-amber-600/40" :
                       placement <= 5 ? "border-green-600/40" :
                       placement <= 7 ? "border-blue-600/40" :
                       placement <= 9 ? "border-orange-600/40" :
                       placement === 10 ? "border-red-600/40" : "border-gray-600/40";
    
    return `${baseStyle} ${getScoreStyleBase(placement)} ${borderColor}`;
};

const getMobileScoreStyle = (placement: number): string => {
    const baseStyle = "px-2 py-0.5 rounded font-medium text-xs w-10 text-center";
    return `${baseStyle} ${getScoreStyleBase(placement)}`;
};

const getDesktopPlacementBoxStyle = (placement: number): string => {
    const baseStyle = "text-xs px-2 py-0.5 rounded-sm w-10 text-center";
    return `${baseStyle} ${getPlacementStyle(placement)}`;
};

const getMobilePlacementBoxStyle = (placement: number): string => {
    const baseStyle = "px-2 py-0.5 rounded-sm text-xs w-8 text-center";
    return `${baseStyle} ${getPlacementStyle(placement)}`;
};

// Shared participant info component
const ParticipantInfo = ({ participant, region, size = "large" }: { 
    participant: Participant; 
    region: string; 
    size?: "large" | "small" 
}) => {
    const isLarge = size === "large";
    
    return (
        <div className="flex items-center gap-2">
            <ChampionIcon
                champion={participant.champion}
                size={isLarge ? 40 : 40}
                showTooltip={true}
                level={participant.champLevel}
            />
            <SummonerSpellDisplay
                summonerSpell1={participant.summonerSpell1}
                summonerSpell2={participant.summonerSpell2}
                summonerspellIconsSize={isLarge ? 18 : 14}
                boxSize={isLarge ? 13 : 14}
            />
            <RuneDisplay
                runes={participant.runes}
                boxSize={14}
                keyStoneIconSize={isLarge ? 18 : 14}
                secendaryRuneIconSize={isLarge ? 12 : 10}
            />
            {!isLarge && (
                <ItemDisplay
                    items={participant.items}
                    itemSize={14}
                    smMinWidth={70}
                    trinketMaxWidth={15}
                />
            )}
            <Link
                href={`/${participant.riotIdTagline}/${participant.riotIdGameName}/${region}`}
                className="text-white hover:text-blue-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                title={`${participant.riotIdGameName}#${participant.riotIdTagline}`}
                aria-label={`View profile for ${participant.riotIdGameName}`}
            >
                {participant.riotIdGameName}
            </Link>
        </div>
    );
};

// Shared score and placement display
const ScoreDisplay = ({ participant, isMobile = false }: { 
    participant: Participant; 
    isMobile?: boolean 
}) => (
    <div className={`flex items-center ${isMobile ? "gap-2" : "justify-center gap-2"}`}>
        <span className={isMobile ? getMobileScoreStyle(participant.performancePlacement) : getDesktopScoreStyle(participant.performancePlacement)}>
            {Math.round(participant.performanceScore)}
        </span>
        <span className={isMobile ? getMobilePlacementBoxStyle(participant.performancePlacement) : getDesktopPlacementBoxStyle(participant.performancePlacement)}>
            {getOrdinalPlacement(participant.performancePlacement)}
        </span>
    </div>
);

function ParticipantRow({ participant, isMain, region }: ParticipantRowProps) {
    return (
        <tr
            className={` ${isMain 
                ? (participant.win ? "bg-green-900/70" : "bg-red-900/70") 
                : (participant.win ? "bg-green-950/70" : "bg-red-950/70")}
                `}   
        >
            <td className="px-2 py-1">
                <ParticipantInfo participant={participant} region={region} size="large" />
            </td>
            <td className="px-2 py-1 text-center">
                <ScoreDisplay participant={participant} />
            </td>
            <td className="px-2 py-1 text-center">
                {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})
            </td>
            <td className="px-2 py-1 text-center">
                {participant.totalDamageDealtToChampions.toLocaleString()}
            </td>
            <td className="px-2 py-1 text-center">
                {participant.goldEarned.toLocaleString()}
            </td>
            <td className="px-2 py-1 text-center">
                {participant.totalMinionsKilled + participant.neutralMinionsKilled}
            </td>
            <td className="px-2 py-1 text-center">
                {participant.wardsPlaced}
            </td>
            <td className="px-2 py-1">
                <div className="flex justify-center w-[40px] mx-auto">
                    <ItemDisplay 
                        items={participant.items}
                        itemSize={18}
                        smMinWidth={90}
                        trinketMaxWidth={12}
                    />
                </div>
            </td>
        </tr>
    );
}

function ParticipantTile({ participant, isMain, isWin, region, isLast = false }: ParticipantTileProps) {
    return (
        <div
            className={`rounded-sm p-2 mx-2 border flex flex-col
                ${isWin ? "border-green-700 bg-green-950/80" : "border-red-700 bg-red-950/80"}
                ${isMain ? (isWin ? "ring-2 ring-green-400" : "ring-2 ring-red-400") : ""}
                ${isLast ? "mb-2" : ""}
            `}
        >
            <ParticipantInfo participant={participant} region={region} size="small" />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1">
                <span className="flex items-center gap-2">
                    <b>Rank:</b> 
                    <ScoreDisplay participant={participant} isMobile={true} />
                </span>
                <span><b>KDA:</b> {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})</span>
                <span><b>DMG:</b> {participant.totalDamageDealtToChampions.toLocaleString()}</span>
                <span><b>Gold:</b> {participant.goldEarned.toLocaleString()}</span>
                <span><b>CS:</b> {participant.totalMinionsKilled + participant.neutralMinionsKilled}</span>
                <span><b>Wards:</b> {participant.wardsPlaced}</span>
            </div>
        </div>
    );
}

export function MatchGameTab({ team1, team2, mainPlayerPUUID, region, time }: MatchGameTabProps) {
    return (
        <>
            <div className="hidden lg:block">
                <table className="min-w-full text-xs sm:text-sm">
                    <thead>
                        <tr>
                            <th className="px-2 py-1 text-left">Player</th>
                            <th className="px-2 py-1 text-center">CS Score</th>
                            <th className="px-2 py-1 text-center">KDA</th>
                            <th className="px-2 py-1 text-center">Damage</th>
                            <th className="px-2 py-1 text-center">Gold</th>
                            <th className="px-2 py-1 text-center">CS</th>
                            <th className="px-2 py-1 text-center">Wards</th>
                            <th className="px-2 py-1 text-center">Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th colSpan={8} className={`px-2 py-1 text-left ${team1[0].win ? "bg-green-900/80 text-green-200" : "bg-red-900/80 text-red-200"}`}>
                                {team1[0].win
                                    ? <span className="text-green-400 font-bold">Victory</span>
                                    : <span className="text-red-400 font-bold">Defeat</span>
                                }
                            </th>
                        </tr>
                        {team1.map((participant) => (
                            <ParticipantRow
                                key={participant.puuid}
                                participant={participant}
                                isMain={participant.puuid === mainPlayerPUUID}
                                region={region}
                                time={time}
                            />
                        ))}
                        <tr>
                            <th colSpan={8} className={`px-2 py-1 text-left ${team2[0].win ? "bg-green-900/80 text-green-200" : "bg-red-900/80 text-red-200"}`}>
                                {team2[0].win
                                    ? <span className="text-green-400 font-bold">Victory</span>
                                    : <span className="text-red-400 font-bold">Defeat</span>
                                }
                            </th>
                        </tr>
                        {team2.map((participant) => (
                            <ParticipantRow
                                key={participant.puuid}
                                participant={participant}
                                isMain={participant.puuid === mainPlayerPUUID}
                                region={region}
                                time={time}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Kafelki na telefonach i tabletach */}
            <div className="mt-1 flex flex-col gap-2 lg:hidden">
                {team1.map((participant, idx) => (
                    <ParticipantTile
                        key={participant.puuid}
                        participant={participant}
                        isMain={participant.puuid === mainPlayerPUUID}
                        isWin={team1[0].win}
                        region={region}
                        isLast={idx === team1.length - 1 && team2.length === 0}
                        time={time}
                    />
                ))}
                {team2.map((participant, idx) => (
                    <ParticipantTile
                        key={participant.puuid}
                        participant={participant}
                        isMain={participant.puuid === mainPlayerPUUID}
                        isWin={team2[0].win}
                        region={region}
                        isLast={idx === team2.length - 1}
                        time={time}
                    />
                ))}
            </div>
        </>
    );
}