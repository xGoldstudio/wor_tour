import useDataStore from "@/cards/DataStore";
import { findCard, getCardFromLevel, getCardStats } from "@/cards";
import { create } from "zustand";
import { BoosterType, boosters } from "./useBooster";
import { CardRarity } from "@repo/types";
import { CardRarityOrder, CardStatsInfo, CardType } from "@repo/ui";

export interface CollectionCard {
  id: number;
  level: number;
  shard: number;
}

interface PlayerStore {
  NUMBER_OF_CARD_IN_DECK: number;
  collection: Map<number, CollectionCard>;
  deck: number[];
  currentWorld: number;
  gold: number;

  getCollection: () => CollectionCard[];
  getCollectionInfo: (id: number) => CollectionCard | undefined;
  getCompleteInfo: (id: number) => CardType & { isInDeck: boolean };
  getCollectionCompleteInfo: (
    collection: CollectionCard[]
  ) => (CardType & { isInDeck: boolean })[];
  removeCardFromDeck: (id: number) => void;
  addCardToDeck: (id: number) => void;
  isDeckFull: () => boolean;
  isPlayed: (cardId: number) => boolean;

  getAllCardsPackable: () => CardStatsInfo[];
  getAllCardsPackableByRarity: () => Record<CardRarity, CardType[]>;
  isCardPackable: (id: number) => CardType | null;

  addCardOrShardOrEvolve: (cardId: number) => void;

  getAvailableBoosters: () => BoosterType[];

  addGold: (amount: number) => void;
  spendGold: (amount: number) => void;

  lastCompletedLevel: number;
  completeNextLevel: () => void;
}

const defaultCollection: Map<number, CollectionCard> = new Map();
defaultCollection.set(1, { id: 1, level: 1, shard: 1 });
defaultCollection.set(2, { id: 2, level: 1, shard: 0 });
defaultCollection.set(3, { id: 3, level: 1, shard: 0 });
defaultCollection.set(4, { id: 4, level: 1, shard: 0 });
defaultCollection.set(5, { id: 5, level: 1, shard: 0 });
defaultCollection.set(6, { id: 6, level: 1, shard: 0 });
defaultCollection.set(7, { id: 7, level: 1, shard: 0 });
defaultCollection.set(8, { id: 8, level: 1, shard: 0 });

const shardsByLevels = [3, 7];

const usePlayerStore = create<PlayerStore>()((set, get) => ({
  NUMBER_OF_CARD_IN_DECK: 8,
  collection: defaultCollection,
  currentWorld: 1,
  deck: [1, 2, 3, 4, 5, 6, 7, 8],
  gold: 1000,
  getCollection: () => Array.from(get().collection.values()),
  getCollectionInfo: (id: number) => get().collection.get(id),
  getCompleteInfo: (id: number) => ({
    ...findCard(id, get().getCollectionInfo(id)!.level),
    isInDeck: get().deck.includes(id),
  }),
  getCollectionCompleteInfo: (collection: CollectionCard[]) =>
    collection.map((card) => get().getCompleteInfo(card.id)),
  lastCompletedLevel: -1,

  removeCardFromDeck: (id: number) =>
    set((state) => ({ deck: state.deck.filter((cardId) => cardId !== id) })),
  addCardToDeck: (id: number) =>
    set((state) => ({ deck: [...state.deck, id] })),
  isDeckFull: () => get().deck.length >= 8,
  isPlayed: (cardId: number) => get().deck.includes(cardId),

  isCardPackable: (id: number) => {
    // todo
    const card = getCardStats(id);
    if (card.world > get().currentWorld) return null;
    const collectionCard = get().getCollectionInfo(id);
    if (!collectionCard) return findCard(id, 1);
    return collectionCard.level < 3 ? findCard(id, collectionCard.level) : null;
  },
  getAllCardsPackable: () => {
    //
    return useDataStore
      .getState()
      .cards.filter((card) => get().isCardPackable(card.id));
  },
  getAllCardsPackableByRarity: () => {
    const cardsPackable = get().getAllCardsPackable();
    const cardsByRarity = cardsPackable.reduce(
      (acc, card) => {
        if (!acc[card.rarity]) {
          acc[card.rarity] = [];
        }
        const cardLevel = get().collection.get(card.id)?.level || 1;
        acc[card.rarity].push(getCardFromLevel(card, cardLevel));
        return acc;
      },
      {
        common: [],
        rare: [],
        epic: [],
        legendary: [],
      } as Record<CardRarity, CardType[]>
    );
    return cardsByRarity;
  },
  addCardOrShardOrEvolve: (cardId: number) => {
    const collectionCard = get().getCollectionInfo(cardId);
    if (!collectionCard) {
      get().collection.set(cardId, { id: cardId, level: 1, shard: 0 });
    } else {
      const requiredShards = shardsByLevels[collectionCard.level - 1];
      if (collectionCard.shard === requiredShards - 1) {
        get().collection.set(cardId, {
          ...collectionCard,
          level: collectionCard.level + 1,
          shard: 0,
        });
      } else {
        get().collection.set(cardId, {
          ...collectionCard,
          shard: collectionCard.shard + 1,
        });
      }
    }
    set((state) => ({ collection: new Map(state.collection) }));
  },

  getAvailableBoosters: () => {
    return Object.values(boosters).map((booster) => {
      // if (booster.requirements.world && booster.requirements.world > get().currentWorld) return null;
      let boosterCardsPackable = get()
        .getAllCardsPackable()
        .map((card) => {
          const cardLevel = get().collection.get(card.id)?.level || 1;
          return getCardFromLevel(card, cardLevel);
        });
      boosterCardsPackable = boosterCardsPackable.filter((card) => {
        if (
          booster.requirements.world &&
          card.world > booster.requirements.world
        )
          return false;
        if (
          booster.requirements.rarity &&
          !booster.requirements.rarity.includes(card.rarity)
        )
          return false;
        return true;
      });
      // sort by rarity
      boosterCardsPackable.sort(
        (a, b) =>
          CardRarityOrder.indexOf(a.rarity) - CardRarityOrder.indexOf(b.rarity)
      );
      return { ...booster, cards: boosterCardsPackable };
    });
  },

  addGold: (amount: number) => set((state) => ({ gold: state.gold + amount })),
  spendGold: (amount: number) =>
    set((state) => ({ gold: state.gold - amount })),

  completeNextLevel: () =>
    set((state) => ({ lastCompletedLevel: state.lastCompletedLevel + 1 })),
}));

export default usePlayerStore;
