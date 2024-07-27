import { create } from "zustand";
import { CardStatsInfo, CardStatsInfoLevel, EditorData, getStats } from "@repo/lib";

interface DataStore {
  cards: CardStatsInfo[];
  worlds: World[];
  getWorld: (id: number) => World | undefined;
  init: (data: EditorData) => void;
}

export interface World {
  id: number;
  illustration: string | null;
  cardBackground: string | null;
  name: string;
  description: string;
}

const useDataStore = create<DataStore>()((set, get) => ({
  cards: [],
  worlds: [],
  getWorld: (id: number) => {
    return get().worlds.find((w) => w.id === id);
  },
  init: (data: EditorData) => {
    set({
      worlds: data.worlds.map(world => ({
        ...world,
      })),
      cards: data.cards.map((card) => ({
        ...card,
        stats: card.stats.map((_, index) => {
          const s = getStats(card, index + 1);
          return s;
        }) as [CardStatsInfoLevel, CardStatsInfoLevel, CardStatsInfoLevel],
      })),
    });
  },
}));

export default useDataStore;
