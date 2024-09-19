import { animationTimeline, CardState, getStateData } from "@repo/lib";
import { EffectLayout } from "../../card/Effects";
import { useRef } from "react";
import { useSyncGameAnimation } from "../../card/useGameSyncAnimation";
import { useOnMount } from "../../../lib/lifecycle";

export default function StatesHistoryState({ state }: { state: CardState }) {
  const ref = useRef<HTMLDivElement>(null);

  const { triggerAnimation } = useSyncGameAnimation();

	useOnMount(() => {
		triggerAnimation({
			replace: true,
			duration: 20,
			computeStyle: animationTimeline(20).add(ref.current, {
				x: -25,
				opacity: 0,
			}, [
				{ values: { x: 0, opacity: 100 }, ease: [0, 1, 1, 1] },
			]).progress,
		});
	})
	
	return (
    <div ref={ref} className="z-10">
      <EffectLayout effect={getStateData(state)} size={1} showDesc />
    </div>
  );
}
