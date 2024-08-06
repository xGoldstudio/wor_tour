import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RewardType = CardRewardType | GoldRewardType | ChestRewardType | KeyRewardType | KeysRewardType;

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

export interface KeysRewardType {
  type: "keys";
}

export interface ChestRewardType {
  type: "chest";
}

export interface KeyRewardType {
  type: "key";
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
  removeAllRewards: () => void;
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
  removeAllRewards: () => set({ rewards: [] }),
}), { name: "reward-store" }));

export default useRewardStore;
