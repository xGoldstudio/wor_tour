import { create } from "zustand";
import useGameMetadataStore from "./gameMetadataStore";
import { CardEffects, CardRarity } from "@repo/types";
import { GameStateObject } from "../gameBehavior/gameEngine/gameState";
import { CardType } from "@repo/ui";

export interface GameStore {
  init: () => GameStateObject;
  state: GameStateObject;
  playerHp: number;
  opponentHp: number;
  playerDeck: CardType[];
  playerHand: (CardType | null)[];
  playerMana: number;
  opponentMana: number;
  playerBoard: (InGameCardType | null)[];
  opponentBoard: (InGameCardType | null)[];
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
  effects: CardEffects;
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
    set({
      playerHp: newState.playerHp,
      opponentHp: newState.opponentHp,
      playerDeck: newState.playerDeck,
      playerHand: newState.playerHand,
      playerMana: newState.playerMana,
      opponentMana: newState.opponentMana,
      playerBoard: newState.playerBoard,
      opponentBoard: newState.opponentBoard,
    })
    return newState;
  },
  state: new GameStateObject({
    playerDeck: [],
    opponentDeck: [],
    playerHp: 0,
    opponentHp: 0,
  }),
  playerHp: 0,
  opponentHp: 0,
  playerDeck: [],
  playerHand: [],
  playerMana: 0,
  opponentMana: 0,
  playerBoard: [],
  opponentBoard: [],
}));

export default useGameStore;
