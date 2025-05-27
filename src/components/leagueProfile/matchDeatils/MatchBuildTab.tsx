import { Participant } from "@/interfaces/productionTypes";

interface MatchBuildTabProps {
    mainPlayer: Participant;
}

export function MatchBuildTab({ mainPlayer }: MatchBuildTabProps) 
{
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Runes</h2>
            <div className="space-y-2">
                {mainPlayer.runes.map((rune, index) => (
                    <div key={index} className="p-2 border rounded">
                        <strong>Rune Tree:</strong> {rune.iconPath}
                    </div>
                ))}
            </div>
        </div>
    );
}