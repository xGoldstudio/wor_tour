import { levels } from "@repo/ui";
import { getTierFromLevel, Tier } from "../tiers";
import usePlayerStore, { CollectionCard } from "./playerStore";

const defaultCollection = (() => {
	const collection: Map<number, CollectionCard> = new Map();
	for (let i = 1; i <= 8; i++) {
		collection.set(i, { id: i, level: 1, shard: 0 });
	}
	collection.set(13, { id: 13, level: 1, shard: 0 });
	return collection;
})();

const tiers = (() => {
	const tierState = new Map<number, Tier>();
	levels.forEach((level) => {
		tierState.set(level.id, getTierFromLevel(level));
	});
	return tierState;
})();

export const defaultPlayerStoreData = {
	collection: defaultCollection,
	currentWorld: 1,
	deck: [13, 2, 3, 4, 5, 6, 7, 8],
	gold: 0,
	trophies: 0,
	maxTrophies: 0,
	currentTier: 0,
	tiers: tiers,
	isInit: false,
  currentMissingCards: [],
  numberOfCardsInDeck: 8,
}

export function initPlayerStore() {
	usePlayerStore.setState({ ...defaultPlayerStoreData, isInit: true });
}