import useDataStore from "@/cards/DataStore";
import { findCard, getCardFromLevel, getCardStats } from "@/cards";
import { create } from "zustand";
import { BoosterType, boosters } from "./useBooster";
import { CardRarity } from "@repo/types";
import { CardRarityOrder, CardStatsInfo, CardType } from "@repo/ui";
import useAnimationStore from "./animationStore";

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

  getAllCardsLocked: () => CardStatsInfo[];
  getTheLockPattern: (id: number) => number;
  getAllCardsPackable: () => CardStatsInfo[];
  getAllCardsPackableByRarity: () => Record<CardRarity, CardType[]>;
  isCardPackable: (id: number) => CardType | null;

  addCardOrShardOrEvolve: (cardId: number) => void;

  getAvailableBoosters: () => BoosterType[];

  addGold: (amount: number) => void;
  spendGold: (amount: number) => void;

  trophies: number;
  maxTrophies: number;
  addTrophies: (amount: number) => void;
  removeTrophies: (amount: number) => void;

  toCollectTrophiesRewards: Set<number>;
  collectedTrophiesReward: (reward: number) => void;
  getIsToCollectTrophiesReward: (reward: number) => boolean;
}

const defaultCollection: Map<number, CollectionCard> = new Map();
// to 75
for (let i = 1; i <= 69; i++) {
  defaultCollection.set(i, { id: i, level: 1, shard: 0 });
}

const shardsByLevels = [3, 7];

const usePlayerStore = create<PlayerStore>()((set, get) => ({
  collection: defaultCollection,
  currentWorld: 1,
  deck: [1, 2, 3, 4, 5, 6, 7, 8],
  gold: 0,
  getCollection: () => Array.from(get().collection.values()),
  getCollectionInfo: (id: number) => get().collection.get(id),
  getCompleteInfo: (id: number) => ({
    ...findCard(id, get().getCollectionInfo(id).level),
    isInDeck: get().deck.includes(id),
  }),
  getCollectionCompleteInfo: (collection: CollectionCard[]) =>
    collection.map((card) => get().getCompleteInfo(card.id)),
  lastCompletedLevel: -1,
  trophies: 0,
  maxTrophies: 0,
  toCollectTrophiesRewards: new Set(),

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
  getAllCardsLocked: () => {
    return useDataStore.getState().cards.filter((card) => {
      return !get().collection.has(card.id);
    });
  },
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

  addGold: (amount: number) => {
    useAnimationStore.getState().addAnimation({
      type: "money",
      previousValue: get().gold,
      amount,
    });
    set((state) => ({ gold: state.gold + amount }));
  },
  spendGold: (amount: number) =>
    set((state) => ({ gold: state.gold - amount })),

  addTrophies: (amount: number) => {
    useAnimationStore.getState().addAnimation({
      type: "trophy",
      previousValue: get().trophies,
      amount,
    });
    set((state) => updateTrophies(state, amount));
  },
  removeTrophies: (amount: number) =>
    set((state) => updateTrophies(state, -amount)),

  collectedTrophiesReward: (reward: number) => {
    set((state) => {
      const toCollectTrophiesRewards = new Set(state.toCollectTrophiesRewards);
      toCollectTrophiesRewards.delete(reward);
      return { toCollectTrophiesRewards };
    });
  },
  getIsToCollectTrophiesReward: (reward: number) =>
    get().toCollectTrophiesRewards.has(reward),
}));

function updateTrophies(state: PlayerStore, difference: number) {
  const nextTrophies = Math.max(0, state.trophies + difference);
  const resObject = {
    trophies: nextTrophies,
    currentWorld: Math.min(4, Math.floor(nextTrophies / 1000)) + 1,
    maxTrophies: Math.max(nextTrophies, state.maxTrophies),
  };
  const nextStage = Math.floor(nextTrophies / 100);
  const maxStage = Math.floor(state.maxTrophies / 100);
  if (nextTrophies > state.maxTrophies && nextStage > maxStage) {
    const stageDiff = nextStage - maxStage;
    return {
      ...resObject,
      toCollectTrophiesRewards: new Set([
        ...state.toCollectTrophiesRewards,
        ...Array.from(
          { length: stageDiff },
          (_, i) => (maxStage + i + 1) * 100
        ),
      ]),
    };
  }
  return resObject;
}

export default usePlayerStore;
