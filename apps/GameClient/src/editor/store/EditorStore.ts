import { CardRarity } from "@/cards";
import { create } from "zustand";
import { CardStat, EditorData, World } from "../type/type";

interface EditorStore {
  cards: CardStat[];
  worlds: World[];
  getCard: (id: number) => CardStat | undefined;
  updateCard: (id: number) => (card: Partial<CardStat>) => void;
  deleteCard: (id: number) => void;
  initData: (object: Partial<EditorData>) => void;
  getEdtiorData: () => EditorData;
  isEditorStale: boolean;
  removeStale: () => void;

  getCardsByWorld: (world: number) => CardStat[];

  addWorld: () => number;
  removeLastWorld: (id: number) => void;
  setWorld: (id: number) => (world: Partial<World>) => void;
  getWorld: (id: number) => World | undefined;
}

const useEditorStore = create<EditorStore>()((set, get) => ({
  cards: [],
  worlds: [],
  isEditorStale: false,
  getCard: (id: number) => get().cards.find((card) => card.id === id),
  updateCard: (id: number) => {
    return (card: Partial<CardStat>) =>
      set((state) => ({
        cards: state.cards.map((c) => (c.id === id ? { ...c, ...card } : c)),
        isEditorStale: true,
      }));
  },
  deleteCard: (id: number) => {
    set((state) => ({
      cards: state.cards
        .filter((card) => card.id !== id)
        .map((card) => ({ ...card, id: card.id > id ? card.id - 1 : card.id })),
      isEditorStale: true,
    }));
  },
  initData: (object: Partial<EditorData>) => {
    set((state) => ({
      cards: object.cards || state.cards,
      worlds: object.worlds || state.worlds,
      isEditorStale: false,
    }));
  },
  getEdtiorData: () => {
    return {
      cards: get().cards,
      worlds: get().worlds,
    };
  },
  removeStale: () => {
    set({ isEditorStale: false });
  },
  getCardsByWorld: (world: number) =>
    get().cards.filter((card) => card.world === world),
  addWorld: () => {
    const worldId = get().worlds.length + 1;
    set((state) => ({
      worlds: [
        ...state.worlds,
        {
          id: worldId,
          name: "New world",
          illustration: null,
          cardBackground: null,
          levels: [
            { id: 1, world: 1, reward: { gold: 0, xp: 0 }, strength: 0 },
          ],
          description: "New world description",
        },
      ],
      cards: [...state.cards, ...createCardsForWorld(worldId)],
      isEditorStale: true,
    }));
    return worldId;
  },
  removeLastWorld: () => {
    const id = get().worlds.length;
    set((state) => ({
      worlds: state.worlds
        .filter((world) => world.id !== id)
        .map((world) => ({
          ...world,
          id: world.id > id ? world.id - 1 : world.id,
        })),
      cards: state.cards.filter((card) => card.world !== id),
      isEditorStale: true,
    }));
  },
  getWorld: (id: number) => get().worlds.find((world) => world.id === id),
  setWorld: (id: number) => {
    return (world: Partial<World>) =>
      set((state) => ({
        worlds: state.worlds.map((w) => (w.id === id ? { ...w, ...world } : w)),
        isEditorStale: true,
      }));
  },
}));

export default useEditorStore;

function createCardsForWorld(world: number): CardStat[] {
  let cardId = (world - 1) * 15 + 1;
  const cards = [];
  const shape: Record<CardRarity, number> = {
    common: 8,
    rare: 4,
    epic: 2,
    legendary: 1,
  };
  for (const rarity in shape) {
    for (let i = 0; i < shape[rarity as CardRarity]; i++) {
      cards.push(createCard(world, i + 1, cardId, rarity as CardRarity));
      cardId++;
    }
  }
  return cards;
}

function createCard(
  world: number,
  position: number,
  id: number,
  rarity: CardRarity,
): CardStat {
  return {
    id,
    name: `${rarity} card ${position}`,
    rarity,
    world: world,
    attackDefenseRatio: 0.5,
    speedDamageRatio: 0.5,
    stats: [
      { cost: 1, effects: {}, illustration: null },
      { cost: 1, effects: {}, illustration: null },
      { cost: 1, effects: {}, illustration: null },
    ],
  };
}
