import { CardState, CardStatesData } from "../data/gameEngine/CardStatesData";
import { StatusEffectType, TargetCardState, TriggerCardState } from "../types/DataStoreType";

export interface CardStateLayoutData {
  src: string;
  amount: number | null;
  status: StatusEffectType;
  title: string;
  description: string;
}

export function getImageEffects(states: CardState[]): CardStateLayoutData[] {
  return states.map((state) => {
    const desc = CardStatesData[state.type];
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
  onDirectAttack: "When this card directly attacks",
  onDirectlyAttacked: "When this card is directly attacked",
  onAttack: "When this card attacks",
  onDamage: "When this card takes damage",
  onPlacement: "When this card is placed on the board",
  onDeath: "When this card dies",
  onHeal: "When this card is healed",
  onKill: "When this card kills another card",
};
