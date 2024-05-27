import { create } from 'zustand'

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
}

const useGameInterface = create<GameInterfaceStore>()((set, get) => ({
  cardSelected: null,
  setSelectedCard: (cardPosition: number) => set({ cardSelected: cardPosition }),
  unselectCard: () => set({ cardSelected: null }),

  cardTarget: null,
  setCardTarget: (target: number) => set({ cardTarget: target }),
  removeCardTarget: () => set({ cardTarget: null }),

  isClockRunning: true,
  setIsClockRunning: (value: boolean) => set({ isClockRunning: value }),

  getData: get,
}));

export default useGameInterface;