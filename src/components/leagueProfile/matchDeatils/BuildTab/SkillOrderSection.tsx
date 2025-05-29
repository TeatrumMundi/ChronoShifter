import { Participant } from "@/interfaces/productionTypes";
import { ChampionSpellIcon } from "@/components/common/Icons/ChampionSpellIcon";

interface SkillOrderSectionProps {
    mainPlayer: Participant;
}

const renderSectionHeader = (title: string) => (
    <div className="bg-blue-600 text-white px-4 py-1">
        <h2 className="text-lg font-semibold">{title}</h2>
    </div>
);

const renderEmptyState = (message: string) => (
    <div className="text-center text-gray-500 py-4">{message}</div>
);

export function SkillOrderSection({ mainPlayer }: SkillOrderSectionProps) {
    return (
        <div className="mt-6">
            {renderSectionHeader("Skill Order")}
            <div className="p-4">
                {mainPlayer.timelineData && mainPlayer.timelineData.frames.length > 0 ? (
                    (() => {
                        const skillEvents = mainPlayer.timelineData.frames
                            .flatMap(frame => 
                                frame.events.filter(event => event.type === 'SKILL_LEVEL_UP')
                            )
                            .sort((a, b) => a.timestamp - b.timestamp);

                        if (skillEvents.length === 0) {
                            return renderEmptyState("No skill level up events during this match");
                        }

                        const skills = [
                            { id: 1, name: 'Q', spellIndex: 0 },
                            { id: 2, name: 'W', spellIndex: 1 },
                            { id: 3, name: 'E', spellIndex: 2 },
                            { id: 4, name: 'R', spellIndex: 3 }
                        ];

                        const totalSlots = Math.max(18, skillEvents.length);

                        const renderSkillRow = (skill: { id: number; name: string; spellIndex: number }) => (
                            <div key={skill.id} className="flex items-start gap-3 mb-3">
                                <div className="flex-shrink-0">
                                    <ChampionSpellIcon
                                        champion={mainPlayer.champion}
                                        spellIndex={skill.spellIndex}
                                        size={32}
                                        showTooltip={true}
                                        showSpellKey={true}
                                        className="rounded-sm"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {Array.from({ length: totalSlots }, (_, index) => {
                                        const event = skillEvents[index];
                                        return (
                                            <div 
                                                key={index} 
                                                className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                                            >
                                                {event && event.skillSlot === skill.id ? (
                                                    <div className="w-6 h-6 bg-blue-600 text-white text-xs flex items-center justify-center rounded-sm font-bold">
                                                        {index + 1}
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 bg-white/10 rounded-sm" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                        
                        return (
                            <div>
                                {skills.map(renderSkillRow)}
                            </div>
                        );
                    })()
                ) : (
                    renderEmptyState("No timeline data available")
                )}
            </div>
        </div>
    );
}