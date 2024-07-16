import { CardState, StatusEffectType, TargetCardState, TriggerCardState } from "@repo/types";

export const effectsDescription:
  Record<
    string,
    { descrption: ({ trigger, target }: { trigger: string, target: string, value: string }) => string, title: string, status: StatusEffectType, src: string }
  > = {
  riposte: {
    descrption: ({ trigger, target }) => `${trigger}, instantly attack the ${target}.`,
    title: "Riposte",
    status: "neutral",
    src: "states/riposte.png",
  },
  multiAttack: {
    descrption: ({ trigger, target }) => `${trigger}, also attack ${target} with the normal damage.`,
    title: "Multi Attack",
    status: "neutral",
    src: "states/multiAttack.png",
  },
  heal: {
    descrption: ({ trigger, target, value }) => `${trigger}, heal ${target} for ${value} health points.`,
    title: "Heal",
    status: "buff",
    src: "states/heal.png",
  },
  massacre: {
    descrption: ({ trigger, target, value }) => `${trigger}, give bleeding ${value} to ${target}.`,
    title: "Massacre",
    status: "buff",
    src: "states/massacre.png",
  },
  bleeding: {
    descrption: ({ trigger, target, value }) => `${trigger}, inflict ${value} damage to ${target}.`,
    title: "Bleeding",
    status: "debuff",
    src: "states/bleeding.png",
  },
};

export interface CardStateLayoutData {
  src: string;
  amount: number | null;
  status: StatusEffectType;
  title: string;
  description: string;
}

export function getImageEffects(states: CardState[]): CardStateLayoutData[] {
  return states.map((state) => {
    const desc = effectsDescription[state.type]!;
    return {
      src: desc.src,
      amount: state.value,
      status: desc.status,
      title: desc.title,
      description: desc.descrption({
        trigger: triggerLabels[state.trigger],
        target: targetLabels[state.target],
        value: String(state.value),
      }),
    };
  });
}

export const targetLabels: Record<TargetCardState, string> = {
  selfCard: "this card",
  directEnnemyCard: "the direct enemy card if exist",
  enemyCards: "all the ennemy cards",
  allyCards: "all your cards",
  allCards: "all the cards",
  player: "yourself",
  opponent: "your opponent",
  notSpecified: "not specified",
  otherEnnemyCards: "all the ennemy cards except the direct opponent",
};

export const triggerLabels: Record<TriggerCardState, string> = {
  idle: "never",
  onDirectlyAttacked: "When this card is directly attacked",
  onAttack: "When this card attacks",
  onDamage: "When this card takes damage",
  onPlacement: "When this card is placed on the board",
  onDeath: "When this card dies",
  onHeal: "When this card is healed",
  onKill: "When this card kills another card",
};
