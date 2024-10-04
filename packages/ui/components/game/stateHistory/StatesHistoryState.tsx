import { animationTimeline } from "@repo/lib";
import { CardState, getStateData } from "game_engine";
import { EffectLayout } from "../../card/Effects";
import { useRef } from "react";
import { useSyncGameAnimation } from "../../card/useGameSyncAnimation";
import { useOnMount } from "../../../lib/lifecycle";

export default function StatesHistoryState({
  state,
  instanceId,
  setFocusedCard,
}: {
  state: CardState;
  instanceId: number;
  setFocusedCard: (instanceId: number | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { triggerAnimation } = useSyncGameAnimation();

  useOnMount(() => {
    triggerAnimation({
      replace: true,
      duration: 20,
      computeStyle: animationTimeline(20).add(
        ref.current,
        {
          x: -25,
          opacity: 0,
        },
        [{ values: { x: 0, opacity: 100 }, ease: [0, 1, 1, 1] }]
      ).progress,
    });
  });

  return (
    <div ref={ref} className="z-10">
      <EffectLayout
        effect={getStateData(state)}
        size={1}
        showDesc
        onShowDesc={() => setFocusedCard(instanceId)}
        onHideShowDesc={() => setFocusedCard(null)}
      />
    </div>
  );
}
