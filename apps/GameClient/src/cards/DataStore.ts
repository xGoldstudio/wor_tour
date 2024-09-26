import { create } from "zustand";
import { CardStatsInfo, CardStatsInfoLevel, EditorData } from "@repo/lib";
import { persist } from "zustand/middleware";
import { getStats } from "game_engine";

interface DataStore {
  cards: CardStatsInfo[]; // mapper en cardtype!
  worlds: World[];
  getWorld: (id: number) => World | undefined;
  init: (data: EditorData) => void;
  data: EditorData | null;
  isPvp: boolean;
  setIsPvp: (isPvp: boolean) => void;
}

export interface World {
  id: number;
  illustration: string | null;
  cardBackground: string | null;
  name: string;
  description: string;
}

const useDataStore = create(persist<DataStore>((set, get) => ({
  cards: [],
  worlds: [],
  getWorld: (id: number) => {
    return get().worlds.find((w) => w.id === id);
  },
  isPvp: false,
  data: null,
  init: (data: EditorData) => {
    set({
      worlds: data.worlds.map((world) => ({
        ...world,
      })),
      cards: data.cards.map((card) => ({
        ...card,
        stats: card.stats.map((_, index) => {
          const s = getStats(card, index + 1, get().isPvp);
          return s;
        }) as [CardStatsInfoLevel, CardStatsInfoLevel, CardStatsInfoLevel],
      })),
      data: data,
    });
  },
  setIsPvp: (isPvp: boolean) => {
    const data = get().data;
    set({ isPvp });
    if (data) {
      get().init(data);
    }
  }
}), { name: "data-store" }));

export default useDataStore;
