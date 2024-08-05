import useRewardStore from "@/home/store/rewardStore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const EXPERIENCE_PER_WIN = 15;
const DEFAULT_EXPERIENCE_FOR_NEXT_LEVEL = 25;
const GOLD_FOR_NEXT_LEVEL = 1500;
const LINERA_EXPERIENCE_GROWTH = 7;

export interface ExperienceReward {
	previousLevel: number;
	nextLevel: number;
	gold: number;
}

export interface ExperienceGain {
	previousExperience: number;
	nextExperience: number;
	previousLevel: number;
	nextLevel: number;
	previousExperienceForNextLevel: number;
}

const defaultState = {
	level: 1,
	experience: 0,
	experienceForNextLevel: DEFAULT_EXPERIENCE_FOR_NEXT_LEVEL,
	levelReward: [] as ExperienceReward[],
	lastExperienceGain: {
		previousExperience: 0,
		nextExperience: 0,
		previousLevel: 0,
		nextLevel: 0,
		previousExperienceForNextLevel: 0,
	} as ExperienceGain,
};

export default function ExperienceService() {
	const store = create(persist(() => defaultState, { name: "ExperienceServiceStore" }));

	function reset() {
		store.setState(defaultState);
	}

	function gainExperience() {
		const previousExperience = store.getState().experience;
		const previousLevel = store.getState().level;
		const previousExperienceForNextLevel = store.getState().experienceForNextLevel;
		let nextExperience = previousExperience + EXPERIENCE_PER_WIN;
		const nextLevel = previousLevel + Math.floor(nextExperience / previousExperienceForNextLevel);
		nextExperience = nextExperience % previousExperienceForNextLevel;
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
			store.setState({ experienceForNextLevel: DEFAULT_EXPERIENCE_FOR_NEXT_LEVEL + nextLevel * LINERA_EXPERIENCE_GROWTH });
		}
		store.setState({ lastExperienceGain: { previousExperience, previousExperienceForNextLevel, nextExperience, previousLevel, nextLevel } });
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

	function useWatchLastExperienceGain() {
		const {
			previousExperienceForNextLevel,
			previousExperience,
			nextExperience,
			previousLevel,
			nextLevel,
		} = store((state) => state.lastExperienceGain);

		return {
			experienceProgress: previousExperience / previousExperienceForNextLevel,
			experienceProgressTarget: nextExperience / store.getState().experienceForNextLevel,
			previousLevel,
			nextLevel,
		}
	}

	return {
		reset,
		gainExperience,
		collectReward,
		useWatchRewards,
		useWatchLevels,
		useWatchExperience,
		useWatchExperienceForNextLevel,
		useWatchLastExperienceGain,
	};
}