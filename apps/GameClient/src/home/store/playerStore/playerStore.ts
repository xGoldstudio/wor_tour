import { create } from "zustand";
import { Tier } from "../tiers";
import { CardType } from "@repo/lib";
import { persist } from "zustand/middleware";
import { defaultPlayerStoreData } from "./defaultData";
import { findCard, getCardFromLevel, getCardStats } from "@/cards";
import useDataStore from "@/cards/DataStore";

export interface CollectionCard {
  id: number;
  level: number;
  shard: number;
}

interface PlayerStore {
  collection: Map<number, CollectionCard>;
  deck: number[];
  currentWorld: number;
  gold: number;
  trophies: number;
  maxTrophies: number;
  currentTier: number;
  tiers: Map<number, Tier>;
  isInit: boolean;

  numberOfCardsInDeck: number;
  currentMissingCards: number[];

  getCollection: () => CollectionCard[];
  getCollectionInfo: (id: number) => CollectionCard | undefined;
  getCompleteInfo: (id: number) => CardType & { isInDeck: boolean };
  getCollectionCompleteInfo: (
    collection: CollectionCard[]
  ) => (CardType & { isInDeck: boolean })[];
  getCollectionNotInDeck: (
    collection: CollectionCard[]
  ) => (CardType & { isInDeck: boolean })[];
  removeCardFromDeck: (id: number) => void;
  addCardToDeck: (id: number) => void;
  isDeckFull: () => boolean;
  isPlayed: (cardId: number) => boolean;

  getAllCardsLocked: () => (CardType & { isInDeck: boolean })[];
  getTheLockPattern: (id: number) => number;

  addCardOrShardOrEvolve: (cardId: number) => void;

  addGold: (amount: number) => void;
  spendGold: (amount: number) => void;

  addOrRemoveTrophies: (amount: number) => false | "tier" | "world";

  collectTierReward: (tierNumber: number) => Tier | null;
  getCurrentTier: () => Tier;
  getPreviousTier: () => Tier;
  getNextTier: () => Tier;
}

const shardsByLevels = [3, 7];

const usePlayerStore = create(
  persist<PlayerStore, [], [], PersistedDataPlayerStore>(
    (set, get) => ({
      ...defaultPlayerStoreData,

      getCollection: () => Array.from(get().collection.values()),
      getCollectionInfo: (id: number) => get().collection.get(id),
      getCompleteInfo: (id: number) => ({
        ...findCard(id, get().getCollectionInfo(id)!.level),
        isInDeck: get().deck.includes(id),
      }),
      getCollectionCompleteInfo: (collection: CollectionCard[]) =>
        collection.map((card) => get().getCompleteInfo(card.id)),
      getCollectionNotInDeck: (collection: CollectionCard[]) =>
        collection
          .map((card) => get().getCompleteInfo(card.id))
          .filter((card) => !get().deck.includes(card.id)),


      removeCardFromDeck: (id: number) =>
        set((state) => {
          const index = state.deck.findIndex((cardId) => cardId === id);
          state.deck.splice(index, 1, 0);

          return {
            deck: [...state.deck],
            numberOfCardsInDeck: state.numberOfCardsInDeck - 1,
          };
        }),
      addCardToDeck: (id: number) =>
        set((state) => {
          state.deck.splice(
            state.deck.findIndex((id) => id === 0),
            1,
            id
          );
          return {
            deck: [...state.deck],
            numberOfCardsInDeck: state.numberOfCardsInDeck + 1,
          };
        }),
      isDeckFull: () => get().numberOfCardsInDeck >= 8,
      isPlayed: (cardId: number) => get().deck.includes(cardId),

      getAllCardsLocked: () => {
        return useDataStore
          .getState()
          .cards.filter((card) => {
            return !get().collection.has(card.id);
          })
          .map((card) => ({ ...getCardFromLevel(card, 1), isInDeck: false }));
      },
      getTheLockPattern: (id: number) => {
        const card = getCardStats(id);
        if (card.world > get().currentWorld) return card.world;
        else return 0;
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


      addGold: (amount: number) => {
        set((state) => ({ gold: state.gold + amount }));
      },
      spendGold: (amount: number) =>
        set((state) => ({ gold: state.gold - amount })),

      addOrRemoveTrophies: (amount: number) => updateTrophies(set, amount),

      collectTierReward: (tierNumber: number) => {
        let result: Tier | null = null;
        set((state) => {
          let tier = state.tiers.get(tierNumber);
          if (!tier || !tier.isUnlocked || tier.isOpen) return {};
          result = tier;
          tier.isOpen = true;
          tier = { ...tier };
          return { tiers: new Map(state.tiers) };
        });
        return result;
      },
      getCurrentTier: () => get().tiers.get(get().currentTier) || get().tiers.get(1)!,
      getPreviousTier: () => get().tiers.get(get().currentTier - 1) || get().tiers.get(1)!,
      getNextTier: () => get().tiers.get(get().currentTier + 1) || get().tiers.get(1)!,
    }), {
    name: "player",
    partialize: (state) => ({
      collection: Array.from(state.collection.entries()),
      currentWorld: state.currentWorld,
      deck: state.deck,
      gold: state.gold,
      trophies: state.trophies,
      maxTrophies: state.maxTrophies,
      currentTier: state.currentTier,
      tiers: Array.from(state.tiers.entries()),
      isInit: state.isInit,
      numberOfCardsInDeck: state.numberOfCardsInDeck,
      currentMissingCards: state.currentMissingCards,
    }),
    merge: (persisted, current) => {
      const persistedData = persisted as PersistedDataPlayerStore;
      return {
        ...current,
        ...persistedData,
        collection: new Map(persistedData.collection),
        tiers: new Map(persistedData.tiers),
      };
    },
  }));

interface PersistedDataPlayerStore {
  collection: [number, CollectionCard][];
  currentWorld: number;
  deck: number[];
  gold: number;
  trophies: number;
  maxTrophies: number;
  currentTier: number;
  tiers: [number, Tier][];
  isInit: boolean;
}

function updateTrophies(set: (state: (s: PlayerStore) => Partial<PlayerStore>) => void, difference: number): false | "tier" | "world" {
  let result: false | "tier" | "world" = false;
  set((state) => {
    const nextTrophies = Math.max(0, state.trophies + difference);
    const currentTierValue = state.tiers.get(state.currentTier);
    const nextTierValue = state.tiers.get(state.currentTier + 1);
    const previousTierValue = state.tiers.get(state.currentTier - 1);
    let nextTier = state.currentTier;
    let tierState = state.tiers;
    if (currentTierValue && nextTierValue && nextTierValue.level.trophyStart <= nextTrophies) {
      nextTier = nextTierValue.tier;
      nextTierValue.isUnlocked = true;
      tierState = new Map(tierState);
      if (state.maxTrophies < nextTierValue.level.trophyStart) {
        result = nextTierValue.isWorld ? "world" : "tier";
      }
    } else if (currentTierValue && previousTierValue && currentTierValue.level.trophyStart > nextTrophies) {
      nextTier = previousTierValue.tier;
    }
    return ({ trophies: nextTrophies, maxTrophies: Math.max(nextTrophies, state.maxTrophies), currentTier: nextTier, tiers: tierState, currentWorld: tierState.get(nextTier)!.world });
  });
  return result;
}

export default usePlayerStore;
