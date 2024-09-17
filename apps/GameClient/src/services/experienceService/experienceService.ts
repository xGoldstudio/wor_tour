import useRewardStore from "@/home/store/rewardStore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const EXPERIENCE_PER_WIN = 15;
const DEFAULT_EXPERIENCE_FOR_NEXT_LEVEL = 25;
const GOLD_FOR_NEXT_LEVEL = 1500;
const LINERA_EXPERIENCE_GROWTH = 7;

export interface ExperienceGain {
	previousExperience: number;
	nextExperience: number;
	previousLevel: number;
	nextLevel: number;
	previousExperienceForNextLevel: number;
}

const defaultState = () => ({
	level: 1,
	experience: 0,
	experienceForNextLevel: DEFAULT_EXPERIENCE_FOR_NEXT_LEVEL,
	lastExperienceGain: {
		previousExperience: 0,
		nextExperience: 0,
		previousLevel: 0,
		nextLevel: 0,
		previousExperienceForNextLevel: 0,
	} as ExperienceGain,
});

export default function ExperienceService() {
	const store = create(persist(defaultState, { name: "ExperienceServiceStore" }));

	function reset() {
		store.setState(defaultState());
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
				const rewardGoldAmount = GOLD_FOR_NEXT_LEVEL;
				useRewardStore.getState().addReward({
					type: "nextLevel",
					previousLevel: previousLevel + i,
					nextLevel: previousLevel + 1 + i,
					gold: rewardGoldAmount,
				});
				useRewardStore.getState().addReward({ type: "gold", amount: rewardGoldAmount });
				useRewardStore.getState().addReward({ type: "keys" });
			}
			store.setState({ experienceForNextLevel: DEFAULT_EXPERIENCE_FOR_NEXT_LEVEL + nextLevel * LINERA_EXPERIENCE_GROWTH });
		}
		store.setState({ lastExperienceGain: { previousExperience, previousExperienceForNextLevel, nextExperience, previousLevel, nextLevel } });
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
		useWatchLevels,
		useWatchExperience,
		useWatchExperienceForNextLevel,
		useWatchLastExperienceGain,
	};
}