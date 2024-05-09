export type CardType = {
	name: string;
	cost: number;
	illustration: string;
	dmg: number;
	hp: number;
	attackSpeed: number;
	rarity: "common" | "rare" | "epic" | "legendary";
	id: number;
	// effects
} & CardEffects;

export interface CardEffects {
	effects: {
		multiAttack?: MultiAttackEffect;
		placementHeal?: PlacementHeal;
		fightBack?: FightBackEffect;
	}
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

const cards: CardType[] = [
	{
		name: "Gentil Crabvor",
		cost: 3,
		illustration: "1.png",
		dmg: 150,
		attackSpeed: 0.3,
		hp: 300,
		rarity: "rare",
		id: 1,
		effects: {
			placementHeal: {
				type: "placementHeal",
				amount: 250,
			},
		}
	},
	{
		name: "Flaque aux 5 yeux",
		cost: 2,
		illustration: "2.png",
		dmg: 90,
		attackSpeed: 1,
		hp: 500,
		rarity: "common",
		id: 2,
		effects: {},
	},
	{
		name: "Mega Crabvor",
		cost: 4,
		illustration: "1.png",
		dmg: 250,
		attackSpeed: 0.3,
		hp: 700,
		rarity: "epic",
		id: 3,
		effects: {
			fightBack: { type: "fightBack" },
		},
	},
	{
		name: "Reine Crabvor",
		cost: 4,
		illustration: "1.png",
		dmg: 75,
		attackSpeed: 2,
		hp: 300,
		rarity: "legendary",
		id: 4,
		effects: {},
	},
	{
		name: "Petit mordeur",
		cost: 2,
		illustration: "5.png",
		dmg: 100,
		attackSpeed: 0.5,
		hp: 300,
		rarity: "common",
		id: 5,
		effects: {
			multiAttack: { type: "multiAttack" },
		}
	},
	{
		name: "Mage crabvor",
		cost: 3,
		illustration: "5.png",
		dmg: 800,
		attackSpeed: 0.2,
		hp: 800,
		rarity: "rare",
		id: 6,
		effects: {
		},
	},
]

interface CardsByRarity {
	common: CardType[];
	rare: CardType[];
	epic: CardType[];
	legendary: CardType[];
}

export const cardsByRarity: CardsByRarity = cards.reduce((accu: CardsByRarity, current: CardType) => {
	accu[current.rarity].push(current);
	return accu;
}, {
	common: [],
	rare: [],
	epic: [],
	legendary: [],
})

function findCard(id: number) {
	return cards.find(card => card.id === id) || cards[0];
}

export default findCard;