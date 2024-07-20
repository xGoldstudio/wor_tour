import { CardState } from "../gameEngine/states/CardStatesData";
import { CardRarity } from "./DataStoreType";

export type EventType =
  | DummyEvent
  | StartGameSequence
  | StartGame
  | ManaIncreaseEvent
  | SetManaIncreaseSpeed
  | ManaConsumeEvent
  | PlaceCardEvent
  | StartEarningMana
  | CardStartAttackingEvent
  | CardAttackingEvent
  | PlayerDamageEvent
  | CardDamageEvent
  | CardDestroyedEvent
  | GameOverEvent
  | DrawCardEvent
  | HealCardEvent
  | CardDamagResolveEvent
  | PlayerDamageResolveEvent
  | ModifyStateValueEvent
  | RemoveStateEvent
  | TriggerStateEvent
  | AddStateEvent;

export interface DummyEvent { // this event should be ignored
  type: "dummyEvent";
}

export interface StartGameSequence {
  type: "startGameSequence";
}

export interface StartGame {
  type: "startGame";
}

export interface ManaConsumeEvent {
  type: "manaConsume";
  isPlayer: boolean;
  delta: number;
}

export interface StartEarningMana {
  type: "startEarningMana";
  isPlayer: boolean;
}

export interface SetManaIncreaseSpeed {
  type: "setManaIncreaseSpeed";
  isPlayer: boolean;
  speed: number;
}

export interface ManaIncreaseEvent {
  type: "manaIncrease";
  isPlayer: boolean;
}

export interface PlaceCardEvent {
  type: "placeCard";
  isPlayer: boolean;
  targetPosition: number;
  cardInHandPosition: number;
}

export interface CardStartAttackingEvent {
  type: "cardStartAttacking";
  isPlayer: boolean;
  cardPosition: number;
  instanceId: number;
}

export interface CardAttackingEvent {
  type: "cardAttacking";
  isPlayer: boolean;
  cardPosition: number;
  instanceId: number;
}

export interface PlayerDamageEvent {
  type: "playerDamage";
  isPlayer: boolean;
  damage: number;
  initiator: CardAttackingEvent;
}

export interface PlayerDamageResolveEvent {
  type: "playerDamageResolve";
  initiator: PlayerDamageEvent;
}

export interface CardDamageEvent {
  type: "cardDamage";
  amount: number;
  cardPosition: number;
  isPlayerCard: boolean;
  directAttack: boolean;
  initiator: CardAttackingEvent;
}

export interface CardDamagResolveEvent {
  type: "cardDamageResolve";
  initiator: CardDamageEvent;
}

export interface CardDestroyedEvent {
  type: "cardDestroyed";
  initiator: CardDamageEvent;
}

export interface GameOverEvent {
  type: "gameOver";
  winnerIsPlayer: boolean;
}

export interface DrawCardEvent {
  type: "drawCard";
  isPlayer: boolean;
  handPosition: number;
}

export interface HealCardEvent {
  type: "healCard";
  isPlayerCard: boolean;
  cardPosition: number;
  amount: number;
  cardInitiator: {
    isPlayerCard: boolean;
    cardPosition: number;
  };
}

export interface ModifyStateValueEvent {
  type: "modifyStateValue";
  state: CardState;
  isPlayerCard: boolean;
  cardPosition: number;
  value: number;
}

export interface RemoveStateEvent {
  type: "removeState";
  stateType: CardState["type"];
  isPlayerCard: boolean;
  cardPosition: number;
}

export interface TriggerStateEvent {
  type: "triggerState";
  state: CardState;
  isPlayerCard: boolean;
  cardPosition: number;
  initiator: EventType;
}

export interface AddStateEvent {
  type: "addState";
  state: CardState;
  isPlayerCard: boolean;
  cardPosition: number;
}

export type InGameCardType = {
  id: number;
  instanceId: number;
  maxHp: number;
  hp: number;
  dmg: number;
  attackSpeed: number;
  startAttackingTick: number | null;
  rarity: CardRarity;
  states: CardState[];
  illustration: string;
  worldIllustration: string;
};