import cards, { CardType } from "@/cards";
import useRewardStore from "./rewardStore";
import usePlayerStore from "./playerStore";

export type BoosterName =
  | "Classic refill"
  | "World 1 refill"
	| "Common refill"
  | "Legendary refill";

export type BoosterType = Omit<BoosterTypeDeclartion, "cards"> & {
  cards: CardType[];
}

export interface BoosterTypeDeclartion {
  name: BoosterName;
  cost: number;
  description: string;
  illustration: string;
  cards: number[];
  requirements: {
    world?: number;
    cardAvailable?: (cards: CardType[]) => boolean;
  };
}

export const boosters: Record<BoosterName, BoosterTypeDeclartion> = {
  "Classic refill": {
    name: "Classic refill",
    cost: 1000,
    description: "Contain 1 unit from any worlds among unlocked cards.",
    illustration: "/cards/7/level3.png",
    cards: cards.map((card) => card.id),
    requirements: {},
  },
  "World 1 refill": {
    name: "World 1 refill",
    cost: 1200,
    description: "Contain 1 unit from any worlds among unlocked cards.",
    illustration: "/cards/8/level3.png",
    cards: cards.filter((card) => card.world === 1).map((card) => card.id),
    requirements: {
      world: 1,
    },
  },
	"Common refill": {
    name: "Common refill",
    cost: 800,
    description:
      "Contain 1 common unit from any worlds among unlocked cards.",
    illustration: "/cards/8/level1.png",
    cards: cards
      .filter((card) => card.rarity === "common")
      .map((card) => card.id),
    requirements: {
      cardAvailable: (cards) =>
        cards.some((card) => card.rarity === "common"),
    },
  },
  "Legendary refill": {
    name: "Legendary refill",
    cost: 10000,
    description:
      "Contain 1 legendary unit from any worlds among unlocked cards.",
    illustration: "/cards/4/level3.png",
    cards: cards
      .filter((card) => card.rarity === "legendary")
      .map((card) => card.id),
    requirements: {
      cardAvailable: (cards) =>
        cards.some((card) => card.rarity === "legendary"),
    },
  },
};

export default function useBooster(booster: BoosterType) {
  const { addCardOrShardOrEvolve, spendGold, gold } = usePlayerStore((state) => ({
    addCardOrShardOrEvolve: state.addCardOrShardOrEvolve,
    collection: state.collection,
		spendGold: state.spendGold,
		gold: state.gold,
  }));
  const addOrEvolve = useAddCardOrShardOrEvolve();

  return function buyBooster() {
		if (gold < booster.cost) return;
    const card = booster.cards[Math.floor(Math.random() * booster.cards.length)];
    addOrEvolve(card.id)
		spendGold(booster.cost);
    addCardOrShardOrEvolve(card.id);
  };
}

export function useAddCardOrShardOrEvolve() {
  const addReward = useRewardStore((state) => state.addReward);
  const { addCardOrShardOrEvolve, collection } = usePlayerStore((state) => ({
    addCardOrShardOrEvolve: state.addCardOrShardOrEvolve,
    collection: state.collection,
  }));

  return function addOrEvolve(cardId: number) {
    const collectionCard = collection.get(cardId);
    if (collectionCard) {
      if (collectionCard.level === 3) return;
      addReward({
        cardId: collectionCard.id,
        level: collectionCard.level,
        shardTargetIndex: collectionCard.shard,
      });
    } else {
      addReward({ cardId: cardId, level: 1, shardTargetIndex: null });
    }
    addCardOrShardOrEvolve(cardId);
  };
}