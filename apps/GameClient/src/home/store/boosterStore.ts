import { toStream } from 'zustand-rx';
import usePlayerStore, { CollectionCard } from "./playerStore/playerStore";
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { boosters, toState } from "@repo/ui";
import { BoosterType } from "./useBooster/useBooster";
import useDataStore from "@/cards/DataStore";
import { create } from 'zustand';
import { arrayOfCardsToRarityMap } from './useBooster/getRandomCardFromRarity';
import { findCard } from '@/cards';
import { BoosterTypeDeclartion, CardRarityOrder, CardStatsInfo, CardType } from '@repo/lib';

const playerCollectionObservable = toStream(usePlayerStore, (state) => state.collection, {
	fireImmediately: true,
});
usePlayerStore.subscribe((state) => state);
const playerCurrentWorldObservable = toStream(usePlayerStore, (state) => state.currentWorld, {
	fireImmediately: true,
});
const cardsObservable = toStream(useDataStore, (state) => state.cards, {
	fireImmediately: true,
});
function isCardPackable(card: CardStatsInfo, collection: Map<number, CollectionCard>, currentWorld: number): boolean {
	const collectionCard = collection.get(card.id);
	if (!card) return false;
	if (card.world > currentWorld) return false;
	if (!collectionCard) return true;
	if (collectionCard.level === 3) return false;
	return true;
}
const packableCardsObservable = combineLatest(
	[playerCollectionObservable, playerCurrentWorldObservable, cardsObservable]
).pipe(
	map(([collectionMap, currentWorld, cards]) => {
		return cards.filter(
			(card) => isCardPackable(card, collectionMap, currentWorld)
		);
	})
);
export const packableCardsByRarityObservable = packableCardsObservable.pipe(
	map(cards => arrayOfCardsToRarityMap(arrayOfCardStatInfoToCardType(cards)))
);
function arrayOfCardStatInfoToCardType(cards: CardStatsInfo[]) {
	return cards.map((card) => findCard(card.id, 1));
}

function isCardPackableForBooster(booster: BoosterTypeDeclartion) {
	return (card: CardStatsInfo) => {
		if (!booster.contain.worlds.includes(card.world)) return false;
		if (booster.contain.rarities[card.rarity] === 0) return false;
		return true;
	}
}
function findCardFromCollection(card: { id: number }) {
	const collectionCard = usePlayerStore.getState().collection.get(card.id);
	if (collectionCard) {
		return findCard(card.id, collectionCard.level);
	}
	return null;
}
function sortCardsByRarity(a: CardType, b: CardType) {
	return CardRarityOrder.indexOf(a.rarity) - CardRarityOrder.indexOf(b.rarity)
}
function isBoosterUnlocked(booster: BoosterTypeDeclartion, currentWorld: number) {
	return booster.unlockCondition.world <= currentWorld;
}
export const boostersObservable = combineLatest([packableCardsObservable, playerCurrentWorldObservable]).pipe(
	map(([allPackableCards, currentWorld]): BoosterType[] => {
		return boosters.map((booster) => {
			if (!isBoosterUnlocked(booster, currentWorld)) {
				return null;
			}
			const packableCards = (allPackableCards
				.filter(isCardPackableForBooster(booster))
				.map(findCardFromCollection)
				.filter((card) => card) as CardType[])
				.sort(sortCardsByRarity);
			if (packableCards.length === 0) {
				return null;
			}
			return { ...booster, cards: packableCards };
		}).filter((booster) => booster !== null) as BoosterType[];
	})
);

interface BoosterStore {
	boosters: BoosterType[];
}

export const useBoosterStore = create<BoosterStore>(() => ({
	boosters: [],
}));

toState(useBoosterStore, "boosters", boostersObservable);