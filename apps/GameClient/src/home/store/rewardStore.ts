import { create } from "zustand";
import { persist } from "zustand/middleware";

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


export function initRewardStore() {
  useRewardStore.setState({ ...RewardStoreDefaultState });
}

const RewardStoreDefaultState = {
  rewards: [],
}

interface RewardStore {
  rewards: RewardType[];
  addReward: (reward: RewardType) => void;
  collectReward: () => RewardType;
}

const useRewardStore = create(persist<RewardStore>((set, get) => ({
  ...RewardStoreDefaultState,
  addReward: (reward: RewardType) =>
    set((state) => ({ rewards: [...state.rewards, reward] })),
  collectReward: () => {
    const [reward, ...rewards] = get().rewards;
    set({ rewards });
    return reward;
  },
}), { name: "reward-store" }));

export default useRewardStore;
