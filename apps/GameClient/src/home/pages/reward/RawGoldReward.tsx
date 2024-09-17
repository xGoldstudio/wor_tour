import { useEffect, useRef } from "react";
import { canStartAnimationContainer, startContainerAnimation } from "@/home/animations/Animations";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { RawGoldRewardType } from "@/home/store/rewardStore";

export default function RawGoldReward({ reward, removeCurrentReward }: { reward: RawGoldRewardType, removeCurrentReward: () => void }) {
	const hasAnimationStarted = useRef<boolean>(false);
	
	useEffect(() => {
		if (!canStartAnimationContainer() || hasAnimationStarted.current) return;
		hasAnimationStarted.current = true;
    startContainerAnimation({
      animationObject: {
        type: "money",
        previousValue: usePlayerStore.getState().gold,
        amount: reward.amount,
        onEnd: () => {
          removeCurrentReward();
          usePlayerStore.getState().addGold(reward.amount);
        },
      },
    });
  });

  return <></>;
}
