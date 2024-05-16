import card1 from "./1";
import card2 from "./2";
import card3 from "./3";
import card4 from "./4";
import card5 from "./5";
import card6 from "./6";
import card7 from "./7";
import card8 from "./8";

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

interface CardsByRarity {
	common: CardType[];
	rare: CardType[];
	epic: CardType[];
	legendary: CardType[];
}

export interface CardStatsInfo {
	name: string;
	rarity: CardRarity;
	id: number;
	world: number;
	stats: [CardStatsInfoLevel, CardStatsInfoLevel, CardStatsInfoLevel];
}

interface CardStatsInfoLevel {
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
]

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

// export const cardsByRarity: CardsByRarity = cards.reduce((accu: CardsByRarity, current: CardType) => {
// 	accu[current.rarity].push(current);
// 	return accu;
// }, {
// 	common: [],
// 	rare: [],
// 	epic: [],
// 	legendary: [],
// })
