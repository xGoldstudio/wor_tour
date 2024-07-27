import usePlayerStore from "@/home/store/playerStore/playerStore";
import { ceilToValue } from "@repo/lib";
import { WORLD_GOLD_RATIO } from "@repo/ui";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const GoldPerVictory = 250;
export const MaxGoldPerDay = 5000;

const ceilToFive = ceilToValue(5);

function computeGoldWorldValue(value: number) {
	return (currentWorld: number) => ceilToFive(value * (WORLD_GOLD_RATIO ** (currentWorld - 1)));
}

export const getGoldPerVictory = computeGoldWorldValue(GoldPerVictory);
export const getMaxGoldPerDay = computeGoldWorldValue(MaxGoldPerDay);

function DailyGoldService() {
	const store = create(persist(() => (
		{
			dailyGoldConsumed: 0,
			dailyGoldLimit: 0,
			goldPerVictory: 0,
		}
	), { name: "DailyGoldServiceStore" }));
	
	function setDailyGold() {
		const currentWorld = usePlayerStore.getState().currentWorld;
		store.setState({
			dailyGoldConsumed: 0,
			dailyGoldLimit: getMaxGoldPerDay(currentWorld),
			goldPerVictory: getGoldPerVictory(currentWorld),
		});
	}

	function getGoldReward() {
		getGoldPerVictory(usePlayerStore.getState().currentWorld);
	}

	return {
		getGoldReward,
		setDailyGold,
		store,
	}
}

export const dailyGoldService = DailyGoldService();