import { Participant } from "@/interfaces/productionTypes";
import { RunesSection } from "./RunesSection";
import { ItemTimelineSection } from "./ItemTimelineSection";
import { SkillOrderSection } from "./SkillOrderSection";


interface MatchBuildTabProps {
    mainPlayer: Participant;
}

export function MatchBuildTab({ mainPlayer }: MatchBuildTabProps) {
    return (
        <div className="p-0">
            <RunesSection mainPlayer={mainPlayer} />
            <ItemTimelineSection mainPlayer={mainPlayer} />
            <SkillOrderSection mainPlayer={mainPlayer} />
        </div>
    );
}