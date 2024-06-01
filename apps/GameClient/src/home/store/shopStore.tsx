import { create } from "zustand";
import usePlayerStore from "./playerStore";
import { CardRarity, CardRarityOrder, CardType } from "@/cards";
import { useAddCardOrShardOrEvolve } from "./useBooster";

interface ShopStore {
  cards: CardType[];
  hasBeenBought: number[];
  nextTimestamp: number;
}

setInterval(() => {
  const currentTimeStamp = Date.now();
  if (currentTimeStamp > useShopeStore.getState().nextTimestamp) {
    // 2 commons 2 rares 1 epic 1 legendary (if rarity is not enough, take the highest rarity available)
    const cardsByRarity = usePlayerStore
      .getState()
      .getAllCardsPackableByRarity();
    const cardsToBuy = [];
    const cardsRaritiesToGet: CardRarity[] = [
      "common",
      "common",
      "rare",
      "rare",
      "epic",
      "legendary",
    ];
    for (const rarity of cardsRaritiesToGet) {
      const cards = getCardsByRarityOrHigher(rarity, cardsByRarity);
      if (cards) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        const randomCard = cards[randomIndex];
        cards.splice(randomIndex, 1);
        cardsToBuy.push(randomCard);
      }
    }
    useShopeStore.setState({
      cards: cardsToBuy,
      hasBeenBought: [],
      nextTimestamp: currentTimeStamp + 1000 * 60 * 60 * 3,
    }); // 3 hours
  }
}, 1000);

function getCardsByRarityOrHigher(
  rarity: CardRarity,
  cardsByRarity: Record<CardRarity, CardType[]>,
) {
  let i = CardRarityOrder.indexOf(rarity);
  for (i; i < CardRarityOrder.length; i++) {
    if (cardsByRarity[rarity].length > 0) return cardsByRarity[rarity];
  }
  return null;
}

const useShopeStore = create<ShopStore>()(() => ({
  cards: [],
  hasBeenBought: [],
  nextTimestamp: 0,
}));

export default useShopeStore;

export const priceByRarity = {
  common: 1500,
  rare: 3000,
  epic: 6000,
  legendary: 15000,
};

export function useBuyCard(cardId: number) {
  const addOrEvolve = useAddCardOrShardOrEvolve();
  const { cardToBuy, hasBeenBought } = useShopeStore((state) => ({
    cardToBuy: state.cards.find((card) => card.id === cardId),
    hasBeenBought: state.hasBeenBought.find((id) => id === cardId),
  }));
  const { spendGold } = usePlayerStore((state) => ({
    spendGold: state.spendGold,
  }));

  const price = cardToBuy ? priceByRarity[cardToBuy.rarity] : 0;

  const canBuy = cardToBuy && price <= usePlayerStore.getState().gold;

  function buyCard() {
    if (!cardToBuy || !canBuy) return;
    addOrEvolve(cardId);
    spendGold(price);
    useShopeStore.setState((state) => ({
      hasBeenBought: [...state.hasBeenBought, cardId],
    }));
  }

  return {
    buyCard,
    canBuy,
    hasBeenBought,
  };
}
