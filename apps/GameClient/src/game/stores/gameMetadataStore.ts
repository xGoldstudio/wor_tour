import { findCard } from "@/cards";
import { create } from "zustand";
import { CardType } from "@repo/lib";
import { CurrentWinner, GameStateObjectConstructor } from "game_engine";
import usePlayerStore from "@/home/store/playerStore/playerStore";

export interface GameRewards {
  player: GameReward;
  opponent: GameReward;
  draw: GameReward;
}

export interface GameReward {
  money: number;
  trophies: number;
}

interface GameInterfaceStore {
  isInGame: boolean;
  playerCards: CardType[];
  opponentCards: CardType[];
  playerHp: number;
  opponentHp: number;
  rewards: GameRewards,
  currentGameWorld: number;
  getInGameInitData: () => GameStateObjectConstructor;
  setIsInGame: (isInGame: boolean) => void;
  setInGameData: (
    playerCards: CardType[],
    opponentCards: CardType[],
    playerHp: number,
    opponentHp: number,
    rewards: GameRewards,
  ) => void;
  reset: () => void;
  getReward: (currentWinner: CurrentWinner) => GameReward;
}

const useGameMetadataStore = create<GameInterfaceStore>()((set, get) => ({
  isInGame: false,
  playerCards: [],
  opponentCards: [],
  playerHp: 1000,
  opponentHp: 1000,
  rewards: {
    player: {
      money: 0,
      trophies: 0
    },
    opponent: {
      money: 0,
      trophies: 0
    },
    draw: {
      money: 0,
      trophies: 0
    },
  },
  currentGameWorld: 1,
  setInGameData: (
    playerCards: CardType[],
    opponentCards: CardType[],
    playerHp: number,
    opponentHp: number,
    gameRewards: GameRewards,
  ) => {
    set({
      playerCards,
      opponentCards,
      playerHp,
      opponentHp,
      isInGame: true,
      rewards: gameRewards,
      currentGameWorld: usePlayerStore.getState().currentWorld,
    });
  },
  getInGameInitData: () => ({
    playerDeck: [...get().playerCards.values()].map((card) => findCard(card.id, card.level)),
    opponentDeck: [...get().opponentCards.values()].map((card) => findCard(card.id, card.level)),
    playerHp: get().playerHp,
    opponentHp: get().opponentHp,
  }),
  setIsInGame: (isInGame: boolean) => set({ isInGame }),
  reset: () => set({ isInGame: false }),
  getReward: (currentWinner: CurrentWinner) => get().rewards[currentWinner ?? "draw"],
}));


export default useGameMetadataStore;