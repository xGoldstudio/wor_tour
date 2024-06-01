import { CardStatsInfo, CardStatsInfoLevel } from ".";
import { create } from "zustand";
import { getStats } from "@/editor/getStats";
import { EditorData, World } from "@/editor/type/type";

interface DataStore {
  cards: CardStatsInfo[];
  worlds: World[];
  init: (data: EditorData) => void;
}

const useDataStore = create<DataStore>()((set) => ({
  cards: [],
  worlds: [],
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
