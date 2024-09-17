import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RewardType = CardRewardType | GoldRewardType | ChestRewardType | KeyRewardType | KeysRewardType | RawGoldRewardType | RawTrophiesRewardType | NextLevelRewardType;

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

export interface NextLevelRewardType {
  type: "nextLevel";
  previousLevel: number;
	nextLevel: number;
	gold: number;
}

export interface RawGoldRewardType {
  type: "rawGold";
  amount: number;
}

export interface RawTrophiesRewardType {
  type: "rawTrophies";
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

const RewardPriorityOrder: Record<RewardType["type"], number> = {
  nextLevel: 1,
  gold: 2,
  key: 2,
  keys: 2,
  chest: 2,
  card: 2,
  rawGold: 3,
  rawTrophies: 3,
};

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
    set((state) => ({ rewards: [...state.rewards, reward].sort((a, b) => RewardPriorityOrder[a.type] - RewardPriorityOrder[b.type]) })),
  collectReward: () => {
    const [reward, ...rewards] = get().rewards;
    set({ rewards });
    return reward;
  },
  removeAllRewards: () => set({ rewards: [] }),
}), { name: "reward-store" }));

export default useRewardStore;
