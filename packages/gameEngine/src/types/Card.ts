import { CardRarity } from "./DataStoreType";
import { CardState, CardStatesData } from "../gameEngine/states/CardStatesData";
import { roundToTwoMath } from "@repo/lib";

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
  level: number;
  world: number;
  isPvp: boolean;
  states: CardState[];
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
  isPvp: boolean;
  states: CardState[];
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
}, isPvp?: boolean) {
  const targetStrength = getCardStrength(card, isPvp);
  return roundToTwoMath(baseStats * targetStrength);
}

export function getAbsoluteTargetStrength(card: {
  level: number;
  rarity: CardRarity;
  world: number;
  cost: number;
}, isPvp?: boolean) {
  return getTargetStrength(card, isPvp) * (cardCostMultiplier ** (card.cost - 1));
}

const baseStats = 1;
export const maxDelta = 0.01;
const survavibilityRatio = 7;
export const baseHp = 100; // card of level 1, rarity common, world 1
export const baseDps = baseHp / survavibilityRatio;
export const cardLevelMultiplier = 1.4;
export const cardWorldMultiplier = 1.2;
export const cardCostMultiplier = 1.30;
export const speedMaxLevel1 = 0.8;
export const cardRarityMultiplier = {
  common: 1,
  rare: 1.1,
  epic: 1.2,
  legendary: 1.4,
};

// score is the sum of the stats
// 4 hp = 1s
// 1 dps = 1s
export function getRealStrength(card: {
  hp: number;
  dmg: number;
  attackSpeed: number;
  cost: number;
  level: number;
  world: number;
  rarity: CardRarity;
  states: CardState[];
}, isPvp: boolean): number {
  const costDivisor = cardCostMultiplier ** (card.cost - 1); // to normalize the strength no matter the cost

  const statCost = getStatsStrength({ hp: card.hp, dmg: card.dmg, attackSpeed: card.attackSpeed, cost: card.cost });

  const targetCost = getAbsoluteTargetStrength({
    level: card.level,
    rarity: card.rarity,
    world: card.world,
    cost: card.cost,
  }, isPvp);

  const stateCosts = computeCosts(card.states, card, statCost, targetCost);
  
  return (statCost + stateCosts) / costDivisor;
}

export function getStatsStrength(card: { hp: number; dmg: number; attackSpeed: number, cost: number }) {
  const dmg = card.dmg / Math.sqrt(baseDps) / Math.sqrt(baseDps);
  const speed = card.attackSpeed;
  const dps = dmg * speed;

  return (card.hp / baseHp + dps);
}

function computeCosts(states: CardState[], stats: { hp: number; dmg: number; attackSpeed: number }, statCost: number, targetCost: number ) {
  let total = 0;
  
  states.forEach((state) => {
    const cost = CardStatesData[state.type].computeCost({
      dmg: stats.dmg,
      dps: stats.dmg * stats.attackSpeed,
      hp: stats.hp,
      trigger: state.trigger,
      target: state.target,
      value: state.value,
      attackSpeed: stats.attackSpeed,
      statCost: statCost,
      targetCost: targetCost,
    });
    total += cost;
  });

  return total;
}

export const pvpStrengthByLevel = (level: number) => {
  return [5, 7.5, 10][level - 1];
}

export function getCardStrength(card: {
  level: number;
  rarity: CardRarity;
  world: number;
}, isPvp?: boolean) {
  if (isPvp) {
    return pvpStrengthByLevel(card.level);
  }
  return (
    1 *
    cardLevelMultiplier ** (card.level - 1) *
    cardRarityMultiplier[card.rarity] *
    cardWorldMultiplier ** (card.world - 1)
  );
}

export function getShardsFromLevel(level: number) {
  return level === 1 ? 3 : 7;
}