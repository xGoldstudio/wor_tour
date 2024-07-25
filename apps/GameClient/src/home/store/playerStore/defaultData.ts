import { levels } from "@repo/ui";
import { getTierFromLevel, Tier } from "../tiers";
import usePlayerStore, { CollectionCard } from "./playerStore";

const defaultCollection = (() => {
	const collection: Map<number, CollectionCard> = new Map();
	// to 75
	for (let i = 1; i <= 8; i++) {
		collection.set(i, { id: i, level: 1, shard: 0 });
	}
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
	deck: [1, 2, 3, 4, 5, 6, 7, 8],
	gold: 0,
	trophies: 0,
	maxTrophies: 0,
	currentTier: 0,
	tiers: tiers,
}

export function WarningResetPlayStore() {
	usePlayerStore.setState(defaultPlayerStoreData);
}