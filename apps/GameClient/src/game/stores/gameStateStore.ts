import { create } from "zustand";
import useGameMetadataStore from "./gameMetadataStore";
import { GameStateObject } from "../gameBehavior/gameEngine/gameState";
import { CardRarity, CardState } from "@repo/ui";

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

export type InGameCardType = {
  id: number;
  instanceId: number;
  maxHp: number;
  hp: number;
  dmg: number;
  attackSpeed: number;
  startAttackingTick: number | null;
  rarity: CardRarity;
  states: CardState[];
  illustration: string;
  worldIllustration: string;
};


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
