import { CardState, getOptionsFromType } from "../../../gameEngine";
import { baseDps, baseHp, cardCostMultiplier, cardLevelMultiplier, cardRarityMultiplier, CardStatsInfoLevel, cardWorldMultiplier, getRealStrength, getStatsStrength, getTargetStrength, speedMaxLevel1, testIsStrengthValid } from "../../../gameEngine/src/types/Card";
import { CardStat, CardStateInfo } from "../../../gameEngine/src/types/DataStoreType";

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

  const statesSpaceTaken = card.stats[level - 1].states.reduce(
    (acc, state) => acc + (state.costPercentage ?? 0),
    0,
  );
  const ajustedTargetStrength = getTargetStrength({
    level,
    rarity: card.rarity,
    world: card.world,
  }) * (100 + card.adjustementStrength) / 100;

  const targetStrength = ajustedTargetStrength * ((100 - statesSpaceTaken) / 100);

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

  const res = getCurrentStats(higherDivisor - (higherDivisor - lowerDivisor) / 2);
  const states = getStatesFromStatesInfo(res.states, {
    dmg: res.dmg,
    attackSpeed: res.attackSpeed,
    hp: res.hp,
  }, cost, ajustedTargetStrength);
  return {
    cost: res.cost,
    dmg: res.dmg,
    hp: res.hp,
    attackSpeed: res.attackSpeed,
    illustration: res.illustration,
    states: states,
  };
}

function getStatesFromStatesInfo(states: CardStateInfo[], stats: {
  dmg: number;
  attackSpeed: number;
  hp: number;
}, cost: number, targetStrength: number) {
  return states.map(state => {
    const options = getOptionsFromType(state.type);
    let value = state.value;
    const statCost = getStatsStrength({
      hp: stats.hp, dmg: stats.dmg, attackSpeed: stats.attackSpeed, cost
    });
    if (options.computeValueFromCost) {
      value = options.computeValueFromCost({
        dmg: stats.dmg,
        dps: stats.attackSpeed * stats.dmg,
        hp: stats.hp,
        attackSpeed: stats.attackSpeed,
        trigger: state.trigger,
        target: state.target,
        value: state.value,
        statCost: statCost,
        targetCost: targetStrength * (cardCostMultiplier ** (cost - 1)),
        costPercentage: state.costPercentage!,
      }); 
    }
    return {
      ...state,
      value: value,
    } as CardState;
  });
}