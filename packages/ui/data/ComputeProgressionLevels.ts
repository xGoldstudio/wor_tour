import { ceilToValue, cubicBezier, getStrengthMax, getStrengthMin } from "@repo/ui";
import * as _ from "lodash";
import { boosters, getAmountBoosterName, getRarityBoosterName, getWorldBoosterName } from "./ComputeBoosterProgress";
import { numberOfLevels } from "../../../apps/Editor/src/editor/features/progression/consts";
import { Level } from "@repo/types";

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

const worlds: World[] = _.range(1, 6).map(buildLevel);

const endPercentage = 0.45;
const beginPercentage = 0.06;
const gapPercentage = (1 - endPercentage) / (worlds.length - 1);

const baseGoldReward = 1500;
const baseXpReward = 0;

const levels: Level[] = [];

worlds.forEach((world) => {
	// world 1 have a different begin percentage and a different easing
	const computedBeginPercentage =
		(world.id > 1 ? beginPercentage : 0) + gapPercentage * (world.id - 1);
	const computedEndPercentage =
		endPercentage + gapPercentage * (world.id - 1);

	const getProgress = (i: number) => {
		let usingI = i;
		if (i + 1 === numberOfLevels / 2) {
			usingI += world.id === 1 ? 2 : 3;
		} else if (i + 1 === numberOfLevels) {
			usingI = numberOfLevels;
		}
		return world.id === 1
			? cubicBezier(usingI / numberOfLevels, 0, 0.1, 0.3, 1)
			: cubicBezier(usingI / numberOfLevels, 0, 0.5, 0.2, 1);
	};
	{
		_.range(numberOfLevels).map((i) => {
			const progress = getProgress(i);
			const levelStrengthRange = world.maxLevel - world.minLevel;

			const maxWorld = world.minLevel + (computedEndPercentage * levelStrengthRange);
			const minWorld = world.minLevel + (computedBeginPercentage * levelStrengthRange);

			const strength = minWorld + (maxWorld - minWorld) * progress;

			const isBoss = i === numberOfLevels - 1;
			const isSemiBoss = i === numberOfLevels / 2 - 1;
			let goldReward = baseGoldReward;
			if (isSemiBoss) {
				goldReward = baseGoldReward * 5;
			} else if (isBoss) {
				goldReward = baseGoldReward * 7;
			}

			levels.push({
				id: (world.id - 1) * numberOfLevels + i,
				world: world.id, level: i + 1,
				strength: strength,
				chest: isBoss ? "epic" : isSemiBoss ? "rare" : "common",
				reward: {
					gold: ceilToValue(100)(goldReward * 1.2 ** (world.id - 1)),
					xp: baseXpReward,
					booster: boosters.find((booster) => {
						let boosterName = getWorldBoosterName(world.id);
						if (isSemiBoss) {
							boosterName = getRarityBoosterName(world.id);
						} else if (isBoss) {
							boosterName = getAmountBoosterName(world.id);
						}
						return booster.name === boosterName;
					}) || null,
				}
			});
		});
	}
});

export { worlds, levels };