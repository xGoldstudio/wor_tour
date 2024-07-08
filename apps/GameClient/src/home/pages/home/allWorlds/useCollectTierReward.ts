import usePlayerStore from "@/home/store/playerStore";
import useRewardStore from "@/home/store/rewardStore";

export default function useCollectTierReward(tierNumber: number) {
	const collectTierReward = usePlayerStore((state) => state.collectTierReward);
	const addReward = useRewardStore(s => s.addReward);

	return () => {
		const tier = collectTierReward(tierNumber);
		console.log(tier)
		if (!tier) {
			return;
		}
		addReward({ type: "chest" });
		addReward({ type: "gold", amount: tier.level.reward.gold });
		// booster
	};
}