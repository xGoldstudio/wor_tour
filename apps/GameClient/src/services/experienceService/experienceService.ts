import useRewardStore from "@/home/store/rewardStore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const EXPERIENCE_PER_WIN = 15;
const GOLD_FOR_NEXT_LEVEL = 1500;

export interface ExperienceReward {
	previousLevel: number;
	nextLevel: number;
	gold: number;
}

const defaultState = {
	level: 1,
	experience: 0,
	experienceForNextLevel: 50,
	levelReward: [] as ExperienceReward[],
};

export default function ExperienceService() {
	const store = create(persist(() => defaultState, { name: "ExperienceServiceStore" }));

	function reset() {
		store.setState(defaultState);
	}

	function gainExperience() {
		const previousExperience = store.getState().experience;
		const previousLevel = store.getState().level;
		let nextExperience = previousExperience + EXPERIENCE_PER_WIN;
		const nextLevel = previousLevel + Math.floor(nextExperience / store.getState().experienceForNextLevel);
		nextExperience = nextExperience % store.getState().experienceForNextLevel;
		store.setState({ experience: nextExperience, level: nextLevel });
		const diff = nextLevel - previousLevel;
		if (diff) {
			for (let i = 0; i < diff; i++) {
				store.setState((state) => {
					const levelReward = state.levelReward;
					levelReward.push({ previousLevel: previousLevel + i, nextLevel: previousLevel + 1 + i, gold: GOLD_FOR_NEXT_LEVEL });
					return { levelReward: [...levelReward] };
				});
			}
			return {
				previousExperience,
				nextExperience,
				previousLevel,
				nextLevel,
			};
		}
	}

	function collectReward() {
		const reward = store.getState().levelReward.shift();
		store.setState({ levelReward: [...store.getState().levelReward] });
		if (!reward) {
			return;
		}
		useRewardStore.getState().addReward({ type: "gold", amount: reward.gold });
		useRewardStore.getState().addReward({ type: "keys" });
		return reward;
	}

	function useWatchRewards() {
		return store((state) => state.levelReward);
	}

	function useWatchLevels() {
		return store((state) => state.level);
	}

	function useWatchExperience() {
		return store((state) => state.experience);
	}

	function useWatchExperienceForNextLevel() {
		return store((state) => state.experienceForNextLevel);
	}

	return {
		reset,
		gainExperience,
		collectReward,
		useWatchRewards,
		useWatchLevels,
		useWatchExperience,
		useWatchExperienceForNextLevel,
	};
}