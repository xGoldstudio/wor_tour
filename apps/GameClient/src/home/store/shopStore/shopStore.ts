import { create } from "zustand";
import usePlayerStore from "../playerStore/playerStore";
import { getSecondsFromHours } from "@repo/lib";
import { CardRarity, CardRarityOrder, CardStatsInfo, CardType } from "game_engine";
import { persist } from "zustand/middleware";
import useDataStore from "@/cards/DataStore";
import { isCardPackable } from "../boosterStore";
import { arrayOfCardsToRarityMap } from "../useBooster/getRandomCardFromRarity";
import { findCard } from "@/cards";
import { addCardOrShardOrEvolve } from "../useBooster/useBooster";

export const CARDS_ROTATION_TIME = getSecondsFromHours(3);

export function initShopStore() {
  useShopStore.setState({ ...ShopeStoreDefaultState });
}

const ShopeStoreDefaultState = {
  cards: [],
  hasBeenBought: [],
}

const useShopStore = create(persist<ShopStore>(
  () => ({
    ...ShopeStoreDefaultState,
  }),
  { name: "shopStore" },
));

export default useShopStore;

interface ShopStore {
  cards: CardType[];
  hasBeenBought: number[];
}

export function setCardsToBuy() {
  const cardsToBuy = computeListOfCardsToBuy(getAllPackableCardsByRarity());
  useShopStore.setState({
    cards: cardsToBuy,
    hasBeenBought: [],
  });
}

function getAllPackableCardsByRarity() {
  const cards = useDataStore.getState().cards;
  const collectionMap = usePlayerStore.getState().collection;
  const currentWorld = usePlayerStore.getState().currentWorld;
  return arrayOfCardsToRarityMap(arrayOfCardStatInfoToCardType(cards.filter(
    (card) => isCardPackable(card, collectionMap, currentWorld)
  )));
}

function arrayOfCardStatInfoToCardType(cards: CardStatsInfo[]) {
  return cards.map((card) => findCard(card.id, 1));
}

function computeListOfCardsToBuy(cardsByRarity: Record<CardRarity, CardType[]>) {
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
  return cardsToBuy;
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
    addCardOrShardOrEvolve(cardId);
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
