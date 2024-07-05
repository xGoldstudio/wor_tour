import { CardEffects } from "@repo/types";

export const effectsImages: Partial<Record<keyof CardEffects, string>> = {
  fightBack: "sword.png",
  multiAttack: "fightback.png",
  placementHeal: "heart.png",
};

export function getImageEffects(effects: CardEffects) {
  const effectToShow = [];

  for (const effect in effects) {
    const existingImage = effectsImages[effect as keyof CardEffects];
    existingImage &&
      effects[effect as keyof CardEffects] &&
      effectToShow.push(existingImage);
  }

  return effectToShow;
}
