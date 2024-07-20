import { create } from "zustand";
import useGameMetadataStore from "./gameMetadataStore";
import { GameStateObject, InGameCardType } from "game_engine";

export interface GameStore {
  init: () => GameStateObject;
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
  init: () => {
    const newState = new GameStateObject(
      useGameMetadataStore.getState().getInGameInitData()
    );
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
