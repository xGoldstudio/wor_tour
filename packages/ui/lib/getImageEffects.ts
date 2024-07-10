import { CardEffects, StatusEffectType } from "@repo/types";

export const effectsImages: Partial<Record<keyof CardEffects, string>> = {
  fightBack: "sword.png",
  multiAttack: "fightback.png",
  placementHeal: "heart.png",
};

export const effectsDescription: Partial<Record<keyof CardEffects, { descrption: string, title: string, status: StatusEffectType }>> = {
  fightBack: {
    descrption: "This card will trigger an additional attack the first time it receive a direct attack.",
    title: "Fight Back",
    status: "neutral",
  },
  multiAttack: {
    descrption: "This card will attack all ennemies on each attack.",
    title: "Multi Attack",
    status: "neutral",
  },
  placementHeal: {
    descrption: "This card will heal all you cards by the amount when entering the board.",
    title: "Placement Heal",
    status: "buff",
  },
};

export interface EffectLayoutData {
  src: string;
  amount: number | null;
  status: StatusEffectType;
  title: string;
  description: string;
}

export function getImageEffects(effects: CardEffects) {
  const effectToShow: EffectLayoutData[] = [];

  for (const effect in effects) {
    const existingImage = effectsImages[effect as keyof CardEffects];
    const desc = effectsDescription[effect as keyof CardEffects]!;
    const effectValue = effects[effect as keyof CardEffects];
    existingImage && effectValue &&
      effectToShow.push({
        src: existingImage,
        amount: effectValue.amount,
        status: desc.status,
        title: desc.title,
        description: desc.descrption,
      });
  }

  return effectToShow;
}
aa
