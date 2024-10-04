import { BoosterTypeDeclartion, CardRarity } from "game_engine";
import * as _ from "lodash";
import { numberOfLevels } from "../lib/utils";
import { WORLD_GOLD_RATIO } from "./const";
function ceilToValue(ceil: number) {
	return (v: number) => Math.ceil(v / ceil) * ceil;
}
const baseCost = 1000;
const ordinals = ["first", "second", "third", "fourth", "fifth"];
const upgradedBoosters = [
	{ name: "super", luck: 20, cost: baseCost * 1.5, purchaseDelayInMs: 3 * 60 * 60 * 1000 },
	{ name: "mega", luck: 40, cost: ceilToFiveHundreds(baseCost * (2 ** 1.15)), purchaseDelayInMs: 6 * 60 * 60 * 1000 },
	{ name: "giga", luck: 60, cost: ceilToFiveHundreds(baseCost * (3 ** 1.15)), purchaseDelayInMs: 12 * 60 * 60 * 1000 },
	{ name: "ultra", luck: 80, cost: ceilToFiveHundreds(baseCost * (4 ** 1.15)), purchaseDelayInMs: 24 * 60 * 60 * 1000 },
	{ name: "ultimate", luck: 150, cost: ceilToFiveHundreds(baseCost * (5 ** 1.15)), purchaseDelayInMs: 24 * 60 * 60 * 1000 },
];
function ceilToFiveHundreds(value: number) {
	return ceilToValue(500)(value);
}
const amountNames = ["Classic", "Double", "Triple", "Quadruple", "Quintuple"];
export const allRarites: CardRarity[] = ["common", "rare", "epic", "legendary"];
const allWorlds = _.range(1, 6);
const classicRarityDistribution: Record<CardRarity, number> = getDistribution(0);

// max ratio = 100
// at ratio 100 legendary is 100 and other 0
export function getDistribution(luckImprove: number) {
	const lucks = {
		common: Math.max(0, 50 - luckImprove),
		rare: Math.max(0, 35 - luckImprove / 2.8),
		epic: 10 + Math.min(luckImprove, 60) / 7,
		legendary: 5 + luckImprove / 5,
	};
	// lucks added value could be less than 100, so we normalize it
	const total = _.sum(Object.values(lucks));
	return _.mapValues(lucks, (v) => v / total * 100);
}

export const worldBoosters = allWorlds.map(worldBooster);

export const boosters: BoosterTypeDeclartion[] = [
	{
		name: "Classic refill",
		cost: baseCost,
		description: `Contain 1 unit from any worlds among unlocked cards.`,
		contain: {
			worlds: allWorlds,
			rarities: classicRarityDistribution,
			unitAmount: 1,
		},
		unlockCondition: {
			world: 1,
		},
	},
	...worldBoosters,
	...(allWorlds.map(rarityBooster)),
];

export const unlockedIndex: Record<number, BoosterTypeDeclartion[]> = {};
boosters.forEach((booster) => {
	const target = (booster.unlockCondition.world - 1) * numberOfLevels;
	const unlocked = unlockedIndex[target] ?? [];
	unlocked.push(booster);
	unlockedIndex[target] = unlocked;
});

export function getAmountBoosterName(world: number) {
	return `${amountNames[world - 1]} refill`;
}

export function getWorldBoosterName(world: number) {
	return `World ${world} refill`;
}

function worldBooster(world: number): BoosterTypeDeclartion {
	return {
		name: getWorldBoosterName(world),
		cost: ceilToValue(100)(baseCost * (WORLD_GOLD_RATIO ** world)),
		description: `Contain 1 unit from ${ordinals[world - 1]} world.`,
		unlockCondition: {
			world: world,
		},
		contain: {
			worlds: [world],
			rarities: classicRarityDistribution,
			unitAmount: 1,
		},
	}
}

export function getRarityBoosterName(world: number) {
	return `${capitalizeFirstChar(upgradedBoosters[world - 1].name)} refill`;
}

function rarityBooster(world: number): BoosterTypeDeclartion {
	const { cost, purchaseDelayInMs, luck } = upgradedBoosters[world - 1];
	return {
		name: getRarityBoosterName(world),
		cost: cost,
		description: `Contain 1 unit from any worlds among unlocked cards with higher change of high rarity.`,
		purchaseDelayInMs: purchaseDelayInMs,
		unlockCondition: {
			world: world,
		},
		contain: {
			worlds: allWorlds,
			rarities: getDistribution(luck),
			unitAmount: 1,
		},
	}
}

function capitalizeFirstChar(str: string) {
	if (!str) return str; // Check for empty or null strings
	return str.charAt(0).toUpperCase() + str.slice(1);
}
