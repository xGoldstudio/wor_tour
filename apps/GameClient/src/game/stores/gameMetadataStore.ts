import { findCard } from "@/cards";
import { create } from "zustand";
import { CardType } from "@repo/lib";
import { GameStateObjectConstructor } from "game_engine";

export interface GameRewards {
  win: GameReward;
  lose: GameReward;
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
    opponentHp: number,
    gameRewards: GameRewards,
  ) => {
    set({ playerCards, opponentCards, playerHp, opponentHp, isInGame: true, rewards: gameRewards });
  },
  getInGameInitData: () => ({
    playerDeck: [...get().playerCards.values()].map((card) => findCard(card.id, card.level)),
    opponentDeck: [...get().opponentCards.values()].map((card) => findCard(card.id, card.level)),
    playerHp: get().playerHp,
    opponentHp: get().opponentHp,
  }),
  setIsInGame: (isInGame: boolean) => set({ isInGame }),
  reset: () => set({ isInGame: false }),
}));


export default useGameMetadataStore;