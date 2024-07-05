import { useRef } from "react";
import useGameEventListener from "./gameBehavior/useGameEventListener";
import { PlayerDamageResolveEvent } from "./gameBehavior/useGameEvents";
import { useSyncGameAnimation } from "./gameBehavior/animation/useGameSyncAnimation";
import animationTimeline from "./gameBehavior/animation/timeline";

export default function FlashDamage() {
  const bloodRef = useRef<HTMLDivElement | null>(null);
  const { triggerAnimation } = useSyncGameAnimation();
  useGameEventListener({
    type: "playerDamageResolve",
    action: (event) => {
			if ((event as PlayerDamageResolveEvent).initiator.damage < 200) {
				return;
			}
      if (bloodRef) {
        triggerAnimation({
          duration: 40,
          computeStyle: animationTimeline(40)
            .add(
              bloodRef.current,
							{
								opacity: 0,
							},
							[
								{ values: { opacity: 20 }, to: 20, ease: [0, 0.42, 1, 1] },
								{ values: { opacity: 0 }, ease: [0, 0.42, 1, 1] },
							]
            ).progress,
        });
      }
    },
    filter: (event) => (event as PlayerDamageResolveEvent).initiator.isPlayer,
  });

  return (
    <div
      className="absolute w-full h-full z-20 opacity-0 pointer-events-none bg-red-600"
      ref={bloodRef}
    />
  );
}
