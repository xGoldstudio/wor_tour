import usePlayerStore from "@/home/store/playerStore/playerStore";
import useRewardStore from "@/home/store/rewardStore";
import useBooster from "@/home/store/useBooster/useBooster";

export default function useCollectTierReward(tierNumber: number) {
	const collectTierReward = usePlayerStore((state) => state.collectTierReward);
	const addReward = useRewardStore(s => s.addReward);
	const openBooster = useBooster();

	return () => {
		const tier = collectTierReward(tierNumber);
		if (!tier) {
			return;
		}
		addReward({ type: "chest" });
		addReward({ type: "gold", amount: tier.level.reward.gold });
		const booster = tier.level.reward.booster;
		if (booster) {
			openBooster(booster.name, false);
		}
	};
}