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

	let currentWorld = usePlayerStore.getState().currentWorld;

	usePlayerStore.subscribe(state => {
		if (currentWorld < state.currentWorld) {
			reset();
		}
	});

	function setDailyGold() {
		store.setState({
			dailyGoldConsumed: 0,
			dailyGoldLimit: getMaxGoldPerDay(currentWorld),
			goldPerVictory: getGoldPerVictory(currentWorld),
		});
	}

	function getRemainingGold() {
		return store.getState().dailyGoldLimit - store.getState().dailyGoldConsumed;
	}

	function getGoldForGame(value: number) {
		return Math.min(value, getRemainingGold());
	}

	function getGoldWinReward() {
		return getGoldForGame(store.getState().goldPerVictory);
	}

	function getGoldLoseReward() {
		return getGoldForGame(Math.floor(store.getState().goldPerVictory / 3));
	}

	function earnReward(isWin: boolean) {
		const goldAmount = isWin ? getGoldWinReward() : getGoldLoseReward();
		store.setState({ dailyGoldConsumed: store.getState().dailyGoldConsumed + goldAmount });
	}

	function reset() {
		currentWorld = usePlayerStore.getState().currentWorld;
		setDailyGold();
	}

	return {
		getGoldWinReward,
		getGoldLoseReward,
		setDailyGold,
		earnReward,
		store,
		reset,
	}
}

export const dailyGoldService = DailyGoldService();