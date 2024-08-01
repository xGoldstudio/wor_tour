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
}) {
  const targetStrength = getCardStrength(card);
  return roundToTwoMath(baseStats * targetStrength);
}

const baseStats = 1;
export const maxDelta = 0.0001;
const survavibilityRatio = 7;
export const baseHp = 100; // card of level 1, rarity common, world 1
export const baseDps = baseHp / survavibilityRatio;
export const cardLevelMultiplier = 1.5;
export const cardWorldMultiplier = 1.2;
export const cardCostMultiplier = 1.35;
export const speedMaxLevel1 = 0.8;
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
  states: CardState[];
}): number {
  const dmg = card.dmg / Math.sqrt(baseDps) / Math.sqrt(baseDps);
  const speed = card.attackSpeed;
  const dps = dmg * speed;

  const stateCosts = computeCosts(card.states, card);
  const costDivisor = cardCostMultiplier ** (card.cost - 1); // to normalize the strength no matter the cost
  return (
    ((card.hp / baseHp + dps) + stateCosts) / costDivisor
  );
}

function computeCosts(states: CardState[], stats: { hp: number; dmg: number; attackSpeed: number }) {
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
    });
    total += cost;
  });

  return total;
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

export function getShardsFromLevel(level: number) {
  return level === 1 ? 3 : 7;
}