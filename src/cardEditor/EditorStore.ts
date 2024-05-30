import { CardStat } from "./CardEditor";
import { create } from "zustand";

interface EditorStore {
	cards: CardStat[];
	getCard: (id: number) => CardStat | undefined;
	updateCard: (id: number) => (card: Partial<CardStat>) => void;
	addCard: () => number;
	deleteCard: (id: number) => void;
	initData: (object: Partial<EditorData>) => void;
	getEdtiorData: () => EditorData;
	isEditorStale: boolean;
	removeStale: () => void;
}

interface EditorData {
	cards: CardStat[];
}

const useEditorStore = create<EditorStore>()((set, get) => ({
	cards: [],
	isEditorStale: false,
	getCard: (id: number) => get().cards.find((card) => card.id === id),
	updateCard: (id: number) => {
		return (card: Partial<CardStat>) => set((state) => ({
			cards: state.cards.map((c) => (c.id === id ? { ...c, ...card } : c)),
			isEditorStale: true,
		}));
	},
	addCard: () => {
		const id = get().cards.length + 1;
		set((state) => ({
			cards: [...state.cards, { id, name: "New card", rarity: "common", world: 1, attackDefenseRatio: 0.5, speedDamageRatio: 0.5, stats: [{ cost: 1, effects: {} }, { cost: 1, effects: {} }, { cost: 1, effects: {} }] }],
			isEditorStale: true,
		}));
		return id;
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
		console.log(object);
		set((state) => ({
			cards: object.cards || state.cards,
		}));
	},
	getEdtiorData: () => {
		return {
			cards: get().cards,
		};
	},
	removeStale: () => {
		set({ isEditorStale: false });
	}
}));

export default useEditorStore;