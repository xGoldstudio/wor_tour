import { create } from "zustand";
import usePlayerStore from "./playerStore";

type GolbalAnimationType = "money" | "trophy";

export interface GlobalAnimation {
	type: GolbalAnimationType;
	previousValue: number;
	amount: number;
	originRef?: HTMLElement | null;
	onEnd?: () => void;
}

interface AnimationStore {
	queue: GlobalAnimation[];
	addToQueue: (animation: GlobalAnimation) => void;
	clearQueue: () => GlobalAnimation[];

	addAnimation: (animation: GlobalAnimation) => void;
	addTrophiesAnimation: (value: number) => void;
}

const useAnimationStore = create<AnimationStore>()((set, get) => ({
	queue: [],
	addToQueue: (animation: GlobalAnimation) =>
		set((state) => ({ queue: [...state.queue, animation] })),
	clearQueue: () => {
		const queue = get().queue;
		set({ queue: [] });
		return queue;
	},
	addAnimation: (animation: GlobalAnimation) => {
		set((state) => ({ queue: [...state.queue, animation] }));
	},
	addTrophiesAnimation: (value: number) => {
		const currentTrophes = usePlayerStore.getState().trophies;
		set((state) => ({ queue: [...state.queue, { type: "trophy", previousValue: currentTrophes, amount: value }] }));
	},
}));

export default useAnimationStore;
