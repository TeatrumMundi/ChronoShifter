import { useState } from "react";
import { ChampionIcon } from "../ChampionIcon";
import { SummonerSpellDisplay } from "../SummonerSpellDisplay";
import { RuneDisplay } from "../RuneDisplay";
import { ItemDisplay } from "../ItemDisplay";
import { calculatePerformanceScore } from "@/utils/helpers";
import { Participant, RecentMatch } from "@/interfaces/productionTypes";

interface MatchDetailsProps {
    match: RecentMatch;
    mainPlayerPUUID: string;
}

interface ParticipantRowProps {
    participant: Participant;
    isMain: boolean;
}

function ParticipantRow({ participant, isMain }: ParticipantRowProps) {
    return (
        <tr
            className={` ${isMain 
                ? (participant.win ? "bg-green-900/70" : "bg-red-900/70") 
                : (participant.win ? "bg-green-950/70" : "bg-red-950/70")}`}
        >
            <td className="px-2 py-1 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <ChampionIcon
                        champion={participant.champion}
                        size={40}
                        showTooltip={true}
                    />
                    <SummonerSpellDisplay
                        summonerSpell1={participant.summonerSpell1}
                        summonerSpell2={participant.summonerSpell2}
                        summonerspellIconsSize={18}
                        boxSize={13}
                    />
                    <RuneDisplay
                        runes={participant.runes}
                        boxSize={14}
                        keyStoneIconSize={18}
                        secendaryRuneIconSize={12}
                    />
                    <span className="ml-1">{participant.riotIdGameName}</span>
                </div>
            </td>
            <td className="px-2 py-1 border-b border-gray-800 text-center">
                {calculatePerformanceScore(participant)}
            </td>
            <td className="px-2 py-1 border-b border-gray-800 text-center">
                {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})
            </td>
            <td className="px-2 py-1 border-b border-gray-800 text-center">
                {participant.totalDamageDealtToChampions}
            </td>
            <td className="px-2 py-1 border-b border-gray-800 text-center">
                {participant.goldEarned}
            </td>
            <td className="px-2 py-1 border-b border-gray-800 text-center">
                {participant.totalMinionsKilled + participant.neutralMinionsKilled}
            </td>
            <td className="px-2 py-1 border-b border-gray-800 text-center">
                {participant.wardsPlaced}
            </td>
            <td className="px-2 py-1 border-b border-gray-800">
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

interface ParticipantTileProps {
    participant: Participant;
    isMain: boolean;
    isWin: boolean;
}

function ParticipantTile({ participant, isMain, isWin }: ParticipantTileProps) {
    return (
        <div
            className={`rounded p-2 border flex flex-col gap-1 
                ${isWin ? "border-green-700 bg-green-950/80" : "border-red-700 bg-red-950/80"}
                ${isMain ? (isWin ? "ring-2 ring-green-400" : "ring-2 ring-red-400") : ""}
            `}
        >
            <div className="flex items-center gap-2">
                <ChampionIcon
                    champion={participant.champion}
                    size={32}
                    showTooltip={true}
                />
                <SummonerSpellDisplay
                    summonerSpell1={participant.summonerSpell1}
                    summonerSpell2={participant.summonerSpell2}
                    summonerspellIconsSize={14}
                    boxSize={10}
                />
                <RuneDisplay
                    runes={participant.runes}
                    boxSize={10}
                    keyStoneIconSize={14}
                    secendaryRuneIconSize={10}
                />
                <ItemDisplay
                    items={participant.items}
                    itemSize={12}
                    smMinWidth={60}
                    trinketMaxWidth={10}
                />
                <span className="ml-1 font-semibold">{participant.riotIdGameName}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1">
                <span><b>CS Score:</b> {calculatePerformanceScore(participant)}</span>
                <span><b>KDA:</b> {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})</span>
                <span><b>DMG:</b> {participant.totalDamageDealtToChampions}</span>
                <span><b>Gold:</b> {participant.goldEarned}</span>
                <span><b>CS:</b> {participant.totalMinionsKilled + participant.neutralMinionsKilled}</span>
                <span><b>Wards:</b> {participant.wardsPlaced}</span>
            </div>
        </div>
    );
}

