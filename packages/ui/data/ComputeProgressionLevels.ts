import * as _ from "lodash";
import { boosters, getWorldBoosterName } from "./ComputeBoosterProgress";
import { getStrengthMax, getStrengthMin } from "../lib/transformLevelStatInlevels";
import { ceilToValue, cubicBezier, Level } from "@repo/lib";
import { numberOfLevels } from "../lib/utils";
import { WORLD_GOLD_RATIO } from "./const";

export const GoldPerVictory = 250;
export const MaxGoldPerDay = 5000;

const ceilToFive = ceilToValue(5);

function computeGoldWorldValue(value: number) {
	return (currentWorld: number) => ceilToFive(value * (WORLD_GOLD_RATIO ** (currentWorld - 1)));
}

export const getGoldPerVictory = computeGoldWorldValue(GoldPerVictory);
export const getMaxGoldPerDay = computeGoldWorldValue(MaxGoldPerDay);

interface World {
	id: number;
	minLevel: number;
	maxLevel: number;
}

function buildLevel(word: number) {
	return {
		id: word,
		minLevel: getStrengthMin(word),
		maxLevel: getStrengthMax(word),
	};
}

const worldsHardcodedData: World[] = _.range(1, 6).map(buildLevel);

const endPercentage = 0.65;
const beginPercentage = 0.30;
const gapPercentage = (1 - endPercentage) / (worldsHardcodedData.length - 1);

const baseGoldReward = 1500;
const baseXpReward = 0;

const levels: Level[] = [];

worldsHardcodedData.forEach((world) => {
	// world 1 have a different begin percentage and a different easing
	const computedBeginPercentage =
		(world.id > 1 ? beginPercentage : 0) + gapPercentage * (world.id - 1);
	const computedEndPercentage =
		endPercentage + gapPercentage * (world.id - 1);

	const getProgress = (i: number) => {
		return world.id === 1
			? cubicBezier(i / numberOfLevels, 0, 0.1, 0.3, 1)
			: cubicBezier(i / numberOfLevels, 0, 0.5, 0.2, 1);
	};
	{
		_.range(numberOfLevels).map((i) => {
			const progress = getProgress(i);
			const levelStrengthRange = world.maxLevel - world.minLevel;

			const maxWorld = world.minLevel + (computedEndPercentage * levelStrengthRange);
			const minWorld = world.minLevel + (computedBeginPercentage * levelStrengthRange);

			const strength = minWorld + (maxWorld - minWorld) * progress;

			const id = (world.id - 1) * numberOfLevels + i;
			levels.push({
				id,
				world: world.id, level: i + 1,
				strength: strength,
				chest: "rare",
				trophyStart: id * 100,
				trophyEnd: (id + 1) * 100 - 1, 
				reward: {
					gold: ceilToValue(100)(baseGoldReward * 1.2 ** (world.id - 1)),
					xp: baseXpReward,
					booster: boosters.find((booster) => {
						return booster.name === getWorldBoosterName(world.id);
					}) || null,
				}
			});
		});
	}
});

export { worldsHardcodedData, levels };