import { EventType } from "game_engine";
import { create } from "zustand";

interface GameInterfaceStore {
  cardSelected: null | number;
  setSelectedCard: (cardPosition: number) => void;
  unselectCard: () => void;

  cardTarget: number | null;
  setCardTarget: (target: number) => void;
  removeCardTarget: () => void;

  init: ({
    triggerEvent
  }: { triggerEvent: (event: EventType) => void }) => void;
}

const state = {
  cardSelected: null,
  cardTarget: null,
};

// This store is used to manage the game interface state (data exclusively and uniquely to the client side)
const useGameInterface = create<GameInterfaceStore>()((set) => ({
  ...state,

  setSelectedCard: (cardPosition: number) =>
    set({ cardSelected: cardPosition }),
  unselectCard: () => set({ cardSelected: null }),

  setCardTarget: (target: number) => set({ cardTarget: target }),
  removeCardTarget: () => set({ cardTarget: null }),

  init: () => set({ ...state }),
}));

export default useGameInterface;
