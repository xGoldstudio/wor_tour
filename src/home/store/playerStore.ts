import cards, { CardRarity, CardStatsInfo, CardType, findCard, getCardFromLevel, getCardStats } from '@/cards';
import { create } from 'zustand';
import { BoosterType, boosters } from './useBooster';

export interface CollectionCard {
	id: number;
	level: number;
	shard: number;
}

interface PlayerStore {
	collection: Map<number, CollectionCard>;
	deck: number[];
	currentWorld: number;
	gold: number;

	getCollection: () => CollectionCard[];
	getCollectionInfo: (id: number) => CollectionCard;
	getCompleteInfo: (id: number) => CardType & { isInDeck: boolean };

	removeCardFromDeck: (id: number) => void;
	addCardToDeck: (id: number) => void;
	isDeckFull: () => boolean;
	isPlayed: (cardId: number) => boolean;

	getAllCardsPackable: () => CardStatsInfo[];
	getAllCardsPackableByRarity: () => Record<CardRarity, CardType[]>;
	isCardPackable: (id: number) => CardType | null;

	addCardOrShardOrEvolve: (cardId: number) => void;

	getAvailableBoosters: () => BoosterType[];

	addGold: (amount: number) => void;
	spendGold: (amount: number) => void;
}

const defaultCollection: Map<number, CollectionCard> = new Map();
defaultCollection.set(1, { id: 1, level: 1, shard: 0 });
defaultCollection.set(2, { id: 2, level: 1, shard: 0 });
defaultCollection.set(3, { id: 3, level: 1, shard: 0 });
defaultCollection.set(4, { id: 4, level: 1, shard: 0 });
defaultCollection.set(5, { id: 5, level: 1, shard: 0 });
defaultCollection.set(6, { id: 6, level: 1, shard: 0 });
defaultCollection.set(7, { id: 7, level: 1, shard: 0 });
defaultCollection.set(8, { id: 8, level: 1, shard: 0 });
defaultCollection.set(9, { id: 9, level: 1, shard: 0 });

const shardsByLevels = [3, 7];

const usePlayerStore = create<PlayerStore>()((set, get) => ({
	collection: defaultCollection,
	currentWorld: 1,
	deck: [7, 8, 1, 2, 3, 9, 5, 6],
	gold: 0,
	getCollection: () => Array.from(get().collection.values()),
	getCollectionInfo: (id: number) => get().collection.get(id)!,
	getCompleteInfo: (id: number) => ({ ...findCard(id, get().getCollectionInfo(id)!.level), isInDeck: get().deck.includes(id) }),

	removeCardFromDeck: (id: number) => set((state) => ({ deck: state.deck.filter((cardId) => cardId !== id) })),
	addCardToDeck: (id: number) => set((state) => ({ deck: [...state.deck, id] })),
	isDeckFull: () => get().deck.length >= 8,
	isPlayed: (cardId: number) => get().deck.includes(cardId),

	isCardPackable: (id: number) => {
		const card = getCardStats(id);
		if (card.world > get().currentWorld) return null;
		const collectionCard = get().getCollectionInfo(id);
		if (!collectionCard) return findCard(id, 1);
		return collectionCard.level < 3 ? findCard(id, collectionCard.level) : null;
	},
	getAllCardsPackable: () => {
		return cards.filter((card) => get().isCardPackable(card.id));
	},
	getAllCardsPackableByRarity: () => {
		const cardsPackable = get().getAllCardsPackable();
		const cardsByRarity = cardsPackable.reduce((acc, card) => {
			if (!acc[card.rarity]) {
				acc[card.rarity] = [];
			}
			acc[card.rarity].push(getCardFromLevel(card, get().getCollectionInfo(card.id)!.level));
			return acc;
		}, {
			common: [],
			rare: [],
			epic: [],
			legendary: []
		} as Record<CardRarity, CardType[]>);
		return cardsByRarity;
	},
	addCardOrShardOrEvolve: (cardId: number) => {
		const collectionCard = get().getCollectionInfo(cardId);
		if (!collectionCard) {
			get().collection.set(cardId, { id: cardId, level: 1, shard: 0 });
		} else {
			const requiredShards = shardsByLevels[collectionCard.level - 1];
			if (collectionCard.shard === (requiredShards - 1)) {
				get().collection.set(cardId, { ...collectionCard, level: collectionCard.level + 1, shard: 0 });
			} else {
				get().collection.set(cardId, { ...collectionCard, shard: collectionCard.shard + 1 });
			}
		}
		set((state) => ({ collection: new Map(state.collection) }));
	},

	getAvailableBoosters: () => {
		return Object.values(boosters).map((booster) => {
			if (booster.requirements.world && booster.requirements.world > get().currentWorld) return null;
			const boosterCardsPackable = booster.cards.map((cardId) => get().isCardPackable(cardId)).filter((card) => card !== null) as CardType[];
			if (booster.requirements.cardAvailable && !booster.requirements.cardAvailable(boosterCardsPackable)) return null;
			return { ...booster, cards: boosterCardsPackable };
		}).filter((booster) => booster !== null) as BoosterType[];
	},

	addGold: (amount: number) => set((state) => ({ gold: state.gold + amount })),
	spendGold: (amount: number) => set((state) => ({ gold: state.gold - amount })),
}));



export default usePlayerStore;