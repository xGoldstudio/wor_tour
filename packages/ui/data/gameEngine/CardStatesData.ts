import { EventType } from '../../../../apps/GameClient/src/game/gameBehavior/useGameEvents';
import { ClockReturn } from '../../../../apps/GameClient/src/game/gameBehavior/clock/clock';
import { baseDps } from '@repo/ui';
import { GameStateObject } from '../../../../apps/GameClient/src/game/gameBehavior/gameEngine/gameState';
import DummyStateAction from './stateActions/dummy';
import HealStateAction from './stateActions/heal';
import RiposteStateAction from './stateActions/riposte';
import MultiAttackStateAction from './stateActions/multiAttack';
import MassacreStateAction from './stateActions/massacre';
import BleedingStateAction from './stateActions/bleeding';
import { StatusEffectType, TargetCardState, TriggerCardState } from '../../types/DataStoreType';

export type StateAction = ({ trigger, target, value, clock, state, event }: { trigger: TriggerCardState, target: TargetCardState, value: number | null, clock: ClockReturn<EventType>, state: GameStateObject, event: EventType }) => void;

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
}

export const CardStatesData = {
  dummy: { // using for testing
    min: 0,
    max: undefined,
    noValue: false,
    triggers: ["onDeath", "onPlacement", "onAttack", "onDirectAttack", "onDirectlyAttacked"],
    targets: ["selfCard"],
    computeCost: () => {
      return 0;
    },
    descrption: ({ trigger, target }) => `${trigger}, ${target} is a dummy state.`,
    title: "Dummy",
    status: "neutral",
    src: "",
    action: DummyStateAction,
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
    src: "states/heal.png",
    action: HealStateAction,
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
    src: "states/riposte.png",
    action: RiposteStateAction
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
    src: "states/multiAttack.png",
    action: MultiAttackStateAction,
  },
  massacre: {
    min: 0,
    max: undefined,
    noValue: false,
    triggers: ["onDirectAttack"],
    targets: ["directEnnemyCard"],
    computeCost: ({ value, attackSpeed }) => {
      return ((value || 0) * (attackSpeed * 1.5)) / 20;
    },
    descrption: ({ trigger, target, value }) => `${trigger}, give bleeding ${value} to ${target}.`,
    title: "Massacre",
    status: "buff",
    src: "states/massacre.png",
    action: MassacreStateAction,
  },
  bleeding: {
    min: 0,
    max: undefined,
    noValue: false,
    triggers: ["onAttack"],
    targets: ["selfCard"],
    computeCost: () => {
      return 0;
    },
    descrption: ({ trigger, target, value }) => `${trigger}, inflict ${value} damage to ${target}.`,
    title: "Bleeding",
    status: "debuff",
    src: "states/bleeding.png",
    action: BleedingStateAction,
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

export type TriggersOf<K extends keyof CardStateTypeof> = CardStateTypeof[K]['triggers'][number];
export type TargetsOf<K extends keyof CardStateTypeof> = CardStateTypeof[K]['targets'][number];
export type ValueOf<K extends keyof CardStateTypeof> = CardStateTypeof[K]['noValue'] extends true ? null : number;