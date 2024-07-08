import usePlayerStore from "@/home/store/playerStore";
import useRewardStore from "@/home/store/rewardStore";

export default function useCollectTierReward(tierNumber: number) {
	const tier = usePlayerStore((state) => state.tierState.get(tierNumber));
	const addReward = useRewardStore(s => s.addReward);

	if (!tier || !tier.isUnlocked || tier.isOpen) {
		return () => {};
	}

	return () => {
		addReward({ type: "chest" });
		addReward({ type: "gold", amount: tier.level.reward.gold });
	};
}