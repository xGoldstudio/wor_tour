import { CardEffects, CardRarity } from "@repo/types";
import useDataStore from "./DataStore";

export type CardType = {
  name: string;
  cost: number;
  illustration: string;
  worldIllustration: string;
  dmg: number;
  hp: number;
  attackSpeed: number;
  rarity: CardRarity;
  id: number;
  effects: CardEffects;
  level: number;
  world: number;
};

export const CardRarityOrder: CardRarity[] = [
  "common",
  "rare",
  "epic",
  "legendary",
];

export interface CardStatsInfo {
  name: string;
  rarity: CardRarity;
  id: number;
  world: number;
  stats: [CardStatsInfoLevel, CardStatsInfoLevel, CardStatsInfoLevel];
}

export interface CardStatsInfoLevel {
  cost: number;
  dmg: number;
  hp: number;
  attackSpeed: number;
  illustration: string | null;
  effects: CardEffects;
}

export function findCard(id: number, level: number): CardType {
  const cards = useDataStore.getState().cards;
  const card = cards.find((card) => card.id === id) || cards[0];
  return getCardFromLevel(card, level);
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
    worldIllustration: useDataStore.getState().getWorld(card.world)?.cardBackground || "",
    dmg: card.stats[levelIndex].dmg,
    hp: card.stats[levelIndex].hp,
    attackSpeed: card.stats[levelIndex].attackSpeed,
    rarity: card.rarity,
    id: card.id,
    effects: card.stats[levelIndex].effects,
    level: level,
    world: card.world,
  };
}

export function isLevelValid(cardId: number, level: number): boolean {
  const card = findCard(cardId, level);
  const statsLevel = getRealStrength(card);
  return testIsStrengthValid(statsLevel, getTargetStrength(card));
}

export function testIsStrengthValid(
  statsLevel: number,
  targetStats: number,
): boolean {
  return Math.abs(statsLevel - targetStats) < maxDelta;
}

export function getTargetStrength(card: {
  level: number;
  rarity: CardRarity;
  world: number;
}) {
  const targetStrength = getCardStrength(card);
  return baseStats * targetStrength;
}

const baseStats = 1;
export const maxDelta = 0.0001;
const survavibilityRatio = 3;
export const baseHp = 100; // card of level 1, rarity common, world 1
export const baseDps = baseHp / survavibilityRatio;
export const cardLevelMultiplier = 1.5;
export const cardWorldMultiplier = 1.2;
export const cardCostMultiplier = 1.3;
export const speedMaxLevel1 = 2;
export const cardRarityMultiplier = {
  common: 1,
  rare: 1.1,
  epic: 1.2,
  legendary: 1.5,
};

// score is the sum of the stats
// 4 hp = 1s
// 1 dps = 1s
export function getRealStrength(card: {
  hp: number;
  dmg: number;
  attackSpeed: number;
  cost: number;
  effects: CardEffects;
}): number {
  function fightBack(score: number) {
    return score + (card.effects.fightBack ? dmg * 0.5 : 0);
  }

  function multiAttack(score: number) {
    return score + (card.effects.multiAttack ? dps * 0.2 : 0);
  }

  function healPlacement(score: number) {
    return (
      score +
      (card.effects.placementHeal
        ? card.effects.placementHeal.amount / baseHp
        : 0)
    );
  }

  const dmg = card.dmg / Math.sqrt(baseDps) / Math.sqrt(baseDps);
  const speed = card.attackSpeed;
  const dps = dmg * speed;

  const costDivisor = cardCostMultiplier ** (card.cost - 1); // to normalize the strength no matter the cost

  return (
    healPlacement(multiAttack(fightBack(card.hp / baseHp + dps))) / costDivisor
  );
}

export function getCardStrength(card: {
  level: number;
  rarity: CardRarity;
  world: number;
}) {
  return (
    1 *
    cardLevelMultiplier ** (card.level - 1) *
    cardRarityMultiplier[card.rarity] *
    cardWorldMultiplier ** (card.world - 1)
  );
}
