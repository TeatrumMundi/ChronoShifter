import { RawTimelineData, RawTimelineEvent } from '@/interfaces/rawTypes';
import { fetchFromRiotAPI } from './fetchFromRiotAPI';
import { ParticipantTimelineData } from '@/interfaces/proudctionTimeLapTypes';
import { Item } from '@/interfaces/productionTypes';
import { getItemById } from '../../getLeagueAssets/getLOLObject';

export async function getMatchTimelineByMatchID(matchID: string, region: string, playerPuuid: string): Promise<ParticipantTimelineData[]> {
    const response: Response = await fetchFromRiotAPI(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}/timeline`
    );
    
    const timelineData: RawTimelineData = await response.json();
    
    // Check if the response has the expected structure
    if (!timelineData.info) {
        throw new Error('Timeline data missing info property');
    }
    
    if (!timelineData.info.participants) {
        throw new Error('Timeline data missing participants property');
    }
    
    // Find the participant ID for the specified player
    const participant = timelineData.info.participants.find(p => p.puuid === playerPuuid);
    if (!participant) {
        console.log('Available participants:', timelineData.info.participants.map(p => ({ id: p.participantId, puuid: p.puuid })));
        throw new Error(`Player with PUUID ${playerPuuid} not found in this match`);
    }
    
    const targetParticipantId = participant.participantId;
    const participantsTimelineData: ParticipantTimelineData[] = [];
    
    const participantTimeline: ParticipantTimelineData = {
        participantId: targetParticipantId,
        frames: []
    };
    
    // Check if frames exist
    if (!timelineData.info.frames) {
        throw new Error('Timeline data missing frames property');
    }
    
    for (const frame of timelineData.info.frames) {
        const playerEvents = frame.events?.filter((event: RawTimelineEvent) => 
            event.participantId === targetParticipantId ||
            event.killerId === targetParticipantId ||
            event.victimId === targetParticipantId ||
            event.creatorId === targetParticipantId ||
            (event.assistingParticipantIds && event.assistingParticipantIds.includes(targetParticipantId))
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
            
            // Przypisz participantId dla eventów, które go nie mają
            if (
                !mappedEvent.participantId &&
                ['WARD_PLACED', 'ITEM_PURCHASED', 'ITEM_DESTROYED', 'ITEM_SOLD', 'ITEM_UNDO',
                 'SKILL_LEVEL_UP', 'LEVEL_UP', 'CHAMPION_SPECIAL_KILL', 'TURRET_PLATE_DESTROYED',
                 'BUILDING_KILL', 'ELITE_MONSTER_KILL'].includes(mappedEvent.type ?? '')
            ) {
                mappedEvent.participantId = targetParticipantId;
            }
            
            if (mappedEvent.type === 'CHAMPION_KILL' && !mappedEvent.victimId) {
                mappedEvent.victimId = targetParticipantId;
            }
            
            if (mappedEvent.type === 'WARD_KILL' && !mappedEvent.killerId) {
                mappedEvent.killerId = targetParticipantId;
            }

            // Konwertuj itemId na obiekt Item dla eventów itemów
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
    
    return participantsTimelineData;
}