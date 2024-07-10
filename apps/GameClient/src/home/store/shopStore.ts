import { create } from "zustand";
import usePlayerStore from "./playerStore";
import { useAddCardOrShardOrEvolve } from "./useBooster/useBooster";
import { CardRarity } from "@repo/types";
import { CardRarityOrder, CardType } from "@repo/ui";
import { combineLatest } from 'rxjs';
import { packableCardsByRarityObservable } from "./boosterStore";
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

const useShopStore = create<ShopStore>()(() => ({
  cards: [],
  hasBeenBought: [],
  nextTimestamp: 0,
}));

export default useShopStore;

interface ShopStore {
  cards: CardType[];
  hasBeenBought: number[];
  nextTimestamp: number;
}

const eventLoopObservable = new Observable<number>(subscriber => {
  subscriber.next(Date.now());
  setInterval(() => {
    subscriber.next(Date.now());
  }, 1000);
});

const listOfCardsToBuy = combineLatest(
  [packableCardsByRarityObservable, eventLoopObservable]
).pipe(
  filter((_, timestamp) => timestamp >= useShopStore.getState().nextTimestamp),
  map(([cardsByRarity]) => computeListOfCardsToBuy(cardsByRarity)));

listOfCardsToBuy.subscribe(({ cardsToBuy, timeStamp }) => {
  if (cardsToBuy.length === 0) return;
  useShopStore.setState({
    cards: cardsToBuy,
    hasBeenBought: [],
    nextTimestamp: timeStamp,
  });
})

function computeListOfCardsToBuy(cardsByRarity: Record<CardRarity, CardType[]>) {
  const currentTimeStamp = Date.now();
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
  return { cardsToBuy, timeStamp: currentTimeStamp + (1000 * 60 * 60 * 3) };// 3 hours
}

function getCardsByRarityOrHigher(
  rarity: CardRarity,
  cardsByRarity: Record<CardRarity, CardType[]>
) {
  let i = CardRarityOrder.indexOf(rarity);
  for (i; i < CardRarityOrder.length; i++) {
    if (cardsByRarity[rarity].length > 0) return [...cardsByRarity[rarity]];
  }
  return null;
}

export const priceByRarity = {
  common: 1500,
  rare: 3000,
  epic: 6000,
  legendary: 15000,
};

export function useBuyCard(cardId: number) {
  const addOrEvolve = useAddCardOrShardOrEvolve();
  const { cardToBuy, hasBeenBought } = useShopStore((state) => ({
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
    useShopStore.setState((state) => ({
      hasBeenBought: [...state.hasBeenBought, cardId],
    }));
  }

  return {
    buyCard,
    canBuy,
    hasBeenBought,
  };
}
