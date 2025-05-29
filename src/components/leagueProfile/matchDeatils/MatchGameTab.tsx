import { Participant } from "@/interfaces/productionTypes";
import { calculatePerformanceScore } from "@/utils/helpers";
import { ChampionIcon } from "../../common/Icons/ChampionIcon";
import { SummonerSpellDisplay } from "../SummonerSpellDisplay";
import { RuneDisplay } from "../RuneDisplay";
import { ItemDisplay } from "../ItemDisplay";
import Link from "next/link";

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

function ParticipantRow({ participant, isMain, region, time}: ParticipantRowProps) {
    return (
        <tr
            className={` ${isMain 
                ? (participant.win ? "bg-green-900/70" : "bg-red-900/70") 
                : (participant.win ? "bg-green-950/70" : "bg-red-950/70")}
                `}   
        >
            <td className="px-2 py-1">
                <div className="flex items-center gap-2">
                    <ChampionIcon
                        champion={participant.champion}
                        size={40}
                        showTooltip={true}
                        level={participant.champLevel}
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
                    <Link
                        href={`/${participant.riotIdTagline}/${participant.riotIdGameName}/${region}`}
                        className="text-white hover:text-blue-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                        title={`${participant.riotIdGameName}#${participant.riotIdTagline}`}
                        aria-label={`View profile for ${participant.riotIdGameName}`}
                    >
                        {participant.riotIdGameName}
                    </Link>
                </div>
            </td>
            <td className="px-2 py-1 text-center">
                {calculatePerformanceScore(participant, time)}
            </td>
            <td className="px-2 py-1 text-center">
                {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})
            </td>
            <td className="px-2 py-1 text-center">
                {participant.totalDamageDealtToChampions}
            </td>
            <td className="px-2 py-1 text-center">
                {participant.goldEarned}
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

function ParticipantTile({participant, isMain, isWin, region, isLast = false, time}: ParticipantTileProps) {
    return (
        <div
            className={`rounded-sm p-2 mx-2 border flex flex-col
                ${isWin ? "border-green-700 bg-green-950/80" : "border-red-700 bg-red-950/80"}
                ${isMain ? (isWin ? "ring-2 ring-green-400" : "ring-2 ring-red-400") : ""}
                ${isLast ? "mb-2" : ""}
            `}
        >
            <div className="flex items-center gap-1">
                <ChampionIcon
                    champion={participant.champion}
                    size={40}
                    showTooltip={true}
                    level={participant.champLevel}
                />
                <SummonerSpellDisplay
                    summonerSpell1={participant.summonerSpell1}
                    summonerSpell2={participant.summonerSpell2}
                    summonerspellIconsSize={14}
                    boxSize={14}
                />
                <RuneDisplay
                    runes={participant.runes}
                    boxSize={14}
                    keyStoneIconSize={14}
                    secendaryRuneIconSize={10}
                />
                <ItemDisplay
                    items={participant.items}
                    itemSize={14}
                    smMinWidth={70}
                    trinketMaxWidth={15}
                />
                <Link
                    href={`/${participant.riotIdTagline}/${participant.riotIdGameName}/${region}`}
                    className="text-white hover:text-blue-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                    title={`${participant.riotIdGameName}#${participant.riotIdTagline}`}
                    aria-label={`View profile for ${participant.riotIdGameName}`}
                >
                    {participant.riotIdGameName}
                </Link>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1">
                <span><b>CS Score:</b> {calculatePerformanceScore(participant, time)}</span>
                <span><b>KDA:</b> {participant.kills}/{participant.deaths}/{participant.assists} ({participant.kda})</span>
                <span><b>DMG:</b> {participant.totalDamageDealtToChampions}</span>
                <span><b>Gold:</b> {participant.goldEarned}</span>
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