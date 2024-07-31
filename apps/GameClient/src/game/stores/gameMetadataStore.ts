import { findCard } from "@/cards";
import { create } from "zustand";
import useGameStore from "./gameStateStore";
import useAnimationStore from "../../home/store/animationStore";
import { CardType, getTargetStrength } from "@repo/lib";
import useClientInterfaceStore from "@/home/store/clientInterfaceStore";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { GameStateObjectConstructor } from "game_engine";

interface GameInterfaceStore {
  isInGame: boolean;
  playerCards: CardType[];
  opponentCards: CardType[];
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
  getInGameInitData: () => GameStateObjectConstructor;
  setIsInGame: (isInGame: boolean) => void;
  setInGameData: (
    playerCards: CardType[],
    opponentCards: CardType[],
    playerHp: number,
    opponentHp: number
  ) => void;
  collectRewards: () => void;
  reset: () => void;
}

const useGameMetadataStore = create<GameInterfaceStore>()((set, get) => ({
  isInGame: false,
  playerCards: [],
  opponentCards: [],
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
    playerCards: CardType[],
    opponentCards: CardType[],
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
        onEnd: () => useClientInterfaceStore.getState().setWorldsModalOpen(hasChangeWorldOrTier),
      });
    }
    const hasChangeWorldOrTier = usePlayerStore.getState().addOrRemoveTrophies(rewards.trophies);
    usePlayerStore.getState().addGold(rewards.money);
  },
  reset: () => set({ isInGame: false }),
}));

export function useStartGame() {
  const { deck } = usePlayerStore((state) => ({ deck: state.deck }));
  const { setInGameData } = useGameMetadataStore((state) => ({
    setInGameData: state.setInGameData,
  }));

  function startGame() {
    const playerDeck: CardType[] = deck.map((cardId) => findCard(cardId, usePlayerStore.getState().getCollectionInfo(cardId)!.level));
    const opponentTargetStrength = usePlayerStore.getState().getCurrentTier().level.strength;
    const opponentDeck = buildDeckFromStrengthTarget(opponentTargetStrength);
    // const cardsPool = cards.filter(card => card.world === level.world);
    setInGameData(playerDeck, opponentDeck, getHpFromDeck(playerDeck), getHpFromDeck(opponentDeck));
  }

  return startGame;
}

export default useGameMetadataStore;

function getHpFromDeck(deck: CardType[]) {
  return Math.round(getDeckStrength(deck) * 100);
}

function getDeckStrength(deck: CardType[]) {
  return deck.reduce((acc, card) => acc + getTargetStrength(card), 0);
}

function buildDeckFromStrengthTarget(strength: number) {
  console.log(strength)
  const cardsId = [1, 2, 3, 4, 5, 6, 7, 8];
  return cardsId.map(cardId => findCard(cardId, 1));
}