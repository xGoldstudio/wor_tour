import { create } from "zustand";

export interface RewardType {
  cardId: number;
  level: number;
  shardTargetIndex: number | null;
}

interface RewardStore {
  rewards: RewardType[];
  addReward: (reward: RewardType) => void;
  collectReward: () => RewardType;
}

const useRewardStore = create<RewardStore>()((set, get) => ({
  rewards: [],
  addReward: (reward: RewardType) =>
    set((state) => ({ rewards: [...state.rewards, reward] })),
  collectReward: () => {
    const [reward, ...rewards] = get().rewards;
    set({ rewards });
    return reward;
  },
}));

export default useRewardStore;
