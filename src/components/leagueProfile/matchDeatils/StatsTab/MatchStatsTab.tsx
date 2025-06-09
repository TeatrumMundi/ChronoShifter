import { Participant } from "@/interfaces/productionTypes";

interface MatchStatsTabProps {
    team1: Participant[];
    team2: Participant[];
    mainPlayerPUUID: string;
    region: string;
}

export function MatchStatsTab({ team1, team2, mainPlayerPUUID, region }: MatchStatsTabProps) {
    return (
        <div className="p-4">
            <div className="text-center text-gray-400">
                <h3 className="text-lg font-semibold mb-2">Match Statistics</h3>
                <p>Statistics tab is coming soon...</p>
            </div>
        </div>
    );
}