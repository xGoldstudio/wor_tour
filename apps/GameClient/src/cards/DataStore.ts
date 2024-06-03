import { create } from "zustand";
import { EditorData, World } from "@repo/types";
import { CardStatsInfo, CardStatsInfoLevel, getStats } from "@repo/ui";

interface DataStore {
  cards: CardStatsInfo[];
  worlds: World[];
  getWorld: (id: number) => World | undefined;
  init: (data: EditorData) => void;
}

const useDataStore = create<DataStore>()((set, get) => ({
  cards: [],
  worlds: [],
  getWorld: (id: number) => {
    return get().worlds.find((w) => w.id === id);
  },
  init: (data: EditorData) => {
    set({
      worlds: data.worlds,
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
