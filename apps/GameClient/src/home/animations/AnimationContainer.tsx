import { useEffect, useRef } from "react";
import useAnimationStore from "../store/animationStore";
import { createPortal } from "react-dom";
import useRewardStore from "../store/rewardStore";
import { startContainerAnimation } from "./Animations";



export default function AnimationContainer() {
  const { animationsQueue, clearQueue } = useAnimationStore((state) => ({
    animationsQueue: state.queue,
    clearQueue: state.clearQueue,
  }));
  const container = useRef<HTMLDivElement | null>(null);
  const appContainer = document.getElementById("app");
  const rewards = useRewardStore((state) => state.rewards);

  useEffect(() => {
    if (
      container.current !== null &&
      animationsQueue.length > 0 &&
      rewards.length === 0
    ) {
      clearQueue().forEach((currentAnimation, index) => {
        startContainerAnimation({
          animationObject: currentAnimation,
          delay: index * 2,
        });
      });
    }
  }, [animationsQueue, container, rewards]);

  if (!appContainer) return null;

  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-[9999] pointer-events-none"
      id="animationsContainer"
      ref={container}
    ></div>,
    appContainer
  );
}
