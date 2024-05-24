import cards, { CardType } from "@/cards";
import useRewardStore from "./rewardStore";
import usePlayerStore from "./playerStore";

export type BoosterName =
  | "Classic refill"
  | "World 1 refill"
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
  "Legendary refill": {
    name: "Legendary refill",
    cost: 30000,
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
  const addReward = useRewardStore((state) => state.addReward);
  const { addCardOrShardOrEvolve, collection } = usePlayerStore((state) => ({
    addCardOrShardOrEvolve: state.addCardOrShardOrEvolve,
    collection: state.collection,
  }));

  return function buyBooster() {
    const card = booster.cards[Math.floor(Math.random() * booster.cards.length)];
    const collectionCard = collection.get(card.id);
    if (collectionCard) {
      addReward({
        cardId: collectionCard.id,
        level: collectionCard.level,
        shardTargetIndex: collectionCard.shard,
      });
    } else {
      addReward({ cardId: card.id, level: 1, shardTargetIndex: null });
    }
    addCardOrShardOrEvolve(card.id);
  };
}
