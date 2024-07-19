import { getCardStrength } from "../../../gameEngine/src/types/Card";
import { CardRarity } from "../../../gameEngine/src/types/DataStoreType";

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