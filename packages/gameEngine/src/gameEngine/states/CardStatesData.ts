import DummyStateAction from './stateActions/dummy';
import HealStateAction from './stateActions/heal';
import RiposteStateAction from './stateActions/riposte';
import MultiAttackStateAction from './stateActions/multiAttack';
import MassacreStateAction from './stateActions/massacre';
import BleedingStateAction from './stateActions/bleeding';
import { AddStateEvent, EventType, InGameCardType, TriggerStateEvent } from '../../types/eventType';
import { ClockReturn } from '../clock/clock';
import { GameStateObject } from '../gameEngine/gameState';
import { StatusEffectType, TargetCardState, TriggerCardState } from '../../types/DataStoreType';
import { baseDps } from '../../types/Card';
import CloningStateAction from './stateActions/cloning';
import RushStateAction from './stateActions/rush';
import BannerOfCommandStateAction from './stateActions/bannerOfCommand';
import { FRAME_TIME } from '../gameEngine/gameEngine';

export type StateAction = ({ trigger, target, value, clock, gameState, event }: {
  card: InGameCardType,
  trigger: TriggerCardState,
  target: TargetCardState,
  value: number | null,
  clock: ClockReturn<EventType>,
  gameState: GameStateObject,
  event: TriggerStateEvent,
}) => void;

export type AddedStateAction = ({ card, clock, gameState, event }: {
  card: InGameCardType,
  clock: ClockReturn<EventType>,
  gameState: GameStateObject,
  event: AddStateEvent,
}) => void;

export type RemovedStateAction = ({ card, clock, gameState, event }: {
  card: InGameCardType,
  clock: ClockReturn<EventType>,
  gameState: GameStateObject,
  event: RemovedStateAction,
}) => void;

interface CardStateDataOptions {
  consume?: number;
  stackable?: boolean;
  decay?: number;
  stackableStrategy?: "sum" | "max";
}

interface CardStateDataInterface {
  min: number | undefined;
  max: number | undefined;
  noValue: boolean;
  triggers: TriggerCardState[];
  targets: TargetCardState[];
  computeCost: ({
    dmg,
    dps,
    hp,
    trigger,
    target,
    value,
    attackSpeed,
  }: {
    dmg: number;
    dps: number;
    hp: number;
    trigger: TriggerCardState;
    target: TargetCardState;
    value: number | null;
    attackSpeed: number;
  }) => number;
  descrption: ({ trigger, target, value }: { trigger: string, target: string, value: string }) => string; title: string;
  status: StatusEffectType;
  src: string;
  action: StateAction;
  options: CardStateDataOptions;
  onAdded?: AddedStateAction;
  onRemoved?: RemovedStateAction;
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
    options: {},
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
  heal: {
    min: 0,
    max: undefined,
    noValue: false,
    triggers: ["onPlacement"],
    targets: ["allyCards"],
    computeCost: ({ value, trigger, target }) => {
      let triggerRatio = 0;
      let targetRatio = 0;
      if (trigger === "onPlacement") triggerRatio = 1;
      if (target === "allyCards") targetRatio = 1;
      return ((value || 0) / (baseDps * 3)) * triggerRatio * targetRatio;
    },
    descrption: ({ trigger, target, value }) => `${trigger}, heal ${target} for ${value} health points.`,
    title: "Heal",
    status: "buff",
    src: "heal.png",
    action: HealStateAction,
    options: {},
  },
  riposte: {
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
  multiAttack: {
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
      return ((value || 0) * (attackSpeed * 4)) / 7;
    },
    descrption: ({ trigger, target, value }) => `${trigger}, give bleeding ${value} to ${target}.`,
    title: "Massacre",
    status: "buff",
    src: "massacre.png",
    action: MassacreStateAction,
    options: {},
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
  clone: {
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
    action: CloningStateAction,
    options: {
      stackable: true,
    },
  },
  rush: {
    min: undefined,
    max: undefined,
    noValue: true,
    triggers: ["onPlacement"],
    targets: ["allyCards"],
    computeCost: () => {
      return 0.2;
    },
    descrption: ({ trigger, target }) => `${trigger}, ${target} will attack directly the ennemy card in front of him.`,
    title: "Rush",
    status: "neutral",
    src: "rush.png",
    action: RushStateAction,
    options: {},
  },
  bannerOfComand: {
    min: 1,
    max: undefined,
    noValue: false,
    triggers: ["onPlacement"],
    targets: ["allyCards"],
    computeCost: ({ value }) => {
      return 0.05 * (value || 0);
    },
    status: "buff",
    descrption: ({ trigger, target, value }) => `${trigger}, ${target} will gain ${value}% attack speed.`,
    title: "Banner of Command",
    src: "bannerOfCommand.png",
    action: BannerOfCommandStateAction,
    options: {},
  },
  rage: {
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
    onAdded: () => {},
    onRemoved: () => {},
    options: {
      decay: (1000 / FRAME_TIME) * 5,
      stackable: true,
      stackableStrategy: "max",
    }
  }
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