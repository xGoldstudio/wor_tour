import {
  CardStatsInfo,
  CardType,
  getRealStrength,
  getTargetStrength,
  testIsStrengthValid,
} from "../../../../packages/gameEngine/src/types/Card";
import useDataStore from "./DataStore";

export function findCard(id: number, level: number): CardType {
  if (id === 0) return getCardEmpty();
  const cards = useDataStore.getState().cards;
  const card = cards.find((card) => card.id === id) || cards[0];
  return getCardFromLevel(card, level);
}

export function getCardEmpty(): CardType {
  return {
    name: "",
    cost: 0,
    illustration: "",
    worldIllustration: "",
    dmg: 0,
    hp: 0,
    attackSpeed: 0,
    rarity: "common",
    id: 0,
    states: [],
    level: 1,
    world: 0,
    isPvp: false,
  };
}

export function getCardStats(id: number): CardStatsInfo {
  const cards = useDataStore.getState().cards;
  return cards.find((card) => card.id === id) || cards[0];
}

export function getCardFromLevel(card: CardStatsInfo, level: number): CardType {
  const levelIndex = level - 1;

  return {
    name: card.name,
    cost: card.stats[levelIndex].cost,
    illustration: card.stats[levelIndex].illustration || "",
    worldIllustration:
      useDataStore.getState().getWorld(card.world)?.cardBackground || "",
    dmg: card.stats[levelIndex].dmg,
    hp: card.stats[levelIndex].hp,
    attackSpeed: card.stats[levelIndex].attackSpeed,
    rarity: card.rarity,
    id: card.id,
    states: card.stats[levelIndex].states,
    level: level,
    world: card.world,
    isPvp: card.stats[levelIndex].isPvp,
  };
}

export function isLevelValid(cardId: number, level: number): boolean {
  const card = findCard(cardId, level);
  const statsLevel = getRealStrength(card, false);
  return testIsStrengthValid(statsLevel, getTargetStrength(card));
}
