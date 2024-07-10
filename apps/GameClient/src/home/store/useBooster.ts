import useRewardStore from "./rewardStore";
import usePlayerStore from "./playerStore";
import { BoosterTypeDeclartion, CardRarity } from "@repo/types";
import { CardType } from "@repo/ui";
import { arrayOfCardsToRarityMap, useBoosterStore } from "./boosterStore";

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

export function getRandomCardFromRarity(cards: CardType[], rarities: Record<CardRarity, number>) {
  const cardsByRarity = arrayOfCardsToRarityMap(cards);
  const rarityRand = Math.random() * 100;
  let usingRarity: CardRarity | null = null;
  let totalPercent = 0;
  for (const rarity in rarities) {
    const value = rarities[rarity as CardRarity];
    totalPercent = totalPercent + value;
    if (usingRarity === null && cardsByRarity[rarity as CardRarity].length > 0) {
      console.log("dafult")
      usingRarity = rarity as CardRarity; // the total rarities may be slightly less than 100, if its out of bound, we secure the first valid rarity
    }
    // should have cards inside
    if (cardsByRarity[rarity as CardRarity].length > 0 && rarityRand <= totalPercent) {
      usingRarity = rarity as CardRarity;
      console.log(usingRarity);
      break;
    }
  }
  if (!usingRarity) return;
  const cardsFilterdByRarity = cardsByRarity[usingRarity];
  if (cardsFilterdByRarity.length === 0) return;
  const randomCard =
    cardsFilterdByRarity[Math.floor(Math.random() * cardsFilterdByRarity.length)];
  return randomCard;
}