import { create } from "zustand";
import { Tier, getTierFromLevel } from "./tiers";
import { findCard } from "../../cards/index";
import { CardType } from "@repo/lib";
import { levels } from "@repo/ui";

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
  numberOfCardsInDeck: number;

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

  getAllCardsLocked: () => (CardType & { isInDeck: boolean })[];
  getTheLockPattern: (id: number) => number;
  getAllCardsPackable: () => CardStatsInfo[];
  getAllCardsPackableByRarity: () => Record<CardRarity, CardType[]>;
  isCardPackable: (id: number) => CardType | null;

  addCardOrShardOrEvolve: (cardId: number) => void;

  addGold: (amount: number) => void;
  spendGold: (amount: number) => void;

  trophies: number;
  maxTrophies: number;
  setTrophies: (amount: number) => false | "tier" | "world";

  tiers: Map<number, Tier>;
  currentTier: number;
  collectTierReward: (tierNumber: number) => Tier | null;
}

const defaultCollection: Map<number, CollectionCard> = new Map();
// to 75
for (let i = 1; i <= 69; i++) {
  defaultCollection.set(i, { id: i, level: 1, shard: 0 });
}

const shardsByLevels = [3, 7];

const usePlayerStore = create<PlayerStore>()((set, get) => ({
  numberOfCardsInDeck: 8,
  collection: defaultCollection,
  currentWorld: 1,
  deck: [1, 2, 3, 4, 5, 6, 7, 8],
  gold: 0,
  getCollection: () => Array.from(get().collection.values()),
  getCollectionInfo: (id: number) =>
    get().collection.has(id) ? get().collection.get(id) : undefined,
  // getInfoOnCard: (id: number) => {return useDataStore.getState().cards.find((card) => card.id === id)},
  getCompleteInfo: (id: number) => {
    const cardLevel = get().getCollectionInfo(id)
      ? get().getCollectionInfo(id)!.level
      : 1;
    return {
      ...findCard(id, cardLevel),
      isInDeck: get().deck.includes(id),
    };
  },
  getCollectionCompleteInfo: (collection: CollectionCard[]) =>
    collection.map((card) => get().getCompleteInfo(card.id)),
  lastCompletedLevel: -1,
  trophies: 0,
  maxTrophies: 0,
  tiers: (() => {
    const tierState = new Map<number, Tier>();
    levels.forEach((level) => {
      tierState.set(level.id, getTierFromLevel(level));
    });
    return tierState;
  })(),
  currentTier: 0,

  removeCardFromDeck: (id: number) =>
    set((state) => ({
      deck: state.deck.filter((cardId) => cardId !== id),
      numberOfCardsInDeck: state.numberOfCardsInDeck - 1,
    })),
  addCardToDeck: (id: number) =>
    set((state) => ({
      deck: [...state.deck, id],
      numberOfCardsInDeck: state.numberOfCardsInDeck + 1,
    })),
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
  getAllCardsLocked: () => {
    return useDataStore
      .getState()
      .cards.filter((card) => {
        return !get().collection.has(card.id);
      })
      .map((card) => ({ ...getCardFromLevel(card, 1), isInDeck: false }));
  }, // mapper en cardType!
  getTheLockPattern: (id: number) => {
    const card = getCardStats(id);
    if (card.world > get().currentWorld) return card.world;
    else return 0;
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


  addGold: (amount: number) => {
    set((state) => ({ gold: state.gold + amount }));
  },
  spendGold: (amount: number) =>
    set((state) => ({ gold: state.gold - amount })),

  setTrophies: (amount: number) => updateTrophies(set, amount),

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
  }
}));

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
