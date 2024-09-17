import DummyStateAction, { OnAddedDummyStateAction, OnChangeValueDummyStateAction, OnRemovedDummyStateAction } from './stateActions/dummy';
import HealStateAction from './stateActions/heal';
import RiposteStateAction from './stateActions/riposte';
import MultiAttackStateAction from './stateActions/multiAttack';
import MassacreStateAction from './stateActions/massacre';
import BleedingStateAction from './stateActions/bleeding';
import { BeforeCardDamageResolveEvent, EventType, InGameCardType, NormalPlaceCardEvent, PlaceCardType, StateLifcycleOnAddEvent, StateLifcycleOnChangeValueEvent, StateLifcycleOnRemoveEvent, TriggerStateEvent } from '../../types/eventType';
import { ClockReturn } from '../clock/clock';
import { GameStateObject } from '../gameEngine/gameState';
import { StatusEffectType, TargetCardState, TriggerCardState } from '../../types/DataStoreType';
import { baseDps } from '../../types/Card';
import CloneStateAction from './stateActions/clone';
import RushStateAction from './stateActions/rush';
import BannerOfCommandStateAction from './stateActions/bannerOfCommand';
import { FRAME_TIME } from '../gameEngine/gameEngine';
import { onAddedRage, onChangeValueRage, onRemovedRage } from './stateActions/rage';
import { sacredDuelistOnDamageModifier } from './stateActions/sacredDuelist';
import { divineShieldOnDamageModifier } from './stateActions/divineShield';
import { onAddedScorch, onChangeValueScorch } from './stateActions/scorch';
import FlameThrowerStateAction from './stateActions/flameThrower';
import WindShuffleStateAction from './stateActions/windShuffle';
import { BeforeNormalPlacementStateActionIteration, ITERATION_STRENGTH_MULTIPLIER, IterationStateAction } from './stateActions/iteration';

export type StateAction = ({ trigger, target, value, clock, gameState, event }: {
  card: InGameCardType,
  trigger: TriggerCardState,
  target: TargetCardState,
  value: number | null,
  clock: ClockReturn<EventType>,
  gameState: GameStateObject,
  event: TriggerStateEvent,
}) => void;

export type AddedStateAction = ({ clock, gameState, event }: {
  clock: ClockReturn<EventType>,
  gameState: GameStateObject,
  event: StateLifcycleOnAddEvent,
}) => void;

export type ChangeValueStateAction = ({ clock, gameState, event }: {
  clock: ClockReturn<EventType>,
  gameState: GameStateObject,
  event: StateLifcycleOnChangeValueEvent,
}) => void;

export type RemovedStateAction = ({ clock, gameState, event }: {
  clock: ClockReturn<EventType>,
  gameState: GameStateObject,
  event: StateLifcycleOnRemoveEvent,
}) => void;

export type AttackModifierStateAction = ({ clock, gameState, event }: {
  clock: ClockReturn<EventType>,
  gameState: GameStateObject,
  event: BeforeCardDamageResolveEvent,
}) => number;

export type BeforeNormalPlacementStateAction = ({ clock, gameState, event }: {
  clock: ClockReturn<EventType>,
  gameState: GameStateObject,
  event: NormalPlaceCardEvent,
  card: PlaceCardType,
}) => PlaceCardType;

export interface CardStateDataOptions {
  consume?: number;
  stackable?: boolean;
  decay?: number;
  stackableStrategy?: "sum" | "max";
  onAdded?: AddedStateAction;
  onRemoved?: RemovedStateAction;
  onChangeValue?: ChangeValueStateAction;
  onDamageModifier?: AttackModifierStateAction;
  onBeforeNormalPlacement?: BeforeNormalPlacementStateAction;
  computeValueFromCost?: (props: {
    dmg: number;
    dps: number;
    hp: number;
    trigger: TriggerCardState;
    target: TargetCardState;
    value: number | null;
    attackSpeed: number;
    statCost: number;
    targetCost: number;
    costPercentage: number;
  }) => number;
}

