export interface CardType {
  name: string;
  cost: number;
  illustration: string;
  dmg: number;
  hp: number;
	attackSpeed: number;
	effect: string;
  rarity: "common" | "rare" | "epic" | "legendary";
	id: number;
}

const cards: CardType[] = [
	{
		name: "Gentil Crabvor",
		cost: 3,
		illustration: "1.png",
		dmg: 150,
		attackSpeed: 0.3,
		hp: 300,
		effect: "Soigne de 150pv vos alliés",
		rarity: "rare",
		id: 1,
	},
	{
		name: "Flaque aux 5 yeux",
		cost: 2,
		illustration: "2.png",
		dmg: 90,
		attackSpeed: 1,
		hp: 500,
		effect: "",
		rarity: "common",
		id: 2,
	},
	{
		name: "Mega Crabvor",
		cost: 5,
		illustration: "1.png",
		dmg: 450,
		attackSpeed: 0.2,
		hp: 700,
		effect: "Inflige 150 degats à toutes les créatures",
		rarity: "epic",
		id: 3,
	},
	{
		name: "Reine Crabvor",
		cost: 4,
		illustration: "1.png",
		dmg: 75,
		attackSpeed: 2,
		hp: 300,
		effect: "",
		rarity: "legendary",
		id: 4,
	},
	{
		name: "Petit mordeur",
		cost: 2,
		illustration: "5.png",
		dmg: 150,
		attackSpeed: 0.5,
		hp: 300,
		effect: "",
		rarity: "common",
		id: 5,
	},
	{
		name: "Mage crabvor",
		cost: 4,
		illustration: "5.png",
		dmg: 1500 ,
		attackSpeed: 0.1,
		hp: 1000,
		effect: "",
		rarity: "rare",
		id: 6,
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