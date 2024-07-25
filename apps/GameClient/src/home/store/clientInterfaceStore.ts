import { create } from "zustand";
import { AllWorldsStateType } from "../pages/home/allWorlds/AllWorlds";

type WorldsModalOpen = AllWorldsStateType | false;

interface ClientInterfaceStore {
  worldsModalOpen: WorldsModalOpen;
  setWorldsModalOpen: (value: WorldsModalOpen) => void;
}

const useClientInterfaceStore = create<ClientInterfaceStore>()((set) => ({
	worldsModalOpen: false,
	setWorldsModalOpen: (value: WorldsModalOpen) => set({ worldsModalOpen: value }),
}));

export default useClientInterfaceStore;
