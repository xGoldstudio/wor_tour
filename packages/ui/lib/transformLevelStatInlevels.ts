import { CardRarity, Level, WorldStats } from "@repo/types";
import { getCardStrength } from "../components/card/Card";

export function getStrengthMin(world: number) {
	const rarities: CardRarity[] = [
		"common",
		"common",
		"common",
		"common",
		"common",
		"common",
		"common",
		"common",
	];
	return rarities.reduce((prev, curr) => {
		return prev + getCardStrength({ level: 1, rarity: curr, world });
	}, 0);
}

export function getStrengthMax(world: number) {
	const rarities: CardRarity[] = [
		"legendary",
		"epic",
		"epic",
		"rare",
		"rare",
		"rare",
		"rare",
		"common",
	];
	return rarities.reduce((prev, curr) => {
		return prev + getCardStrength({ level: 3, rarity: curr, world });
	}, 0);
}

export function transformLevelsDataInLevels(world: WorldStats): Level[] {
	const minStrength = getStrengthMin(world.id);
	const maxStrength = getStrengthMax(world.id);
	const baseGoldReward = world.baseGoldReward;
	const baseXpReward = world.baseXpReward;
	const numberOfLevels = world.numberOfLevels;
	const worldId = world.id;
	const levels: Level[] = [];
	for (let i = 0; i < numberOfLevels; i++) {
		const level: Level = {
			id: i + 1,
			world: worldId,
			reward: {
				xp: baseXpReward + (baseXpReward * i / 2),
				gold: baseGoldReward + (baseGoldReward * i / 2),
			},
			strength:
				minStrength + ((i > 0) ? ((maxStrength - minStrength) / (numberOfLevels - 1)) * i : 0),
		};
		levels.push(level);
	}
	console.log(levels);
	return levels;
}
