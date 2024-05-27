import { CardEffects } from "@/cards";

export const effectsImages: Partial<Record<keyof CardEffects, string>> = {
  fightBack: "fightback.svg",
  multiAttack: "multiAttack.svg",
};

export default function getImageEffects(effects: CardEffects) {
  const effectToShow = [];

  for (const effect in effects) {
    const existingImage = effectsImages[effect as keyof CardEffects];
    existingImage &&
      effects[effect as keyof CardEffects] &&
      effectToShow.push(existingImage);
  }

  return effectToShow;
}
