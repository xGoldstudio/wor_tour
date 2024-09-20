import { useRef } from "react";
import { PlayerDamageResolveEvent } from "game_engine";
import { useGameEventListener, useSyncGameAnimation } from "@repo/ui";
import { animationTimeline } from "@repo/lib";

export default function FlashDamage() {
  const bloodRef = useRef<HTMLDivElement | null>(null);
  const { triggerAnimation } = useSyncGameAnimation();
  useGameEventListener({
    type: "playerDamageResolve",
    action: (event, state) => {
			if ((event as PlayerDamageResolveEvent).initiator.damage < (state.playerHp * 0.1)) {
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
