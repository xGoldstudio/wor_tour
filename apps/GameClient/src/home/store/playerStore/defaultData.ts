import { CollectionCard } from "./playerStore";

const defaultCollection: Map<number, CollectionCard> = new Map();
// to 75
for (let i = 1; i <= 8; i++) {
  defaultCollection.set(i, { id: i, level: 1, shard: 0 });
}

export const defaultPlayerStoreData = {
	collection: defaultCollection,
	currentWorld: 1,
	deck: [1, 2, 3, 4, 5, 6, 7, 8],
	gold: 0,
	trophies: 0,
	maxTrophies: 0,
	currentTier: 0,
}