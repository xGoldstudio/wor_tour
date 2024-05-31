import { CardStatsInfoLevel, baseDps, baseHp, cardCostMultiplier, cardLevelMultiplier, cardRarityMultiplier, cardWorldMultiplier, getRealStrength, speedMaxLevel1, testIsStrengthValid } from "@/cards";
import { CardStat } from "./CardEditor";

function cardStrengthMultiplier(card: CardStat, cost: number) {
	return (value: number) =>
		value *
		cardCostMultiplier ** (cost - 1) *
		cardRarityMultiplier[card.rarity] *
		cardWorldMultiplier ** (card.world - 1);
}

export function getStats(card: CardStat, level: number): CardStatsInfoLevel {
	const attackRatio = 1 - card.attackDefenseRatio;
	const defenseRatio = card.attackDefenseRatio;
	const speedRatio = 1 - card.speedDamageRatio;
	const cost = card.stats[level - 1].cost;

	const values = getCurrentStats(1);
	const score = getRealStrength({
		...values,
		cost: card.stats[level - 1].cost,
		effects: {},
	});

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
			hp:Math.floor(multiplier(defenseRatio * baseHp * divisor * levelMultiplier)),
			attackSpeed: speed,
			dmg: Math.floor(dps / speed),
			cost: card.stats[level - 1].cost,
			effects: card.stats[level - 1].effects,
			illustration: card.stats[level - 1].illustration,
		};
	}

	function realStrength() {
		return getRealStrength(getCurrentStats(higherDivisor - (higherDivisor - lowerDivisor) / 2));
	}

	let higherDivisor = 1;
	let lowerDivisor = Object.keys(card.stats[level - 1].effects).length ? 0 : 1; // if we have an effect
	let iteration = 0;
	let currentStrength = realStrength();
	while (iteration < 100 && !testIsStrengthValid(currentStrength, score)) {
		if (currentStrength > score) {
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