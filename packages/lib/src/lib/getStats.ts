import { baseDps, baseHp, cardCostMultiplier, cardLevelMultiplier, cardRarityMultiplier, CardStatsInfoLevel, cardWorldMultiplier, getRealStrength, getTargetStrength, speedMaxLevel1, testIsStrengthValid } from "../../../gameEngine/src/types/Card";
import { CardStat } from "../../../gameEngine/src/types/DataStoreType";

function cardStrengthMultiplier(card: CardStat, cost: number) {
  return (value: number) =>
    value *
    cardCostMultiplier ** (cost - 1) *
    cardRarityMultiplier[card.rarity] *
    cardWorldMultiplier ** (card.world - 1);
}

/**
 * Iterater to find the stats of the card
 */
export function getStats(card: CardStat, level: number): CardStatsInfoLevel {
  const attackRatio = 1 - card.attackDefenseRatio;
  const defenseRatio = card.attackDefenseRatio;
  const speedRatio = 1 - card.speedDamageRatio;
  const cost = card.stats[level - 1].cost;

  const targetStrength = getTargetStrength({
    level,
    rarity: card.rarity,
    world: card.world,
  }) * (100 + card.adjustementStrength) / 100;

  function getCurrentStats(divisor: number) {
    const multiplier = cardStrengthMultiplier(card, cost);

    const levelMultiplier = cardLevelMultiplier ** (level - 1);
    const dps = multiplier(attackRatio * baseDps * divisor * levelMultiplier);

    const speed =
      speedRatio *
      speedMaxLevel1 *
      Math.sqrt(divisor) *
      Math.sqrt(cardLevelMultiplier) ** (level - 1);
    return {
      hp: Math.floor(
        multiplier(defenseRatio * baseHp * divisor * levelMultiplier),
      ),
      attackSpeed: speed,
      dmg: Math.floor(dps / speed),
      cost: card.stats[level - 1].cost,
      states: card.stats[level - 1].states,
      illustration: card.stats[level - 1].illustration,
      level,
      rarity: card.rarity,
      world: card.world,
    };
  }

  function realStrength() {
    return getRealStrength(
      getCurrentStats(higherDivisor - (higherDivisor - lowerDivisor) / 2),
    );
  }

  let higherDivisor = 2;
  let lowerDivisor = 0;
  let iteration = 0;
  let currentStrength = realStrength();
  while (iteration < 100 && !testIsStrengthValid(currentStrength, targetStrength)) {
    if (currentStrength > targetStrength) {
      // divisor is too high so lower range
      higherDivisor -= (higherDivisor - lowerDivisor) / 2;
    } else {
      lowerDivisor += (higherDivisor - lowerDivisor) / 2;
    }
    currentStrength = realStrength();
    iteration++;
  }

  return getCurrentStats(higherDivisor - (higherDivisor - lowerDivisor) / 2);
}