export function MatchDetails({ match, mainPlayerPUUID }: MatchDetailsProps) {
    const [activeTab, setActiveTab] = useState<"game" | "performance" | "build" | "stats">("game");

    const team1 = match.matchDetails.participants.slice(0, 5);
    const team2 = match.matchDetails.participants.slice(5, 10);

    return (
        <div className="w-full bg-gray-900/95 rounded-b-sm p-4 border-t border-gray-700 animate-fade-in transition-all duration-300">
            {/* Top row with 4 buttons */}
            <div className="flex flex-row gap-3 mb-4">
                <button
                    className={`flex-1 px-4 py-1 rounded-xs font-semibold transition ${
                        activeTab === "game"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                    }`}
                    onClick={() => setActiveTab("game")}
                >
                    Game
                </button>
                <button
                    className={`flex-1 px-4 py-1 rounded-xs font-semibold transition ${
                        activeTab === "performance"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                    }`}
                    onClick={() => setActiveTab("performance")}
                >
                    Performance
                </button>
                <button
                    className={`flex-1 px-4 py-1 rounded-xs font-semibold transition ${
                        activeTab === "build"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                    }`}
                    onClick={() => setActiveTab("build")}
                >
                    Build
                </button>
                <button
                    className={`flex-1 px-4 py-1 rounded-xs font-semibold transition ${
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
                <strong>Match details:</strong>
                <div>
                    {activeTab === "game" && (
                        <>
                            <div className="mt-1 hidden lg:block">
                                <table className="min-w-full border border-gray-700 text-xs sm:text-sm">
                                    <thead>
                                        <tr>
                                            <th className="px-2 py-1 border-b border-gray-700 text-left">Player</th>
                                            <th className="px-2 py-1 border-b border-gray-700 text-center">CS Score</th>
                                            <th className="px-2 py-1 border-b border-gray-700 text-center">KDA</th>
                                            <th className="px-2 py-1 border-b border-gray-700 text-center">Damage</th>
                                            <th className="px-2 py-1 border-b border-gray-700 text-center">Gold</th>
                                            <th className="px-2 py-1 border-b border-gray-700 text-center">CS</th>
                                            <th className="px-2 py-1 border-b border-gray-700 text-center">Wards</th>
                                            <th className="px-2 py-1 border-b border-gray-700 text-center">Items</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th colSpan={8} className={`px-2 py-1 border-b border-gray-700 text-left ${team1[0].win ? "bg-green-900/80 text-green-200" : "bg-red-900/80 text-red-200"}`}>
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
                                            />
                                        ))}
                                        <tr>
                                            <th colSpan={8} className={`px-2 py-1 border-b border-gray-700 text-left ${team2[0].win ? "bg-green-900/80 text-green-200" : "bg-red-900/80 text-red-200"}`}>
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
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Kafelki na telefonach i tabletach */}
                            <div className="mt-1 flex flex-col gap-2 lg:hidden">
                                {team1.map((participant) => (
                                    <ParticipantTile
                                        key={participant.puuid}
                                        participant={participant}
                                        isMain={participant.puuid === mainPlayerPUUID}
                                        isWin={team1[0].win}
                                    />
                                ))}
                                {team2.map((participant) => (
                                    <ParticipantTile
                                        key={participant.puuid}
                                        participant={participant}
                                        isMain={participant.puuid === mainPlayerPUUID}
                                        isWin={team2[0].win}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    {activeTab === "performance" && "Performance tab content goes here."}
                    {activeTab === "build" && "Build tab content goes here."}
                    {activeTab === "stats" && "Stats tab content goes here."}
                </div>
            </div>
        </div>
    );
}