import { create } from 'zustand';

export interface RewardType {
	cardId: number;
	level: number;
	shardTargetIndex: number;
}

interface RewardStore {
	rewards: RewardType[];
	addReward: (reward: RewardType) => void;
	collectReward: () => RewardType;

	buyBooster: (name: string) => void;
}

const useRewardStore = create<RewardStore>()((set, get) => ({
	rewards: [],
	addReward: (reward: RewardType) => set((state) => ({ rewards: [...state.rewards, reward] })),
	collectReward: () => {
		const [reward, ...rewards] = get().rewards;
		set({ rewards });
		return reward;
	},
	buyBooster: (name: string) => {
		const cardId = 7;
		get().addReward({ cardId, level: 1, shardTargetIndex: 0 });
	}
}));



export default useRewardStore;