import { create } from "zustand";

interface GameInterfaceStore {
  cardSelected: null | number;
  setSelectedCard: (cardPosition: number) => void;
  unselectCard: () => void;

  cardTarget: number | null;
  setCardTarget: (target: number) => void;
  removeCardTarget: () => void;

  isClockRunning: boolean;
  setIsClockRunning: (value: boolean) => void;

  getData: () => GameInterfaceStore;
  init: () => void;
}

const state = {
  cardSelected: null,
  cardTarget: null,
  isClockRunning: false,
};

// This store is used to manage the game interface state (data exclusively and uniquely to the client side)
const useGameInterface = create<GameInterfaceStore>()((set, get) => ({
  ...state,

  setSelectedCard: (cardPosition: number) =>
    set({ cardSelected: cardPosition }),
  unselectCard: () => set({ cardSelected: null }),

  setCardTarget: (target: number) => set({ cardTarget: target }),
  removeCardTarget: () => set({ cardTarget: null }),

  setIsClockRunning: (value: boolean) => set({ isClockRunning: value }),

  getData: get,
  init: () => set({ ...state }),
}));

export default useGameInterface;
