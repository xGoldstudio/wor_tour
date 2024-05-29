import card1 from "./1";
import card2 from "./2";
import card3 from "./3";
import card4 from "./4";
import card5 from "./5";
import card6 from "./6";
import card7 from "./7";
import card8 from "./8";
import card9 from "./9";

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
	effects: CardEffects;
	level: number;
	world: number;
};

export type CardRarity = "common" | "rare" | "epic" | "legendary";

export const CardRarityOrder: CardRarity[] = ["common", "rare", "epic", "legendary"];

export interface CardEffects {
	multiAttack?: MultiAttackEffect;
	placementHeal?: PlacementHeal;
	fightBack?: FightBackEffect;
}

interface MultiAttackEffect {
	type: "multiAttack";
}

interface PlacementHeal {
	type: "placementHeal";
	amount: number;
}

interface FightBackEffect {
	type: "fightBack";
}

// interface CardsByRarity {
// 	common: CardType[];
// 	rare: CardType[];
// 	epic: CardType[];
// 	legendary: CardType[];
// }

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
	effects: CardEffects;
}

// function cardValue(card: CardStatsInfo, level: number) {
// 	return rarityValue[card.rarity] * (level * 1.2) * (card.world * 1.2); 
// }

// const rarityValue = {
// 	"common": 1,
// 	"rare": 1.1,
// 	"epic": 1.2,
// 	"legendary": 1.5,
// }

const cards: CardStatsInfo[] = [
	card1,
	card2,
	card3,
	card4,
	card5,
	card6,
	card7,
	card8,
	card9,
]

export default cards;

export function findCard(id: number, level: number): CardType {
	const card = cards.find(card => card.id === id) || cards[0];
	return getCardFromLevel(card, level);
}

export function getCardStats(id: number): CardStatsInfo {
	return cards.find(card => card.id === id) || cards[0];
}

export function getCardFromLevel(card: CardStatsInfo, level: number): CardType {
	const levelIndex = level - 1;

	return {
		name: card.name,
		cost: card.stats[levelIndex].cost,
		illustration: `/cards/${card.id}/level${level}.png`,
		worldIllustration: `/cards/worlds/${card.world}.png`,
		dmg: card.stats[levelIndex].dmg,
		hp: card.stats[levelIndex].hp,
		attackSpeed: card.stats[levelIndex].attackSpeed,
		rarity: card.rarity,
		id: card.id,
		effects: card.stats[levelIndex].effects,
		level: level,
		world: card.world,
	}
}

export function isLevelValid(cardId: number, level: number): boolean {
	const card = findCard(cardId, level);
	const statsLevel = getRealStrength(card);
	console.log(card.level, card.name, statsLevel, getTargetStrength(card));
	return testIsStrengthValid(statsLevel, getTargetStrength(card));
}

export function testIsStrengthValid(statsLevel: number, targetStats: number): boolean {
	return Math.abs(statsLevel - targetStats) < maxDelta;
}

export function getTargetStrength(card: CardType) {
	const targetStrength = getCardStrength(card);
	return baseStats * targetStrength;
}

// baseStats = hp: 100, dmg: 100, attackSpeed: 0.2 no effect = 1+1+1 = 3 (card level 1 common world 1)
const baseStats = 3;
export const maxDelta = 0.05;

// * 1.5 stat per cost

export function getRealStrength(card: CardType): number {
	let statsLevel = 0;
	statsLevel += card.hp / 100;
	statsLevel += (card.dmg * card.attackSpeed) / 33; // survavibility ratio is 3s
	// statsLevel += Math.min(card.attackSpeed - 1, 0) / 0.6; // high attack speed penalty
	statsLevel /= 1.5 ** (card.cost);
	// effects cost
	if (card.effects.multiAttack) {
		statsLevel += card.dmg / 100;
	}
	if (card.effects.placementHeal) {
		statsLevel += card.effects.placementHeal.amount / 100;
	}
	if (card.effects.fightBack) {
		statsLevel += card.dmg / 100 / 3;
	}
	return statsLevel;
}

const rarityStrength = {
  common: 1,
  rare: 1.1,
  epic: 1.2,
  legendary: 1.5,
};

export function getCardStrength(card: CardType) {
  return 1 * (Math.pow(1.2, card.level - 1)) * rarityStrength[card.rarity] * (Math.pow(1.2, card.world - 1));
}

// export const cardsByRarity: CardsByRarity = cards.reduce((accu: CardsByRarity, current: CardType) => {
// 	accu[current.rarity].push(current);
// 	return accu;
// }, {
// 	common: [],
// 	rare: [],
// 	epic: [],
// 	legendary: [],
// })
