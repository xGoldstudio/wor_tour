import useRewardStore from "../rewardStore";
import usePlayerStore from "../playerStore";
import { BoosterTypeDeclartion } from "@repo/types";
import { CardType } from "@repo/ui";
import { useBoosterStore } from "../boosterStore";
import { getRandomCardFromRarity } from "./getRandomCardFromRarity";

export type BoosterName =
  | "Classic refill"
  | "World 1 refill"
  | "Common refill"
  | "Legendary refill";

export type BoosterType = BoosterTypeDeclartion & {
  cards: CardType[];
};

export default function useBooster() {
  const { spendGold, gold } = usePlayerStore((state) => ({
    addCardOrShardOrEvolve: state.addCardOrShardOrEvolve,
    collection: state.collection,
    spendGold: state.spendGold,
    gold: state.gold,
  }));
  const addOrEvolve = useAddCardOrShardOrEvolve();
  const boosters = useBoosterStore((state) => state.boosters);

  return function openBooster(boosterName: string, isBuying: boolean) {
    const booster = boosters.find((b) => b.name === boosterName);
    if (!booster) return;
    if (isBuying && gold < booster.cost) {
      return;
    }
    const card = getRandomCardFromRarity(booster.cards, booster.contain.rarities);
    if (!card) {
      console.warn("Unexpected warning: No card found in booster", boosterName);
      return;
    }
    if (isBuying) {
      spendGold(booster.cost);
    }
    addOrEvolve(card.id);
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
        type: "card",
        cardId: collectionCard.id,
        level: collectionCard.level,
        shardTargetIndex: collectionCard.shard,
      });
    } else {
      addReward({ type: "card", cardId: cardId, level: 1, shardTargetIndex: null });
    }
    addCardOrShardOrEvolve(cardId);
  };
}
