import { CurrentWinner } from "../gameEngine/gameEngine/gameState";
import { CardState } from "../gameEngine/states/CardStatesData";
import { CardRarity } from "./DataStoreType";

export type EventType =
  | DummyEvent
  | StartGameSequence
  | StartGameEvent
  | ManaIncreaseEvent
  | SetManaIncreaseSpeed
  | ManaConsumeEvent
  | PlaceCardEvent
  | NormalPlaceCardEvent
  | StartEarningManaEvent
  | EndEarningManaEvent
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
  | IncreaseStateValueEvent
  | DecreaseStateValueEvent
  | RemoveStateEvent
  | TriggerStateEvent
  | AddStateEvent
  | ShuffleDeckEvent
  | TimerDecreaseEvent;

export interface DummyEvent { // this event should be ignored
  type: "dummyEvent";
}

export interface StartGameSequence {
  type: "startGameSequence";
}

export interface StartGameEvent {
  type: "startGame";
}

export interface ManaConsumeEvent {
  type: "manaConsume";
  isPlayer: boolean;
  delta: number;
}

export interface StartEarningManaEvent {
  type: "startEarningMana";
  isPlayer: boolean;
}

export interface EndEarningManaEvent {
  type: "endEarningMana";
  isPlayer: boolean;
  startEarningManaFrame: number;
}

export interface SetManaIncreaseSpeed {
  type: "setManaIncreaseSpeed";
  isPlayer: boolean;
  speed: number;
}

export interface ManaIncreaseEvent {
  type: "manaIncrease";
  isPlayer: boolean;
  value: number;
}

export type PlaceCardType = Omit<InGameCardType, "instanceId">;

export interface PlaceCardEvent {
  type: "placeCard";
  isPlayer: boolean;
  position: number;
  card: PlaceCardType;
  isSpecialPlacement: boolean;
}

export interface NormalPlaceCardEvent {
  type: "normalPlaceCard";
  isPlayer: boolean;
  position: number;
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
  cardIniator: InGameCardType; // this card may alteady be destroyed, if you need to verify its existance use instanceId
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
  instanceId: number;
  directAttack: boolean;
  initiator: CardAttackingEvent;
  isPlayerCard: boolean;
  cardPosition: number;
  onDirectHitStates: CardState[];
  cardInitiator: InGameCardType; // this card may alteady be destroyed, if you need to verify its existance use instanceId
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
  winner: CurrentWinner;
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

export interface IncreaseStateValueEvent {
  type: "increaseStateValue";
  stateType: CardState["type"];
  increaseBy: number;
  instanceId: number;
  isPlayerCard: boolean;
  position: number;
}

export interface DecreaseStateValueEvent {
  type: "decreaseStateValue";
  stateType: CardState["type"];
  instanceId: number;
  decreaseBy: number;
  isPlayerCard: boolean;
  position: number;
}

export interface RemoveStateEvent {
  type: "removeState";
  stateType: CardState["type"];
  instanceId: number;
  isPlayerCard: boolean;
  position: number;
}

export interface TriggerStateEvent {
  type: "triggerState";
  state: CardState;
  initiator: EventType;
  instanceId: number;
  isPlayerCard: boolean;
  position: number;
  cardInitiator: InGameCardType; // this card may alteady be destroyed, if you need to verify its existance use instanceId
}

export interface AddStateEvent {
  type: "addState";
  state: CardState;
  instanceId: number;
  isPlayerCard: boolean;
  position: number;
}

export interface ShuffleDeckEvent {
  type: "shuffleDeck";
  isPlayer: boolean;
}

export interface TimerDecreaseEvent {
  type: "timerDecrease";
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
