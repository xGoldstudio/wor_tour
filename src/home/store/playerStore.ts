import { CardType, findCard } from '@/cards';
import { create } from 'zustand';

interface CollectionCard {
	id: number;
	level: number;
	shard: number;
}

interface PlayerStore {
  collection: Map<number, CollectionCard>;
	deck: number[];

	getCollection: () => CollectionCard[];
	getCollectionInfo: (id: number) => CollectionCard;
	getCompletInfo: (id: number) => CardType & { isInDeck: boolean };

	removeCardFromDeck: (id: number) => void;
	addCardToDeck: (id: number) => void;
	isDeckFull: () => boolean;
	isPlayed: (cardId: number) => boolean;
}

const defaultCollection: Map<number, CollectionCard> = new Map();
defaultCollection.set(1, { id: 1, level: 1, shard: 0 });
defaultCollection.set(2, { id: 2, level: 1, shard: 0 });
defaultCollection.set(3, { id: 3, level: 1, shard: 0 });
defaultCollection.set(4, { id: 4, level: 1, shard: 0 });
defaultCollection.set(5, { id: 5, level: 1, shard: 0 });
defaultCollection.set(6, { id: 6, level: 1, shard: 0 });
defaultCollection.set(7, { id: 7, level: 3, shard: 0 });
defaultCollection.set(8, { id: 8, level: 1, shard: 0 });

const usePlayerStore = create<PlayerStore>()((set, get) => ({
	collection: defaultCollection,
	deck: [7,8,1,2,3,4,5,6],
	getCollection: () => Array.from(get().collection.values()),
	getCollectionInfo: (id: number) => get().collection.get(id)!,
	getCompletInfo: (id: number) => ({ ...findCard(id, get().getCollectionInfo(id)!.level), isInDeck: get().deck.includes(id) }),
	
	removeCardFromDeck: (id: number) => set((state) => ({ deck: state.deck.filter((cardId) => cardId !== id) })),
	addCardToDeck: (id: number) => set((state) => ({ deck: [...state.deck, id] })),
	isDeckFull: () => get().deck.length >= 8,
	isPlayed: (cardId: number) => get().deck.includes(cardId),
}));



export default usePlayerStore;