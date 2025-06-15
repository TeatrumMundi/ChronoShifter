import { Item } from "./productionTypes";

// ===================================
// SHARED INTERFACES
// ===================================

/**
 * Represents a position on the game map with x and y coordinates
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * Base interface for all game events
 */
export interface GameEvent {
    timestamp: number;
    type: EventType;
    participantId?: number;
}

/**
 * Represents a timeline frame containing events that occurred at a specific timestamp
 */
export interface TimelineFrame {
    timestamp: number;
    events: SpecificGameEvent[];
}

/**
 * Timeline data for a specific participant containing all their frames
 */
export interface ParticipantTimelineData {
    participantId: number;
    puuid: string;
    frames: TimelineFrame[];
}

// ===================================
// EVENT TYPES
// ===================================

/**
 * All possible event types that can occur during a match
 */
export type EventType = 
    | "BUILDING_KILL"
    | "CHAMPION_KILL"
    | "CHAMPION_SPECIAL_KILL"
    | "ELITE_MONSTER_KILL"
    | "ITEM_DESTROYED"
    | "ITEM_PURCHASED"
    | "ITEM_SOLD"
    | "ITEM_UNDO"
    | "SKILL_LEVEL_UP";

// ===================================
// BUILDING & OBJECTIVE EVENTS
// ===================================

/**
 * Event triggered when a building (turret, inhibitor, nexus) is destroyed
 */
export interface BuildingKillEvent extends GameEvent {
    type: "BUILDING_KILL";
    killerId?: number;
    participantId: number;
    teamId?: number;
    buildingType?: string;
    laneType?: string;
    towerType?: string;
}

/**
 * Event triggered when an elite monster (Baron, Dragon, etc.) is killed
 */
export interface EliteMonsterKillEvent extends GameEvent {
    type: "ELITE_MONSTER_KILL";
    killerId?: number;
    participantId: number;
    monsterType?: string;
    monsterSubType?: string;
}

// ===================================
// CHAMPION EVENTS
// ===================================

/**
 * Event triggered when a champion is killed
 */
export interface ChampionKillEvent extends GameEvent {
    type: "CHAMPION_KILL";
    killerId?: number;
    victimId: number;
    assistingParticipantIds?: number[];
    position?: Position;
}

/**
 * Event triggered for special champion kills (first blood, pentakill, etc.)
 */
export interface ChampionSpecialKillEvent extends GameEvent {
    type: "CHAMPION_SPECIAL_KILL";
    killerId?: number;
    participantId: number;
    killType?: string;
}

/**
 * Event triggered when a champion levels up a skill
 */
export interface SkillLevelUpEvent extends GameEvent {
    type: "SKILL_LEVEL_UP";
    participantId: number;
    skillSlot?: number;
}

// ===================================
// ITEM EVENTS
// ===================================

/**
 * Event triggered when an item is destroyed (consumed, transformed, etc.)
 */
export interface ItemDestroyedEvent extends GameEvent {
    type: "ITEM_DESTROYED";
    participantId: number;
    itemDestroyed: Item;
}

/**
 * Event triggered when an item is purchased from the shop
 */
export interface ItemPurchasedEvent extends GameEvent {
    type: "ITEM_PURCHASED";
    participantId: number;
    itemPurchased: Item;
}

/**
 * Event triggered when an item is sold back to the shop
 */
export interface ItemSoldEvent extends GameEvent {
    type: "ITEM_SOLD";
    participantId: number;
    itemSold: Item;
}

/**
 * Event triggered when a recent purchase is undone
 */
export interface ItemUndoEvent extends GameEvent {
    type: "ITEM_UNDO";
    participantId: number;
}

// ===================================
// UNION TYPES
// ===================================

/**
 * Union type of all specific game event interfaces
 */
export type SpecificGameEvent = 
    | BuildingKillEvent
    | ChampionKillEvent
    | ChampionSpecialKillEvent
    | EliteMonsterKillEvent
    | ItemDestroyedEvent
    | ItemPurchasedEvent
    | ItemSoldEvent
    | ItemUndoEvent
    | SkillLevelUpEvent;