import useRewardStore from "../rewardStore";
import usePlayerStore from "../playerStore/playerStore";
import { useBoosterStore } from "../boosterStore";
import { getRandomCardFromRarity } from "./getRandomCardFromRarity";
import { BoosterTypeDeclartion, CardType } from "game_engine";

export type BoosterName =
  | "Classic refill"
  | "World 1 refill"
  | "Common refill"
  | "Legendary refill";

export type BoosterType = BoosterTypeDeclartion & {
  cards: CardType[];
};

const UNLOCK_NEW_CARDS_TRESHOLD = 0.3;

export default function openBooster(boosterName: string, isBuying: boolean) {
  const { spendGold, gold } = usePlayerStore.getState();
  const boosters = useBoosterStore.getState().boosters;
  const addReward = useRewardStore.getState().addReward;

  const booster = boosters.find((b) => b.name === boosterName);
  if (!booster) return;
  if (isBuying && gold < booster.cost) {
    return;
  }
  const allowUnlockingCard = Math.random() < UNLOCK_NEW_CARDS_TRESHOLD;
  const filteredBoostCards = allowUnlockingCard ? booster.cards.filter((card) => usePlayerStore.getState().getCollectionInfo(card.id)) : booster.cards;
  const card = getRandomCardFromRarity(filteredBoostCards, booster.contain.rarities);
  if (isBuying) {
    spendGold(booster.cost);
  }
  if (!card) {
    addReward({ type: "gold", amount: booster.cost });
    return;
  }
  addCardOrShardOrEvolve(card.id);
}

export function addCardOrShardOrEvolve(cardId: number) {
  const addReward = useRewardStore.getState().addReward;
  const { addCardOrShardOrEvolve, collection } = usePlayerStore.getState();

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
}
