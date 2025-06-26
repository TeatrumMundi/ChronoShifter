import { memo, useMemo } from "react";
import { Participant } from "@/interfaces/productionTypes";
import { ChampionSpellIcon } from "@/components/common/Icons/ChampionSpellIcon";
import { SkillLevelUpEvent, ParticipantTimelineData } from "@/interfaces/proudctionTimeLapTypes";

interface SkillRowSkill {
    id: number;
    name: string;
    spellIndex: number;
}

interface SkillOrderSectionProps {
    mainPlayer: Participant & { timelineData?: ParticipantTimelineData };
}

const SectionHeader = memo(function SectionHeader({ title }: { title: string }) {
    return (
        <div className="relative rounded-t-xl backdrop-blur-sm border-b border-white/20 overflow-hidden
            bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-transparent" />
            <div className="relative z-5 px-3 py-2">
                <h2 className="text-base font-semibold text-blue-200">{title}</h2>
            </div>
        </div>
    );
});

const EmptyState = memo(function EmptyState({ message }: { message: string }) {
    return (
        <div className="text-center text-white/60 py-4">
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-sm">{message}</p>
        </div>
    );
});

const SkillSlot = memo(function SkillSlot({ 
    hasSkill, 
    levelNumber 
}: { 
    hasSkill: boolean; 
    levelNumber?: number;
}) {
    if (hasSkill && levelNumber) {
        return (
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs flex items-center justify-center rounded-md font-bold shadow
                hover:scale-105 transition-transform duration-200">
                {levelNumber}
            </div>
        );
    }
    return (
        <div className="w-6 h-6 bg-white/10 rounded-md border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-colors duration-200" />
    );
});

const SkillRow = memo(function SkillRow({ 
    skill, 
    skillEvents, 
    totalSlots, 
    mainPlayer 
}: { 
    skill: SkillRowSkill;
    skillEvents: SkillLevelUpEvent[];
    totalSlots: number;
    mainPlayer: Participant;
}) {
    return (
        <div className="flex items-center gap-2 p-2 rounded-lg backdrop-blur-sm border border-white/20 
            bg-gradient-to-r from-white/5 via-white/3 to-white/5 hover:from-white/8 hover:via-white/5 hover:to-white/8 
            transition-all duration-200 shadow min-w-0">
            <div className="flex-shrink-0 relative">
                <ChampionSpellIcon
                    champion={mainPlayer.champion}
                    spellIndex={skill.spellIndex}
                    size={28}
                    showTooltip={true}
                    showSpellKey={true}
                    className="rounded-md shadow"
                />
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="flex flex-nowrap gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5 min-w-0">
                {Array.from({ length: totalSlots }, (_, index) => {
                    const event: SkillLevelUpEvent | undefined = skillEvents[index];
                    const hasSkill = event && event.skillSlot === skill.id;
                    return (
                        <SkillSlot
                            key={index}
                            hasSkill={hasSkill}
                            levelNumber={hasSkill ? index + 1 : undefined}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export const SkillOrderSection = memo(function SkillOrderSection({ mainPlayer }: SkillOrderSectionProps) {
    const { skillEvents, totalSlots, skills } = useMemo(() => {
        if (!mainPlayer.timelineData?.frames?.length) {
            return { skillEvents: [] as SkillLevelUpEvent[], totalSlots: 18, skills: [] as SkillRowSkill[] };
        }
        const events: SkillLevelUpEvent[] = mainPlayer.timelineData.frames
            .flatMap(frame => 
                frame.events.filter(
                    (event): event is SkillLevelUpEvent => event.type === 'SKILL_LEVEL_UP'
                )
            )
            .sort((a, b) => a.timestamp - b.timestamp);

        const skillsData: SkillRowSkill[] = [
            { id: 1, name: 'Q', spellIndex: 0 },
            { id: 2, name: 'W', spellIndex: 1 },
            { id: 3, name: 'E', spellIndex: 2 },
            { id: 4, name: 'R', spellIndex: 3 }
        ];

        return {
            skillEvents: events,
            totalSlots: Math.max(18, events.length),
            skills: skillsData
        };
    }, [mainPlayer.timelineData]);

    return (
        <div className="relative rounded-xl backdrop-blur-xl border border-white/20 overflow-hidden
            bg-gradient-to-br from-white/5 via-white/3 to-white/5 shadow-xl shadow-black/10">
            <SectionHeader title="Skill Order" />
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/2 to-transparent" />
            <div className="relative z-5 p-3">
                {mainPlayer.timelineData && mainPlayer.timelineData.frames.length > 0 ? (
                    skillEvents.length === 0 ? (
                        <EmptyState message="No skill level up events during this match" />
                    ) : (
                        <div className="space-y-2">
                            {skills.map(skill => (
                                <SkillRow
                                    key={skill.id}
                                    skill={skill}
                                    skillEvents={skillEvents}
                                    totalSlots={totalSlots}
                                    mainPlayer={mainPlayer}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <EmptyState message="No timeline data available" />
                )}
            </div>
        </div>
    );
});