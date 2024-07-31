import { create } from "zustand";
import { GameStateObject, InGameCardType } from "game_engine";

export interface GameStore {
  init: (newState: GameStateObject) => GameStateObject;
  state: GameStateObject;
}

export interface GameAnimation {
  onTick: number;
  animationDuration: number;
  data: DeathAnimation;
}

interface DeathAnimation {
  card: InGameCardType;
}

export type Animation3dType = "attack" | "heal";

const useGameStore = create<GameStore>()((set) => ({
  init: (newState: GameStateObject) => {
    set({
      state: newState,
    });
    return newState;
  },
  state: new GameStateObject({
    playerDeck: [],
    opponentDeck: [],
    playerHp: 0,
    opponentHp: 0,
  }),
}));

export default useGameStore;
