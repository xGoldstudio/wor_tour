import { CardRarity, CardType } from "@repo/ui";

export function getRandomCardFromRarity(cards: CardType[], rarities: Record<CardRarity, number>) {
	const cardsByRarity = arrayOfCardsToRarityMap(cards);
	const rarityRand = Math.random() * 100;
	let usingRarity: CardRarity | null = null;
	let totalPercent = 0;
	for (const rarity in rarities) {
		const value = rarities[rarity as CardRarity];
		const nextPercent = totalPercent + value;
		if (usingRarity === null && cardsByRarity[rarity as CardRarity].length > 0) {
			usingRarity = rarity as CardRarity; // the total rarities may be slightly less than 100, if its out of bound, we secure the first valid rarity
		}
		// should have cards inside
		if (cardsByRarity[rarity as CardRarity].length > 0
			&& rarityRand <= nextPercent
			&& rarityRand > totalPercent
		) {
			usingRarity = rarity as CardRarity;
			break;
		}
		totalPercent = nextPercent;
	}
	if (!usingRarity) return;
	const cardsFilterdByRarity = cardsByRarity[usingRarity];
	if (cardsFilterdByRarity.length === 0) return;
	const randomCard = cardsFilterdByRarity[Math.floor(Math.random() * cardsFilterdByRarity.length)];
	return randomCard;
}

export function arrayOfCardsToRarityMap(cards: CardType[]) {
	const cardsByRarity = cards.reduce(
		(acc, card) => {
			acc[card.rarity].push(card);
			return acc;
		},
		{
			common: [],
			rare: [],
			epic: [],
			legendary: [],
		} as Record<CardRarity, CardType[]>
	);
	return cardsByRarity;
}