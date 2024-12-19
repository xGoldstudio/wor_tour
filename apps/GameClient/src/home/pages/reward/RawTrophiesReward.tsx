import usePlayerStore from "@/home/store/playerStore/playerStore";
import useRewardStore, { RawTrophiesRewardType } from "@/home/store/rewardStore";
import { useEffect } from "react";

function onAnimationEnd(removeCurrentReward: () => void, reward: RawTrophiesRewardType) {
  removeCurrentReward();
  const hasChangeWorldOrTier = usePlayerStore.getState().addOrRemoveTrophies(reward.amount);
  console.log(hasChangeWorldOrTier);
  if (hasChangeWorldOrTier === "tier") {
    useRewardStore.getState().addReward({ type: "tier" });
  } else if (hasChangeWorldOrTier === "world") {
    useRewardStore.getState().addReward({ type: "world" });
  }
}

export default function RawTrophiesReward({ reward, removeCurrentReward }: { reward: RawTrophiesRewardType, removeCurrentReward: () => void }) {
	// const hasAnimationStarted = useRef<boolean>(false);
	
	useEffect(() => {
    onAnimationEnd(removeCurrentReward, reward);
		// if (!canStartAnimationContainer() || hasAnimationStarted.current) return;
		// hasAnimationStarted.current = true;
    // startContainerAnimation({
    //   animationObject: {
    //     type: "trophy",
    //     previousValue: usePlayerStore.getState().trophies,
    //     amount: reward.amount,
    //     onEnd: () => {
    //       onAnimationEnd(removeCurrentReward, reward);
    //     },
    //   },
    // });
  });

  return <></>;
}