interface CardStateDataInterface {
  min: number | undefined;
  max: number | undefined;
  noValue: boolean;
  triggers: TriggerCardState[];
  targets: TargetCardState[];
  computeCost: (props: {
    dmg: number;
    dps: number;
    hp: number;
    trigger: TriggerCardState;
    target: TargetCardState;
    value: number | null;
    attackSpeed: number;
    statCost: number;
    targetCost: number;
  }) => number;
  descrption: ({ trigger, target, value }: { trigger: string, target: string, value: number | null }) => string; title: string;
  status: StatusEffectType;
  src: string;
  action: StateAction;
  options: CardStateDataOptions;
}

export const CardStatesData = {
  dummy: { // using for testing
    min: 0,
    max: undefined,
    noValue: false,
    triggers: ["idle", "onPlacement", "onAttack", "onDirectAttackHit", "onDirectlyAttacked", "onDeath"],
    targets: ["selfCard"],
    computeCost: () => {
      return 0;
    },
    descrption: ({ trigger, target }) => `${trigger}, ${target} is a dummy state.`,
    title: "Dummy",
    status: "neutral",
    src: "",
    action: DummyStateAction,
    options: {
      stackable: true,
      onAdded: OnAddedDummyStateAction,
      onRemoved: OnRemovedDummyStateAction,
      onChangeValue: OnChangeValueDummyStateAction,
    },
  },
  dummyWithDecay: { // using for testing
    min: 0,
    max: undefined,
    noValue: false,
    triggers: ["idle"],
    targets: ["selfCard"],
    computeCost: () => {
      return 0;
    },
    descrption: ({ trigger, target }) => `${trigger}, ${target} is a dummy state.`,
    title: "Dummy",
    status: "neutral",
    src: "",
    action: DummyStateAction,
    options: {
      decay: 2,
    },
  },
  dummyMaxStacking: { // using for testing
    min: 0,
    max: undefined,
    noValue: false,
    triggers: ["idle"],
    targets: ["selfCard"],
    computeCost: () => {
      return 0;
    },
    descrption: ({ trigger, target }) => `${trigger}, ${target} is a dummy state.`,
    title: "Dummy",
    status: "neutral",
    src: "",
    action: DummyStateAction,
    options: {
      stackable: true,
      stackableStrategy: "max",
    },
  },
  heal: {
    min: 0,
    max: undefined,
    noValue: false,
    triggers: ["onPlacement"],
    targets: ["allyCards"],
    computeCost: ({ value }) => {
      return (value || 0) / (baseDps * 4);
    },
    descrption: ({ trigger, target, value }) => `${trigger}, heal ${target} for ${value} health points.`,
    title: "Heal",
    status: "buff",
    src: "heal.png",
    action: HealStateAction,
    options: {
      computeValueFromCost: ({ costPercentage, targetCost }) => {
        return Math.round(
          (targetCost * (costPercentage) / 100) * baseDps * 4
        );
      },
    },
  },
  riposte: { // todo
    min: 1,
    max: undefined,
    noValue: false,
    triggers: ["onDirectlyAttacked"],
    targets: ["directEnnemyCard"],
    computeCost: ({ dmg, value }) => {
      return (dmg / baseDps * 0.15) * ((value || 1) + 0.35); // +0.5 because the first one is more expansive
    },
    descrption: ({ trigger, target }) => `${trigger}, instantly attack the ${target}.`,
    title: "Riposte",
    status: "neutral",
    src: "riposte.png",
    action: RiposteStateAction,
    options: {
      consume: 1,
      stackable: true,
    },
  },
  multiAttack: { // todo
    min: undefined,
    max: undefined,
    noValue: true,
    triggers: ["onAttack"],
    targets: ["otherEnnemyCards"],
    computeCost: ({ dps }) => {
      return (dps * 1.5) / baseDps;
    },
    descrption: ({ trigger, target }) => `${trigger}, also attack ${target} with the normal damage.`,
    title: "Multi Attack",
    status: "neutral",
    src: "multiAttack.png",
    action: MultiAttackStateAction,
    options: {},
  },
  massacre: {
    min: 0,
    max: undefined,
    noValue: false,
    triggers: ["onDirectAttackHit"],
    targets: ["directEnnemyCard"],
    computeCost: ({ value, attackSpeed }) => {
      return ((value || 0) * (attackSpeed * 2)) / 12;
    },
    descrption: ({ trigger, target, value }) => `${trigger}, give bleeding ${value} to ${target}.`,
    title: "Massacre",
    status: "buff",
    src: "massacre.png",
    action: MassacreStateAction,
    options: {
      stackable: true,
      computeValueFromCost: ({ costPercentage, targetCost, attackSpeed }) => {
        const scoreTarget = targetCost * (costPercentage) / 100;
        return Math.round(
          scoreTarget * 12 / (attackSpeed * 2)
        );
      }
    },
  },
  bleeding: {
    min: 0,
    max: undefined,
    noValue: false,
    triggers: ["onAttack"],
    targets: ["selfCard"],
    computeCost: ({ value }) => {
      return -((value || 0) * 0.035);
    },
    descrption: ({ trigger, target, value }) => `${trigger}, inflict ${value} damage to ${target}.`,
    title: "Bleeding",
    status: "debuff",
    src: "bleeding.png",
    action: BleedingStateAction,
    options: {
      stackable: true,
    },
  },
  clone: { // todo
    min: 1,
    max: undefined,
    noValue: false,
    triggers: ["onDeath"],
    targets: ["selfCard"],
    computeCost: ({ value }) => {
      return 2.5 * (value || 0);
    },
    descrption: ({ trigger, target }) => `${trigger}, clone ${target} on a random position. Cloning purge all states of a card, expect clone stacks.`,
    title: "Clone",
    status: "neutral",
    src: "clone.png",
    action: CloneStateAction,
    options: {
      stackable: true,
    },
  },
  rush: { // todo
    min: undefined,
    max: undefined,
    noValue: true,
    triggers: ["onPlacement"],
    targets: ["allyCards"],
    computeCost: () => {
      return 0.2;
    },
    descrption: ({ trigger, target }) => `${trigger}, ${target} will attack instantly.`,
    title: "Rush",
    status: "neutral",
    src: "rush.png",
    action: RushStateAction,
    options: {},
  },
  bannerOfComand: { // todo
    min: 1,
    max: undefined,
    noValue: false,
    triggers: ["onPlacement"],
    targets: ["allyCards"],
    computeCost: ({ value }) => {
      return 0.04 * (value || 0);
    },
    status: "buff",
    descrption: ({ trigger, target, value }) => `${trigger}, ${target} will gain ${value}% attack speed.`,
    title: "Banner of Command",
    src: "bannerOfCommand.png",
    action: BannerOfCommandStateAction,
    options: {},
  },
  rage: { // todo
    min: 1,
    max: undefined,
    noValue: false,
    triggers: ["idle"],
    targets: ["selfCard"],
    computeCost: ({ value }) => {
      return 0.005 * (value || 0);
    },
    status: "buff",
    descrption: ({ target, value }) => `${target} will gain ${value}% attack speed for 5s.`,
    title: "Rage",
    src: "rage.png",
    action: () => {},
    options: {
      decay: (1000 / FRAME_TIME) * 5,
      stackable: true,
      stackableStrategy: "max",
      onAdded: onAddedRage,
      onRemoved: onRemovedRage,
      onChangeValue: onChangeValueRage,
    }
  },
  sacredDuelist: { // todo
    min: undefined,
    max: undefined,
    noValue: true,
    triggers: ["idle"],
    targets: ["selfCard"],
    computeCost: () => {
      return 0.5;
    },
    status: "buff",
    descrption: ({ target }) => `${target} can only receive damage from direct attacks.`,
    title: "Sacred Duelist",
    action: () => {},
    options: {
      onDamageModifier: sacredDuelistOnDamageModifier,
    },
    src: "sacredDuelist.png",
  },
  divineShield: { // todo 
    min: 1,
    max: undefined,
    noValue: false,
    triggers: ["onDirectlyAttacked"],
    targets: ["selfCard"],
    computeCost: ({ value }) => {
      return 0.5 * (value || 0);
    },
    status: "buff",
    descrption: ({ target, value }) => `${target} will ignore the next ${value && value > 1 ? value : ""} direct attack${value && value > 1 ? "s" : ""}.`,
    title: "Divine Shield",
    action: () => {},
    options: {
      onDamageModifier: divineShieldOnDamageModifier,
      stackable: true,
      consume: 1,
    },
    src: "divineShield.png",
  },
  scorch: {
    min: 1,
    max: undefined,
    noValue: false,
    triggers: ["idle"],
    targets: ["selfCard"],
    computeCost: () => {
      return 0;
    },
    status: "debuff",
    descrption: ({ target }) => `When the value increase, deal the amount of scorch in damage to ${target}`,
    title: "Scorch",
    action: () => {},
    options: {
      stackable: true,
      onChangeValue: onChangeValueScorch,
      onAdded: onAddedScorch,
    },
    src: "scorch.png",
  },
  flameThrower: { // todo
    min: 1,
    max: undefined,
    noValue: false,
    triggers: ["onDirectAttackHit"],
    targets: ["enemyCards"],
    computeCost: ({ value, attackSpeed }) => {
      return 0.8 * (value || 0) * attackSpeed;
    },
    status: "buff",
    descrption: ({ target, value }) => `On attack, add ${value} scorch to ${target}.`,
    title: "Flame Thrower",
    action: FlameThrowerStateAction,
    options: {},
    src: "flameThrower.png",
  },
  iteration: { // todo
    min: 0,
    max: undefined,
    noValue: false,
    triggers: ["onPlacement"],
    targets: ["selfCard"],
    computeCost: (args) => {
      return args.targetCost * 0.5; // reduce strenght by 50%
    },
    descrption: ({ target, value }) => `${target} will gain ${value} power ${ITERATION_STRENGTH_MULTIPLIER} strength per stack, next time this card is placed, iteration + 1.`,
    title: "Iteration",
    status: "buff",
    src: "iteration.png",
    action: IterationStateAction,
    options: {
      stackable: true,
      onBeforeNormalPlacement: BeforeNormalPlacementStateActionIteration,
    },
  },
  windShuffle: {
    min: undefined,
    max: undefined,
    noValue: true,
    triggers: ["onPlacement"],
    targets: ["notSpecified"],
    computeCost: (args) => {
      return args.targetCost * 0.75;
    },
    descrption: ({ trigger }) => `${trigger}, shuffle all your cards from hand and deck, then draw 4 cards.`,
    title: "Wind Shuffle",
    status: "neutral",
    src: "windShuffle.png",
    action: WindShuffleStateAction,
    options: {},
  },
} satisfies Record<string, CardStateDataInterface>;

type CardStateTypeof = typeof CardStatesData;
export type CardState = {
  [K in keyof CardStateTypeof]: {
    type: K;
    value: CardStateTypeof[K]['noValue'] extends true ? null : number;
    trigger: CardStateTypeof[K]['triggers'][number];
    target: CardStateTypeof[K]['targets'][number];
  }
}[keyof CardStateTypeof];
export type CardStateShape = {
  type: keyof CardStateTypeof;
  value: number | null;
  trigger: TriggerCardState;
  target: TargetCardState;
};

export type TriggersOf<K extends keyof CardStateTypeof> = CardStateTypeof[K]['triggers'][number];
export type TargetsOf<K extends keyof CardStateTypeof> = CardStateTypeof[K]['targets'][number];
export type ValueOf<K extends keyof CardStateTypeof> = CardStateTypeof[K]['noValue'] extends true ? null : number;

export function getOptionsFromType (
  type: keyof CardStateTypeof,
): CardStateDataOptions {
  return CardStatesData[type].options;
}