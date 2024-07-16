import { create } from "zustand";
import { EditorData } from "@repo/types";
import {
  CardStatsInfo,
  CardStatsInfoLevel,
  CardType,
  getStats,
} from "@repo/ui";
import { getCardFromLevel } from ".";

interface DataStore {
  cards: CardStatsInfo[]; // mapper en cardtype!
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
      worlds: data.worlds.map((world) => ({
        ...world,
      })),
      cards: data.cards.map((card) => ({
        ...card,
        stats: card.stats.map((_, index) => {
          const s = getStats(card, index + 1);
          return s;
        }) as [CardStatsInfoLevel, CardStatsInfoLevel, CardStatsInfoLevel],
      })),
      // .map((card) => getCardFromLevel(card, 1)),
    });
  },
}));

export default useDataStore;
