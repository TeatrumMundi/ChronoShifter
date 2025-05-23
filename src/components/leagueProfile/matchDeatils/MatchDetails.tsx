import { useState } from "react";
import { ChampionIcon } from "../ChampionIcon";
import { SummonerSpellDisplay } from "../SummonerSpellDisplay";
import { RuneDisplay } from "../RuneDisplay";
import { ItemDisplay } from "../ItemDisplay";
import { calculatePerformanceScore } from "@/utils/helpers";
import { RecentMatch } from "@/interfaces/productionTypes";

interface MatchDetailsProps {
    match: RecentMatch;
    mainPlayerPUUID: string;
}

export function MatchDetails({ match, mainPlayerPUUID }: MatchDetailsProps) {
    const [activeTab, setActiveTab] = useState<"game" | "performance" | "build" | "stats">("game");

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
                            {/* Tabela tylko na większych ekranach */}
                            <div className="mt-1 hidden lg:block">
                                <table className={`min-w-full border border-gray-700 text-xs sm:text-sm ${match.matchDetails.participants[0].win ? "bg-green-950/40" : "bg-red-950/40"}`}>
                                    <thead>
                                        <tr className={`${match.matchDetails.participants[0].win ? "bg-green-900/80 text-green-200" : "bg-red-900/80 text-red-200"}`}>
                                            <th className="px-2 py-1 border-b border-gray-700 text-left">
                                                {match.matchDetails.participants[0].win
                                                    ? <span className="text-green-400 font-bold">Victory</span>
                                                    : <span className="text-red-400 font-bold">Defeat</span>
                                                }
                                            </th>
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
                                        {[...Array(5)].map((_, i) => {
                                            const isMain = match.matchDetails.participants[i].puuid === mainPlayerPUUID;
                                            return (
                                                <tr
                                                    key={i}
                                                    className={` ${isMain 
                                                        ? (match.matchDetails.participants[0].win ? "bg-green-900/70" : "bg-red-900/70") 
                                                        : (match.matchDetails.participants[0].win ? "bg-green-950/70" : "bg-red-950/70")}`}
                                                >
                                                    <td className="px-2 py-1 border-b border-gray-800">
                                                        <div className="flex items-center gap-2">
                                                            <ChampionIcon
                                                                champion={match.matchDetails.participants[i].champion}
                                                                size={40}
                                                                showTooltip={true}
                                                            />
                                                            <SummonerSpellDisplay
                                                                summonerSpell1={match.matchDetails.participants[i].summonerSpell1}
                                                                summonerSpell2={match.matchDetails.participants[i].summonerSpell2}
                                                                summonerspellIconsSize={18}
                                                                boxSize={13}
                                                            />
                                                            <RuneDisplay
                                                                runes={match.matchDetails.participants[i].runes}
                                                                boxSize={14}
                                                                keyStoneIconSize={18}
                                                                secendaryRuneIconSize={12}
                                                            />
                                                            <span className="ml-1">{match.matchDetails.participants[i].riotIdGameName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {calculatePerformanceScore(match.matchDetails.participants[i])}
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {match.matchDetails.participants[i].kills}/
                                                        {match.matchDetails.participants[i].deaths}/
                                                        {match.matchDetails.participants[i].assists}
                                                        {" "}({match.matchDetails.participants[i].kda})
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {match.matchDetails.participants[i].totalDamageDealtToChampions}
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {match.matchDetails.participants[i].goldEarned}
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {match.matchDetails.participants[i].totalMinionsKilled +
                                                            match.matchDetails.participants[i].neutralMinionsKilled}
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {match.matchDetails.participants[i].wardsPlaced}
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800">
                                                        <div className="flex justify-center w-[40px] mx-auto">
                                                            <ItemDisplay 
                                                                items={match.matchDetails.participants[i].items}
                                                                itemSize={18}
                                                                smMinWidth={90}
                                                                trinketMaxWidth={12}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {/* DRUGA DRUŻYNA */}
                                <table className={`min-w-full border border-gray-700 text-xs sm:text-sm mt-4 ${match.matchDetails.participants[5].win ? "bg-green-950/40" : "bg-red-950/40"}`}>
                                    <thead>
                                        <tr className={`${match.matchDetails.participants[5].win ? "bg-green-900/80 text-green-200" : "bg-red-900/80 text-red-200"}`}>
                                            <th className="px-2 py-1 border-b border-gray-700 text-left">
                                                {match.matchDetails.participants[5].win
                                                    ? <span className="text-green-400 font-bold">Victory</span>
                                                    : <span className="text-red-400 font-bold">Defeat</span>
                                                }
                                            </th>
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
                                        {[...Array(5)].map((_, i) => {
                                            const idx = i + 5;
                                            const isMain = match.matchDetails.participants[idx].puuid === mainPlayerPUUID;
                                            return (
                                                <tr
                                                    key={idx}
                                                    className={` ${isMain 
                                                        ? (match.matchDetails.participants[5].win ? "bg-green-900/70" : "bg-red-900/70") 
                                                        : (match.matchDetails.participants[5].win ? "bg-green-950/70" : "bg-red-950/70")}`}
                                                >
                                                    <td className="px-2 py-1 border-b border-gray-800">
                                                        <div className="flex items-center gap-2">
                                                            <ChampionIcon
                                                                champion={match.matchDetails.participants[idx].champion}
                                                                size={40}
                                                                showTooltip={true}
                                                            />
                                                            <SummonerSpellDisplay
                                                                summonerSpell1={match.matchDetails.participants[idx].summonerSpell1}
                                                                summonerSpell2={match.matchDetails.participants[idx].summonerSpell2}
                                                                summonerspellIconsSize={18}
                                                                boxSize={13}
                                                            />
                                                            <RuneDisplay
                                                                runes={match.matchDetails.participants[idx].runes}
                                                                boxSize={14}
                                                                keyStoneIconSize={18}
                                                                secendaryRuneIconSize={12}
                                                            />
                                                            <span className="ml-1">{match.matchDetails.participants[idx].riotIdGameName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {calculatePerformanceScore(match.matchDetails.participants[idx])}
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {match.matchDetails.participants[idx].kills}/
                                                        {match.matchDetails.participants[idx].deaths}/
                                                        {match.matchDetails.participants[idx].assists}
                                                        {" "}({match.matchDetails.participants[idx].kda})
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {match.matchDetails.participants[idx].totalDamageDealtToChampions}
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {match.matchDetails.participants[idx].goldEarned}
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {match.matchDetails.participants[idx].totalMinionsKilled +
                                                            match.matchDetails.participants[idx].neutralMinionsKilled}
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800 text-center">
                                                        {match.matchDetails.participants[idx].wardsPlaced}
                                                    </td>
                                                    <td className="px-2 py-1 border-b border-gray-800">
                                                        <div className="flex justify-center w-[40px] mx-auto">
                                                            <ItemDisplay 
                                                                items={match.matchDetails.participants[idx].items}
                                                                itemSize={18}
                                                                smMinWidth={90}
                                                                trinketMaxWidth={12}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* Kafelki na telefonach i tabletach */}
                            <div className="mt-1 flex flex-col gap-2 lg:hidden">
                                {[...Array(5)].map((_, i) => {
                                    const isMain = match.matchDetails.participants[i].puuid === mainPlayerPUUID;
                                    const isWin = match.matchDetails.participants[0].win;
                                    return (
                                        <div
                                            key={i}
                                            className={`rounded p-2 border flex flex-col gap-1 
                                                ${isWin ? "border-green-700 bg-green-950/80" : "border-red-700 bg-red-950/80"}
                                                ${isMain ? (isWin ? "ring-2 ring-green-400" : "ring-2 ring-red-400") : ""}
                                            `}
                                        >
                                            <div className="flex items-center gap-2">
                                                <ChampionIcon
                                                    champion={match.matchDetails.participants[i].champion}
                                                    size={32}
                                                    showTooltip={true}
                                                />
                                                <SummonerSpellDisplay
                                                    summonerSpell1={match.matchDetails.participants[i].summonerSpell1}
                                                    summonerSpell2={match.matchDetails.participants[i].summonerSpell2}
                                                    summonerspellIconsSize={14}
                                                    boxSize={10}
                                                />
                                                <RuneDisplay
                                                    runes={match.matchDetails.participants[i].runes}
                                                    boxSize={10}
                                                    keyStoneIconSize={14}
                                                    secendaryRuneIconSize={10}
                                                />
                                                <ItemDisplay
                                                    items={match.matchDetails.participants[i].items}
                                                    itemSize={12}
                                                    smMinWidth={60}
                                                    trinketMaxWidth={10}
                                                />
                                                <span className="ml-1 font-semibold">{match.matchDetails.participants[i].riotIdGameName}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1">
                                                <span><b>CS Score:</b> {calculatePerformanceScore(match.matchDetails.participants[i])}</span>
                                                <span><b>KDA:</b> {match.matchDetails.participants[i].kills}/{match.matchDetails.participants[i].deaths}/{match.matchDetails.participants[i].assists} ({match.matchDetails.participants[i].kda})</span>
                                                <span><b>DMG:</b> {match.matchDetails.participants[i].totalDamageDealtToChampions}</span>
                                                <span><b>Gold:</b> {match.matchDetails.participants[i].goldEarned}</span>
                                                <span><b>CS:</b> {match.matchDetails.participants[i].totalMinionsKilled + match.matchDetails.participants[i].neutralMinionsKilled}</span>
                                                <span><b>Wards:</b> {match.matchDetails.participants[i].wardsPlaced}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* DRUGA DRUŻYNA */}
                                {[...Array(5)].map((_, i) => {
                                    const idx = i + 5;
                                    const isMain = match.matchDetails.participants[idx].puuid === mainPlayerPUUID;
                                    const isWin = match.matchDetails.participants[5].win;
                                    return (
                                        <div
                                            key={idx}
                                            className={`rounded p-2 border flex flex-col gap-1 
                                                ${isWin ? "border-green-700 bg-green-950/80" : "border-red-700 bg-red-950/80"}
                                                ${isMain ? (isWin ? "ring-2 ring-green-400" : "ring-2 ring-red-400") : ""}
                                            `}
                                        >
                                            <div className="flex items-center gap-2">
                                                <ChampionIcon
                                                    champion={match.matchDetails.participants[idx].champion}
                                                    size={32}
                                                    showTooltip={true}
                                                />
                                                <SummonerSpellDisplay
                                                    summonerSpell1={match.matchDetails.participants[idx].summonerSpell1}
                                                    summonerSpell2={match.matchDetails.participants[idx].summonerSpell2}
                                                    summonerspellIconsSize={14}
                                                    boxSize={10}
                                                />
                                                <RuneDisplay
                                                    runes={match.matchDetails.participants[idx].runes}
                                                    boxSize={10}
                                                    keyStoneIconSize={14}
                                                    secendaryRuneIconSize={10}
                                                />
                                                <ItemDisplay
                                                    items={match.matchDetails.participants[idx].items}
                                                    itemSize={12}
                                                    smMinWidth={60}
                                                    trinketMaxWidth={10}
                                                />
                                                <span className="ml-1 font-semibold">{match.matchDetails.participants[idx].riotIdGameName}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1">
                                                <span><b>CS Score:</b> {calculatePerformanceScore(match.matchDetails.participants[idx])}</span>
                                                <span><b>KDA:</b> {match.matchDetails.participants[idx].kills}/{match.matchDetails.participants[idx].deaths}/{match.matchDetails.participants[idx].assists} ({match.matchDetails.participants[idx].kda})</span>
                                                <span><b>DMG:</b> {match.matchDetails.participants[idx].totalDamageDealtToChampions}</span>
                                                <span><b>Gold:</b> {match.matchDetails.participants[idx].goldEarned}</span>
                                                <span><b>CS:</b> {match.matchDetails.participants[idx].totalMinionsKilled + match.matchDetails.participants[idx].neutralMinionsKilled}</span>
                                                <span><b>Wards:</b> {match.matchDetails.participants[idx].wardsPlaced}</span>
                                            </div>
                                        </div>
                                    );
                                })}
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