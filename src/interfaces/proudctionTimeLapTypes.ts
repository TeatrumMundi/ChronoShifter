import { Item } from "./productionTypes";

export interface Position {
    x: number;
    y: number;
}

export type EventType = 
    | "PAUSE_END"
    | "WARD_PLACED"
    | "ITEM_PURCHASED"
    | "ITEM_DESTROYED"
    | "ITEM_SOLD"
    | "ITEM_UNDO"
    | "SKILL_LEVEL_UP"
    | "LEVEL_UP"
    | "CHAMPION_KILL"
    | "CHAMPION_SPECIAL_KILL"
    | "TURRET_PLATE_DESTROYED"
    | "BUILDING_KILL"
    | "ELITE_MONSTER_KILL"
    | "WARD_KILL"
    | "OBJECTIVE_BOUNTY_PRESTART";

// Specific event interfaces
export interface PauseEndEvent extends GameEvent {
    type: "PAUSE_END";
}

export interface WardPlacedEvent extends GameEvent {
    type: "WARD_PLACED";
    wardType?: "YELLOW_TRINKET" | "CONTROL_WARD" | "SIGHT_WARD" | "BLUE_TRINKET" | "UNDEFINED";
    participantId: number;
}

export interface ItemPurchasedEvent extends GameEvent {
    type: "ITEM_PURCHASED";
    participantId: number;
    itemPurchased: Item;
}

export interface ItemDestroyedEvent extends GameEvent {
    type: "ITEM_DESTROYED";
    participantId: number;
    itemDestroyed: Item;
}

export interface ItemSoldEvent extends GameEvent {
    type: "ITEM_SOLD";
    participantId: number;
    itemSold: Item;
}

export interface ItemUndoEvent extends GameEvent {
    type: "ITEM_UNDO";
    participantId: number;
}

export interface SkillLevelUpEvent extends GameEvent {
    type: "SKILL_LEVEL_UP";
    participantId: number;
    skillSlot?: number;
}

export interface LevelUpEvent extends GameEvent {
    type: "LEVEL_UP";
    participantId: number;
    level?: number;
}

export interface ChampionKillEvent extends GameEvent {
    type: "CHAMPION_KILL";
    killerId?: number;
    victimId: number;
    assistingParticipantIds?: number[];
    position?: Position;
}

export interface ChampionSpecialKillEvent extends GameEvent {
    type: "CHAMPION_SPECIAL_KILL";
    killerId?: number;
    participantId: number;
    killType?: string;
}

export interface TurretPlateDestroyedEvent extends GameEvent {
    type: "TURRET_PLATE_DESTROYED";
    participantId: number;
    teamId?: number;
    laneType?: string;
    towerType?: string;
}

export interface BuildingKillEvent extends GameEvent {
    type: "BUILDING_KILL";
    killerId?: number;
    participantId: number;
    teamId?: number;
    buildingType?: string;
    laneType?: string;
    towerType?: string;
}

export interface EliteMonsterKillEvent extends GameEvent {
    type: "ELITE_MONSTER_KILL";
    killerId?: number;
    participantId: number;
    monsterType?: string;
    monsterSubType?: string;
}

export interface WardKillEvent extends GameEvent {
    type: "WARD_KILL";
    killerId: number;
    wardType?: string;
}

export interface ObjectiveBountyPrestartEvent extends GameEvent {
    type: "OBJECTIVE_BOUNTY_PRESTART";
    actualStartTime?: number;
    teamId?: number;
}

export type SpecificGameEvent = 
    | PauseEndEvent
    | WardPlacedEvent
    | ItemPurchasedEvent
    | ItemDestroyedEvent
    | ItemSoldEvent
    | ItemUndoEvent
    | SkillLevelUpEvent
    | LevelUpEvent
    | ChampionKillEvent
    | ChampionSpecialKillEvent
    | TurretPlateDestroyedEvent
    | BuildingKillEvent
    | EliteMonsterKillEvent
    | WardKillEvent
    | ObjectiveBountyPrestartEvent;

export interface GameEvent {
    timestamp: number;
    type: EventType;
    participantId?: number;
}

export interface TimelineFrame {
    timestamp: number;
    events: SpecificGameEvent[];
}

export interface ParticipantTimelineData {
    participantId: number;
    frames: TimelineFrame[];
}