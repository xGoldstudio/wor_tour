import { StateCardState, TargetCardState, TriggerCardState } from '@repo/types';
import { baseDps } from '@repo/ui';
export const CardStatesData: Record<
  StateCardState,
  {
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
    }: {
      dmg: number;
      dps: number;
      hp: number;
      trigger: TriggerCardState;
      target: TargetCardState;
      value: number | null;
    }) => number;
  }
> = {
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
  },
  riposte: {
    min: 1,
    max: undefined,
    noValue: false,
    triggers: ["onDamage"],
    targets: ["notSpecified"],
    computeCost: ({ dmg, value }) => {
      return (dmg / baseDps * 0.15) * ((value || 1) + 0.35); // +0.5 because the first one is more expansive
    },
  },
  multiAttack: {
    min: undefined,
    max: undefined,
    noValue: true,
    triggers: ["onAttack"],
    targets: ["notSpecified"],
    computeCost: ({ dps }) => {
      return (dps * 1.5) / baseDps;
    },
  },
};