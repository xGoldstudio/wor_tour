import { create } from 'zustand'

interface GameInterfaceStore {
  cardSelected: null | number;
  setSelectedCard: (cardPosition: number) => void;
  unselectCard: () => void;

  cardTarget: number | null;
  setCardTarget: (target: number) => void;
  removeCardTarget: () => void;

  getData: () => GameInterfaceStore;
}

const useGameInterface = create<GameInterfaceStore>()((set, get) => ({
  cardSelected: null,
  setSelectedCard: (cardPosition: number) => set({ cardSelected: cardPosition }),
  unselectCard: () => set({ cardSelected: null }),

  cardTarget: null,
  setCardTarget: (target: number) => set({ cardTarget: target }),
  removeCardTarget: () => set({ cardTarget: null }),

  getData: get
}));

export default useGameInterface;