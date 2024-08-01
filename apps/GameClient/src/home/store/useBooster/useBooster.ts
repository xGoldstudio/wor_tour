import useRewardStore from "../rewardStore";
import usePlayerStore from "../playerStore/playerStore";
import { BoosterTypeDeclartion, CardType } from "@repo/lib";
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
  const addReward = useRewardStore((state) => state.addReward)

  return function openBooster(boosterName: string, isBuying: boolean) {
    const booster = boosters.find((b) => b.name === boosterName);
    if (!booster) return;
    if (isBuying && gold < booster.cost) {
      return;
    }
    const card = getRandomCardFromRarity(booster.cards, booster.contain.rarities);
    if (isBuying) {
      spendGold(booster.cost);
    }
    if (!card) {
      addReward({ type: "gold", amount: booster.cost });
      return;
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
