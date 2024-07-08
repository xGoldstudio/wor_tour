import { create } from "zustand";

export type RewardType = CardRewardType | GoldRewardType | ChestRewardType;

export interface CardRewardType {
  type: "card";
  cardId: number;
  level: number;
  shardTargetIndex: number | null;
}

export interface GoldRewardType {
  type: "gold";
  amount: number;
}

export interface ChestRewardType {
  type: "chest";
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
