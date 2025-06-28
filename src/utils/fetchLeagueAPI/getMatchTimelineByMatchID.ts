import { RawTimelineData, RawTimelineEvent } from '@/interfaces/rawTypes';
import { fetchFromRiotAPI } from './fetchFromRiotAPI';
import { ParticipantTimelineData } from '@/interfaces/proudctionTimeLapTypes';
import { Item } from '@/interfaces/productionTypes';
import { getItemById } from '../getLeagueAssets/getLOLObject';

export default async function getMatchTimelineByMatchID(matchID: string, activeRegion: string): Promise<ParticipantTimelineData[]> {
    const response: Response = await fetchFromRiotAPI(
        `https://${activeRegion}.api.riotgames.com/lol/match/v5/matches/${matchID}/timeline`
    );
    
    const timelineData: RawTimelineData = await response.json();
    
    // Check if the response has the expected structure
    if (!timelineData.info) {
        throw new Error('Timeline data missing info property');
    }
    
    if (!timelineData.info.participants) {
        throw new Error('Timeline data missing participants property');
    }
    
    // Check if frames exist
    if (!timelineData.info.frames) {
        throw new Error('Timeline data missing frames property');
    }
    
    const participantsTimelineData: ParticipantTimelineData[] = [];
    
    // Create timeline data for each participant
    for (const participant of timelineData.info.participants) {
        const participantTimeline: ParticipantTimelineData = {
            participantId: participant.participantId,
            puuid: participant.puuid,
            frames: []
        };
        
        for (const frame of timelineData.info.frames) {
            const playerEvents = frame.events?.filter((event: RawTimelineEvent) => 
                event.participantId === participant.participantId ||
                event.killerId === participant.participantId ||
                event.victimId === participant.participantId ||
                event.creatorId === participant.participantId ||
                (event.assistingParticipantIds && event.assistingParticipantIds.includes(participant.participantId))
            ) || [];
            
            const mappedEvents = await Promise.all(playerEvents.map(async (event: RawTimelineEvent) => {
                const mappedEvent: RawTimelineEvent & { 
                    itemPurchased?: Item; 
                    itemSold?: Item; 
                    itemDestroyed?: Item; 
                } = {
                    timestamp: event.timestamp || 0,
                    type: event.type || 'PAUSE_END',
                    ...event
                };
                
                // Assign participantId for events that don't have it
                if (
                    !mappedEvent.participantId &&
                    ['WARD_PLACED', 'ITEM_PURCHASED', 'ITEM_DESTROYED', 'ITEM_SOLD', 'ITEM_UNDO',
                     'SKILL_LEVEL_UP', 'LEVEL_UP', 'CHAMPION_SPECIAL_KILL', 'TURRET_PLATE_DESTROYED',
                     'BUILDING_KILL', 'ELITE_MONSTER_KILL'].includes(mappedEvent.type ?? '')
                ) {
                    mappedEvent.participantId = participant.participantId;
                }
                
                if (mappedEvent.type === 'CHAMPION_KILL' && !mappedEvent.victimId) {
                    mappedEvent.victimId = participant.participantId;
                }
                
                if (mappedEvent.type === 'WARD_KILL' && !mappedEvent.killerId) {
                    mappedEvent.killerId = participant.participantId;
                }

                // Convert itemId to Item object for item events
                if (mappedEvent.type === 'ITEM_PURCHASED' && mappedEvent.itemId) {
                    const item = await getItemById(mappedEvent.itemId);
                    if (item) {
                        mappedEvent.itemPurchased = item;
                        delete mappedEvent.itemId;
                    }
                }
                
                if (mappedEvent.type === 'ITEM_SOLD' && mappedEvent.itemId) {
                    const item = await getItemById(mappedEvent.itemId);
                    if (item) {
                        mappedEvent.itemSold = item;
                        delete mappedEvent.itemId;
                    }
                }
                
                if (mappedEvent.type === 'ITEM_DESTROYED' && mappedEvent.itemId) {
                    const item = await getItemById(mappedEvent.itemId);
                    if (item) {
                        mappedEvent.itemDestroyed = item;
                        delete mappedEvent.itemId;
                    }
                }

                return mappedEvent as unknown as import('@/interfaces/proudctionTimeLapTypes').SpecificGameEvent;
            }));

            const validEvents = mappedEvents.filter((event): event is import('@/interfaces/proudctionTimeLapTypes').SpecificGameEvent => !!event.type);

            if (validEvents.length > 0) {
                participantTimeline.frames.push({
                    timestamp: frame.timestamp,
                    events: validEvents
                });
            }
        }
        
        participantsTimelineData.push(participantTimeline);
    }
    
    return participantsTimelineData;
}

export function getPlayerFromTimelines(
    timelinesArray: ParticipantTimelineData[],
    playerPuuid: string
): ParticipantTimelineData | null {
    return timelinesArray.find(timeline => timeline.puuid === playerPuuid) || null;
}