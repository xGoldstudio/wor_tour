import { findCard } from "@/cards";
import usePlayerStore, { CollectionCard } from "@/home/store/playerStore";
import { CardType } from "@repo/ui";
import { create } from "zustand";
import useGameStore from "./gameStateStore";
import useAnimationStore from "@/home/store/animationStore";

export interface InGameInitData {
  playerDeck: CardType[];
  opponentDeck: CardType[];
  playerHp: number;
  opponentHp: number;
}

interface GameInterfaceStore {
  isInGame: boolean;
  playerCards: Map<number, CollectionCard>;
  opponentCards: Map<number, CollectionCard>;
  playerHp: number;
  opponentHp: number;
  rewards: {
    win: {
      money: number;
      trophies: number;
    },
    lose: {
      money: number;
      trophies: number;
    }
  },
  getInGameInitData: () => InGameInitData;
  findCard: (id: number, isPlayer: boolean) => CardType;
  setIsInGame: (isInGame: boolean) => void;
  setInGameData: (
    playerCards: Map<number, CollectionCard>,
    opponentCards: Map<number, CollectionCard>,
    playerHp: number,
    opponentHp: number
  ) => void;
  collectRewards: () => void;
  reset: () => void;
}

const useGameMetadataStore = create<GameInterfaceStore>()((set, get) => ({
  isInGame: false,
  playerCards: new Map<number, CollectionCard>(),
  opponentCards: new Map<number, CollectionCard>(),
  playerHp: 1000,
  opponentHp: 1000,
  rewards: {
    win: {
      money: 0,
      trophies: 0
    },
    lose: {
      money: 0,
      trophies: 0
    }
  },
  setInGameData: (
    playerCards: Map<number, CollectionCard>,
    opponentCards: Map<number, CollectionCard>,
    playerHp: number,
    opponentHp: number
  ) => {
    set({ playerCards, opponentCards, playerHp, opponentHp, isInGame: true, rewards: { win: { money: 250, trophies: 40 }, lose: { money: 50, trophies: -40 } } });
  },
  getInGameInitData: () => ({
    playerDeck: [...get().playerCards.values()].map((card) => findCard(card.id, card.level)),
    opponentDeck: [...get().opponentCards.values()].map((card) => findCard(card.id, card.level)),
    playerHp: get().playerHp,
    opponentHp: get().opponentHp,
  }),
  findCard: (id: number, isPlayer: boolean) => {
    const collectionCard = isPlayer
      ? get().playerCards.get(id)
      : get().opponentCards.get(id);
    if (collectionCard === undefined)
      throw new Error(`Card with id ${id} not found`);
    return findCard(collectionCard.id, collectionCard.level);
  },
  setIsInGame: (isInGame: boolean) => set({ isInGame }),
  collectRewards: () => {
    const rewards = get().rewards[useGameStore.getState().state.currentWinner === "player" ? "win" : "lose"];
    useAnimationStore.getState().addAnimation({
      type: "money",
      previousValue: usePlayerStore.getState().gold,
      amount: rewards.money,
    });
    if (rewards.trophies > 0) {
      useAnimationStore.getState().addAnimation({
        type: "trophy",
        previousValue: usePlayerStore.getState().trophies,
        amount: rewards.trophies,
      });
    } else {
      usePlayerStore.getState().setTrophies(rewards.trophies);
    }
  },
  reset: () => set({ isInGame: false }),
}));

export function useStartGame() {
  const { deck } = usePlayerStore((state) => ({ deck: state.deck }));
  const { setInGameData } = useGameMetadataStore((state) => ({
    setInGameData: state.setInGameData,
  }));

  function startGame() {
    const playerDeck = new Map<number, CollectionCard>();
    deck.forEach((cardId) => {
      playerDeck.set(
        cardId,
        usePlayerStore.getState().getCollectionInfo(cardId)!
      );
    });
    const opponentDeck = new Map<number, CollectionCard>(playerDeck);
    // const cardsPool = cards.filter(card => card.world === level.world);

    setInGameData(playerDeck, opponentDeck, 2000, 2000);
  }

  return startGame;
}

export default useGameMetadataStore;
