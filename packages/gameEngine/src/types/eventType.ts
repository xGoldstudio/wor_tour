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
  | BeforeCardDestroyedEvent
  | PlayerDamageEvent
  | CardDamageEvent
  | CardDestroyedEvent
  | GameOverEvent
  | DrawCardEvent
  | HealCardEvent
  | CardDamagResolveEvent
  | BeforeCardDamageResolveEvent
  | PlayerDamageResolveEvent
  | IncreaseStateValueEvent
  | DecreaseStateValueEvent
  | RemoveStateEvent
  | TriggerStateEvent
  | AddStateEvent
  | ShuffleDeckEvent
  | TimerDecreaseEvent
  | ChangeAttackSpeedEvent
  | StartStateDecayEvent
  | EndStateDecayEvent
  | AfterPlaceCardEvent
  | StateLifcycleOnAddEvent
  | StateLifcycleOnRemoveEvent
  | BeforeRemoveStateEvent
  | StateLifcycleOnChangeValueEvent
  | AfterStatePlaceCardEvent
  | CardStartAttackingAnimationEvent
  | CardEndAttackingAnimationEvent
  | AddDeckCardStateEvent
  | PlayerPlaceCardEvent
  | IncreaseDeckCardStateValueEvent
  | DecreaseDeckCardStateValueEvent
  | RemoveDeckCardStateEvent;

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

export type PlaceCardType = Omit<InGameCardType, "instanceId" | "modifierOfAttackSpeedPercentage" | "attackSpeed" | "startAttackingTick" | "endAttackingTick" | "hp" | "startAttackingAnimationTick">;

export interface PlaceCardEvent {
  type: "placeCard";
  isPlayer: boolean;
  position: number;
  card: PlaceCardType;
  isSpecialPlacement: boolean;
}

export interface AfterPlaceCardEvent {
  type: "afterPlaceCard";
  isPlayer: boolean;
  position: number;
  card: PlaceCardType;
  isSpecialPlacement: boolean;
}

export interface AfterStatePlaceCardEvent {
  type: "afterStatePlaceCard";
  instanceId: number;
}

export interface NormalPlaceCardEvent {
  type: "normalPlaceCard";
  isPlayer: boolean;
  position: number;
  instanceId: number;
}

export interface PlayerPlaceCardEvent {
  type: "playerPlaceCard";
  isPlayer: boolean;
  position: number;
  instanceId: number;
}

export interface CardStartAttackingEvent {
  type: "cardStartAttacking";
  instanceId: number;
  alreadyProcessing?: number;
}

export interface CardStartAttackingAnimationEvent {
  type: "cardStartAttackingAnimation";
  instanceId: number;
  animationDuration: number;
  progressFrame: number;
}

export interface CardEndAttackingAnimationEvent {
  type: "cardEndAttackingAnimation";
  instanceId: number;
}

export interface CardAttackingEvent {
  type: "cardAttacking";
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
  onDirectHitStates: CardState[];
  cardInitiator: InGameCardType; // this card may already be destroyed, if you need to verify its existance use instanceId
}

export interface CardDamagResolveEvent {
  type: "cardDamageResolve";
  damage: number;
  initiator: CardDamageEvent;
}

export interface BeforeCardDamageResolveEvent {
  type: "beforeCardDamageResolve";
  initiator: CardDamageEvent;
}

export interface BeforeCardDestroyedEvent {
  type: "beforeCardDestroyed";
  instanceId: number;
}

export interface CardDestroyedEvent {
  type: "cardDestroyed";
  instanceId: number;
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
  amount: number;
  instanceId: number;
  cardInitiatorInstanceId: number;
}

export interface IncreaseStateValueEvent {
  type: "increaseStateValue";
  stateType: CardState["type"];
  increaseBy: number;
  instanceId: number;
}

export interface DecreaseStateValueEvent {
  type: "decreaseStateValue";
  stateType: CardState["type"];
  instanceId: number;
  decreaseBy: number;
}

export interface RemoveStateEvent {
  type: "removeState";
  stateType: CardState["type"];
  instanceId: number;
}

export interface TriggerStateEvent {
  type: "triggerState";
  state: CardState;
  initiator: EventType;
  instanceId: number;
  cardInitiator: InGameCardType; // this card may alteady be destroyed, if you need to verify its existance use instanceId
}

export interface AddStateEvent {
  type: "addState";
  state: CardState;
  instanceId: number;
}

export interface ShuffleDeckEvent {
  type: "shuffleDeck";
  isPlayer: boolean;
}

export interface TimerDecreaseEvent {
  type: "timerDecrease";
}

export interface ChangeAttackSpeedEvent {
  type: "changeAttackSpeed";
  instanceId: number;
  changePercent: number;
}

export interface StartStateDecayEvent {
  type: "startStateDecay";
  stateType: CardState["type"];
  instanceId: number;
  duration: number;
}

export interface EndStateDecayEvent {
  type: "endStateDecay";
  stateType: CardState["type"];
  instanceId: number;
}

export interface StateLifcycleOnAddEvent {
  type: "stateLifecycleOnAdd";
  stateType: CardState["type"];
  instanceId: number;
  state: CardState;
}

export interface StateLifcycleOnChangeValueEvent {
  type: "stateLifecycleOnChangeValue";
  stateType: CardState["type"];
  instanceId: number;
  delta: number;
}

export interface BeforeRemoveStateEvent {
  type: "beforeRemoveState";
  stateType: CardState["type"];
  instanceId: number;
}

export interface StateLifcycleOnRemoveEvent {
  type: "stateLifecycleOnRemove";
  stateType: CardState["type"];
  instanceId: number;
}

export interface AddDeckCardStateEvent {
  type: "addDeckCardState";
  instanceId: number;
  state: CardState;
}

export interface IncreaseDeckCardStateValueEvent {
  type: "increaseDeckCardStateValue";
  stateType: CardState["type"];
  increaseBy: number;
  instanceId: number;
}

export interface DecreaseDeckCardStateValueEvent {
  type: "decreaseDeckCardStateValue";
  stateType: CardState["type"];
  decreaseBy: number;
  instanceId: number;
}

export interface RemoveDeckCardStateEvent {
  type: "removeDeckCardState";
  stateType: CardState["type"];
  instanceId: number;
}

export type InGameCardType = {
  id: number;
  instanceId: number;
  maxHp: number;
  hp: number;
  dmg: number;
  attackSpeed: number;
  initialAttackSpeed: number;
  modifierOfAttackSpeedPercentage: number;
  startAttackingTick: number | null;
  startAttackingAnimationTick: number | null;
  endAttackingTick: number | null;
  rarity: CardRarity;
  states: CardState[];
  illustration: string;
  worldIllustration: string;
  initiatorId: number;
};
