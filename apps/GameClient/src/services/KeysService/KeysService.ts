import useRewardStore from "@/home/store/rewardStore";
import openBooster from "@/home/store/useBooster/useBooster";
import { worldBoosters } from "@repo/ui";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clientLoop } from "../inject";

export const MAX_KEYS = 5;

export function KeysService() {
	const store = create(persist(
		() => ({
			keys: MAX_KEYS,
		}),
		{ name: "keys-service" },
	));

	function reset() {
		store.setState({ keys: MAX_KEYS });
	}

	function consumeKey(currentWorld: number) {
		if (store.getState().keys <= 0) {
			return;
		}
		store.setState({ keys: store.getState().keys - 1 });
		useRewardStore.getState().addReward({ type: "key" });
		const booster = worldBoosters[currentWorld - 1];
		if (booster) {
			openBooster(booster.name, false);
		}
		startEarning();
	}

	function startEarning() {
		if (store.getState().keys < MAX_KEYS) {
			clientLoop.pushTimer(
				"earnKey",
				"addKey",
				60 * 30,
				60 * 30,
				true,
				false,
			);
		} else {
			clientLoop.removeTimer("earnKey");
		}
	}

	function addKey() {
		store.setState({ keys: store.getState().keys + 1 });
		startEarning();
	}

	function hasKeyRewardWaiting() {
		return useRewardStore.getState().rewards.some((reward) => reward.type === "key");
	}

	function setMax() {
		store.setState({ keys: MAX_KEYS });
		clientLoop.removeTimer("earnKey");
	}

	const watchKeys = () => store((state) => state.keys);

	function getKeys() {
		return store.getState().keys;
	}

	return {
		addKey,
		reset,
		consumeKey,
		watchKeys,
		hasKeyRewardWaiting,
		setMax,
		getKeys,
	}
}
